import {
  BaseField,
  DocumentType,
  IDocument,
  IField,
  IParentType,
  PrimitiveDocument,
} from '../models/datamapper/document';
import {
  ChooseItem,
  ConditionItem,
  FieldItem,
  ForEachItem,
  IfItem,
  MappingItem,
  MappingParentType,
  MappingTree,
  OtherwiseItem,
  ValueSelector,
  ValueType,
  WhenItem,
} from '../models/datamapper/mapping';
import xmlFormat from 'xml-formatter';
import { MappingService } from './mapping.service';
import { MappingSerializerJsonAddon } from './mapping-serializer-json-addon';
import { NS_XSL } from '../models/datamapper/xslt';
import { XmlSchemaDocumentService } from './xml-schema-document.service';

export const DO_NOT_EDIT_COMMENT = '<!-- This file is generated by Kaoto DataMapper. Do not edit. -->';
export const EMPTY_XSL = `<?xml version="1.0" encoding="UTF-8"?>
${DO_NOT_EDIT_COMMENT}
<xsl:stylesheet version="3.0" xmlns:xsl="${NS_XSL}">
  <xsl:output method="xml" indent="yes"/>
</xsl:stylesheet>
`;

export class MappingSerializerService {
  static createNew() {
    return new DOMParser().parseFromString(EMPTY_XSL, 'application/xml');
  }

  private static sortFields(left: IField, right: IField) {
    return left.parent.fields.indexOf(left) - right.parent.fields.indexOf(right);
  }

  private static sortMappingItem(left: MappingItem, right: MappingItem) {
    const leftFields =
      left instanceof FieldItem ? [left.field] : MappingService.getConditionalFields(left as ConditionItem);
    if (leftFields.length === 0) return 1;
    if (leftFields.find((f) => f.isAttribute)) return -1;
    const rightFields =
      right instanceof FieldItem ? [right.field] : MappingService.getConditionalFields(right as ConditionItem);
    if (rightFields.length === 0) return -1;
    if (rightFields.find((f) => f.isAttribute)) return 1;
    const leftFirst = leftFields.sort(MappingSerializerService.sortFields)[0];
    const rightFirst = rightFields.sort(MappingSerializerService.sortFields)[0];
    return leftFirst.parent.fields.indexOf(leftFirst) - rightFirst.parent.fields.indexOf(rightFirst);
  }

  /**
   * Serialize the {@link MappingTree} model object into an XSLT mappings document string.
   * @param mappings {@link MappingTree} object to write
   * @param sourceParameterMap source paramter map
   */
  static serialize(mappings: MappingTree, sourceParameterMap: Map<string, IDocument>): string {
    const xslt = MappingSerializerService.createNew();
    MappingSerializerService.populateNamespaces(xslt, mappings.namespaceMap);
    MappingSerializerService.populateParam(xslt, sourceParameterMap);
    const root = MappingSerializerService.populateMappingRoot(xslt, mappings);
    mappings.children.sort(MappingSerializerService.sortMappingItem).forEach((mapping) => {
      MappingSerializerService.populateMapping(root, mapping);
    });
    return xmlFormat(new XMLSerializer().serializeToString(xslt));
  }

  private static populateNamespaces(xslt: Document, namespaceMap: { [prefix: string]: string }) {
    const rootElement = xslt.documentElement;
    Object.entries(namespaceMap).forEach(
      ([prefix, uri]) => prefix && uri && rootElement.setAttribute(`xmlns:${prefix}`, uri),
    );
  }

  private static getRootStyleSheet(xsltDocument: Document) {
    const prefix = xsltDocument.lookupPrefix(NS_XSL);
    const nsResolver = xsltDocument.createNSResolver(xsltDocument);
    return xsltDocument
      .evaluate(`/${prefix}:stylesheet`, xsltDocument, nsResolver, XPathResult.ANY_TYPE)
      .iterateNext()! as Element;
  }

  private static populateMappingRoot(xsltDocument: Document, mappings: MappingTree) {
    const template = xsltDocument.createElementNS(NS_XSL, 'template');
    template.setAttribute('match', '/');
    const stylesheet = MappingSerializerService.getRootStyleSheet(xsltDocument);
    stylesheet.appendChild(template);

    const jsonRoot = MappingSerializerJsonAddon.populateJsonTargetBase(mappings, template);
    if (jsonRoot) return jsonRoot;

    return template;
  }

  private static populateParam(xsltDocument: Document, sourceParameterMap: Map<string, IDocument>) {
    const stylesheet = MappingSerializerService.getRootStyleSheet(xsltDocument);
    sourceParameterMap.forEach((doc, paramName) => {
      const prefix = xsltDocument.lookupPrefix(NS_XSL);
      const nsResolver = xsltDocument.createNSResolver(xsltDocument);
      const existing = xsltDocument
        .evaluate(
          `/${prefix}:stylesheet/${prefix}:param[@name='${paramName}']`,
          xsltDocument,
          nsResolver,
          XPathResult.ANY_TYPE,
        )
        .iterateNext();
      if (existing) return;

      const xsltParam = xsltDocument.createElementNS(NS_XSL, 'param');
      xsltParam.setAttribute('name', paramName);
      stylesheet.appendChild(xsltParam);

      MappingSerializerJsonAddon.populateJsonToXmlVariable(doc, stylesheet, paramName);
    });
  }

  private static populateMapping(parent: Element, mapping: MappingItem) {
    let child: Element | null = null;
    if (mapping instanceof ValueSelector) {
      child = MappingSerializerService.populateValueSelector(parent, mapping);
    } else if (mapping instanceof FieldItem) {
      child = MappingSerializerService.populateFieldItem(parent, mapping);
    } else if (mapping instanceof IfItem) {
      child = MappingSerializerService.populateIfItem(parent, mapping);
    } else if (mapping instanceof ChooseItem) {
      child = MappingSerializerService.populateChooseItem(parent, mapping);
    } else if (mapping instanceof ForEachItem) {
      child = MappingSerializerService.populateForEachItem(parent, mapping);
    } else if (mapping instanceof WhenItem) {
      child = MappingSerializerService.populateWhenItem(parent, mapping);
    } else if (mapping instanceof OtherwiseItem) {
      child = MappingSerializerService.populateOtherwiseItem(parent, mapping);
    }
    if (child)
      mapping.children
        .sort(MappingSerializerService.sortMappingItem)
        .forEach((childItem) => MappingSerializerService.populateMapping(child!, childItem));
  }

  private static populateValueSelector(parent: Element, selector: ValueSelector) {
    const xsltDocument = parent.ownerDocument;
    switch (selector.valueType) {
      case ValueType.CONTAINER: {
        const copyOf = xsltDocument.createElementNS(NS_XSL, 'copy-of');
        copyOf.setAttribute('select', selector.expression);
        parent.appendChild(copyOf);
        return copyOf;
      }
      default: {
        const valueOf = xsltDocument.createElementNS(NS_XSL, 'value-of');
        valueOf.setAttribute('select', selector.expression);
        parent.appendChild(valueOf);
        return valueOf;
      }
    }
  }

  private static populateFieldItem(parent: Element, mapping: FieldItem) {
    const xsltDocument = parent.ownerDocument;
    if (mapping.field.isAttribute) {
      const xslAttribute = xsltDocument.createElementNS(NS_XSL, 'attribute');
      xslAttribute.setAttribute('name', mapping.field.name);
      mapping.field.namespaceURI && xslAttribute.setAttribute('namespace', mapping.field.namespaceURI);
      parent.appendChild(xslAttribute);
      return xslAttribute;
    } else {
      const jsonElement = MappingSerializerJsonAddon.populateFieldItem(parent, mapping);
      if (jsonElement) return jsonElement;

      const element = mapping.field.namespaceURI
        ? xsltDocument.createElementNS(mapping.field.namespaceURI, mapping.field.name)
        : xsltDocument.createElement(mapping.field.name);
      parent.appendChild(element);
      return element;
    }
  }

  private static populateIfItem(parent: Element, mapping: IfItem) {
    const xsltDocument = parent.ownerDocument;
    const xslIf = xsltDocument.createElementNS(NS_XSL, 'if');
    xslIf.setAttribute('test', mapping.expression);
    parent.appendChild(xslIf);
    return xslIf;
  }

  private static populateChooseItem(parent: Element, _mapping: ChooseItem) {
    const xsltDocument = parent.ownerDocument;
    const xslChoose = xsltDocument.createElementNS(NS_XSL, 'choose');
    parent.appendChild(xslChoose);
    return xslChoose;
  }

  private static populateForEachItem(parent: Element, mapping: ForEachItem) {
    const xsltDocument = parent.ownerDocument;
    const xslForEach = xsltDocument.createElementNS(NS_XSL, 'for-each');
    xslForEach.setAttribute('select', mapping.expression);
    parent.appendChild(xslForEach);
    return xslForEach;
  }

  private static populateWhenItem(parent: Element, mapping: WhenItem) {
    const xsltDocument = parent.ownerDocument;
    const xslWhen = xsltDocument.createElementNS(NS_XSL, 'when');
    xslWhen.setAttribute('test', mapping.expression);
    parent.appendChild(xslWhen);
    return xslWhen;
  }

  private static populateOtherwiseItem(parent: Element, _mapping: OtherwiseItem) {
    const xsltDocument = parent.ownerDocument;
    const xslOtherwise = xsltDocument.createElementNS(NS_XSL, 'otherwise');
    parent.appendChild(xslOtherwise);
    return xslOtherwise;
  }

  /**
   * Deserialize the XSLT mappings document into a {@link MappingTree} model object.
   * @param xslt XSLT mappings document in string format
   * @param targetDocument Target Document
   * @param mappingTree {@link MappingTree} object to write
   * @param sourceParameterMap source parameter map
   */
  static deserialize(
    xslt: string,
    targetDocument: IDocument,
    mappingTree: MappingTree,
    sourceParameterMap: Map<string, IDocument>,
  ): MappingTree {
    mappingTree.children = [];
    const xsltDoc = new DOMParser().parseFromString(xslt, 'application/xml');
    const template = xsltDoc.getElementsByTagNameNS(NS_XSL, 'template')[0];
    if (!template?.children) return mappingTree;
    MappingSerializerService.restoreNamespaces(xsltDoc, mappingTree);
    MappingSerializerService.restoreParam(xsltDoc, sourceParameterMap);
    const root = MappingSerializerJsonAddon.getJsonTargetBase(xsltDoc, mappingTree) ?? template;
    Array.from(root.children).forEach((item) =>
      MappingSerializerService.restoreMapping(item, targetDocument, mappingTree),
    );
    return mappingTree;
  }

  private static restoreNamespaces(xsltDocument: Document, mappingTree: MappingTree) {
    mappingTree.namespaceMap = {};
    const rootElement = xsltDocument.documentElement;
    Array.from(rootElement.attributes).forEach((attr) => {
      if (!attr.nodeName.includes(':') || !attr.nodeValue || attr.nodeValue === NS_XSL) return;
      const splitted = attr.nodeName.split(':');
      if (splitted[0] === 'xmlns') mappingTree.namespaceMap[splitted[1]] = attr.nodeValue;
    });
  }

  private static restoreParam(xsltDocument: Document, sourceParameterMap: Map<string, IDocument>) {
    const prefix = xsltDocument.lookupPrefix(NS_XSL);
    const nsResolver = xsltDocument.createNSResolver(xsltDocument);
    const params = xsltDocument.evaluate(
      `/${prefix}:stylesheet/${prefix}:param`,
      xsltDocument,
      nsResolver,
      XPathResult.ANY_TYPE,
    );
    let param: Node | null;
    while ((param = params.iterateNext())) {
      const paramEl = param as Element;
      const name = paramEl.getAttribute('name');
      if (!name || sourceParameterMap.has(name)) continue;
      sourceParameterMap.set(name, new PrimitiveDocument(DocumentType.PARAM, name));
    }
  }

  private static restoreMapping(item: Element, parentField: IParentType, parentMapping: MappingParentType) {
    let mappingItem: MappingItem | null = null;
    let fieldItem: IParentType | null = null;
    if (item.namespaceURI === NS_XSL) {
      switch (item.localName) {
        case 'copy-of': {
          const selector = new ValueSelector(parentMapping, ValueType.CONTAINER);
          selector.expression = item.getAttribute('select') || '';
          mappingItem = selector;
          break;
        }
        case 'value-of': {
          const valueType =
            'isAttribute' in parentField && parentField.isAttribute ? ValueType.ATTRIBUTE : ValueType.VALUE;
          const selector = new ValueSelector(parentMapping, valueType);
          selector.expression = item.getAttribute('select') || '';
          mappingItem = selector;
          break;
        }
        case 'if': {
          const ifItem = new IfItem(parentMapping);
          ifItem.expression = item.getAttribute('test') || '';
          mappingItem = ifItem;
          break;
        }
        case 'choose': {
          mappingItem = new ChooseItem(parentMapping);
          break;
        }
        case 'when': {
          const whenItem = new WhenItem(parentMapping);
          whenItem.expression = item.getAttribute('test') || '';
          mappingItem = whenItem;
          break;
        }
        case 'otherwise': {
          mappingItem = new OtherwiseItem(parentMapping);
          break;
        }
        case 'for-each': {
          const forEachItem = new ForEachItem(parentMapping);
          forEachItem.expression = item.getAttribute('select') || '';
          mappingItem = forEachItem;
          break;
        }
        case 'attribute': {
          if (parentField instanceof PrimitiveDocument) return;
          const field = MappingSerializerService.getOrCreateAttributeField(item, parentField);
          if (!field) return;
          fieldItem = field;
          mappingItem = new FieldItem(parentMapping, field);
          break;
        }
      }
    } else {
      if (parentField instanceof PrimitiveDocument) return;
      const field = MappingSerializerService.getOrCreateElementField(item, parentField);
      if (!field) return;
      fieldItem = field;
      mappingItem = new FieldItem(parentMapping, field);
    }
    if (mappingItem) {
      parentMapping.children.push(mappingItem);
      Array.from(item.children).forEach((childItem) =>
        MappingSerializerService.restoreMapping(childItem, fieldItem ? fieldItem : parentField, mappingItem!),
      );
    }
  }

  private static getOrCreateAttributeField(item: Element, parentField: IParentType): IField | null {
    const namespace = item.getAttribute('namespace');
    const name = item.getAttribute('name');
    if (!name) return null;
    const existing = XmlSchemaDocumentService.getChildField(parentField, name, namespace);
    if (existing) return existing;
    const field = new BaseField(
      parentField,
      'ownerDocument' in parentField ? parentField.ownerDocument : parentField,
      name,
    );
    field.isAttribute = true;
    field.namespaceURI = namespace;
    parentField.fields.push(field);
    return field;
  }

  private static getOrCreateElementField(item: Element, parentField: IParentType): IField {
    const jsonField = MappingSerializerJsonAddon.getOrCreateJsonField(item, parentField);
    if (jsonField) return jsonField;

    const namespace = item.namespaceURI;
    const name = item.localName;
    const existing = XmlSchemaDocumentService.getChildField(parentField, name, namespace);
    if (existing) return existing;
    const field = new BaseField(
      parentField,
      'ownerDocument' in parentField ? parentField.ownerDocument : parentField,
      name,
    );
    field.namespaceURI = namespace;
    parentField.fields.push(field);
    return field;
  }
}
