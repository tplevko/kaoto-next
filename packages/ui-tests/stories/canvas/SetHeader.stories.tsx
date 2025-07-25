import { CanvasFormTabsContext, SuggestionRegistryProvider } from '@kaoto/forms';
import {
  CanvasNode,
  CanvasSideBar,
  IVisualizationNode,
  IVisualizationNodeData,
  NodeIconResolver,
  NodeIconType,
  VisibleFlowsProvider,
} from '@kaoto/kaoto/testing';
import { NodeShape } from '@patternfly/react-topology';
import { Meta, StoryFn } from '@storybook/react';

const selectedNode: CanvasNode = {
  id: 'setHeader-1234',
  label: 'setHeader',
  parentNode: undefined,
  shape: NodeShape.rect,
  type: 'node',
  data: {
    vizNode: {
      children: undefined,
      data: {
        label: 'setHeader',
        path: 'sink',
        isPlaceholder: false,
        icon: NodeIconResolver.getIcon('setHeader', NodeIconType.EIP),
      } as IVisualizationNodeData,
      id: 'setHeader-1234',
      nextNode: undefined,
      parentNode: undefined,
      previousNode: undefined,
      label: 'test',
      getId: () => 'setHeader-1234',
      getNodeTitle: () => 'SetHeader',
      getOmitFormFields: () => [],
      getComponentSchema: () => {
        return {
          schema: {
            title: 'Set Header',
            description: 'Sets the value of a message header',
            type: 'object',
            additionalProperties: false,
            anyOf: [
              {
                oneOf: [
                  {
                    type: 'object',
                    anyOf: [
                      {
                        oneOf: [
                          {
                            type: 'object',
                            required: ['constant'],
                            properties: {
                              constant: {
                                $ref: '#/definitions/org.apache.camel.model.language.ConstantExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['csimple'],
                            properties: {
                              csimple: {
                                $ref: '#/definitions/org.apache.camel.model.language.CSimpleExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['datasonnet'],
                            properties: {
                              datasonnet: {
                                $ref: '#/definitions/org.apache.camel.model.language.DatasonnetExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['exchangeProperty'],
                            properties: {
                              exchangeProperty: {
                                $ref: '#/definitions/org.apache.camel.model.language.ExchangePropertyExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['groovy'],
                            properties: {
                              groovy: {
                                $ref: '#/definitions/org.apache.camel.model.language.GroovyExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['header'],
                            properties: {
                              header: {
                                $ref: '#/definitions/org.apache.camel.model.language.HeaderExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['hl7terser'],
                            properties: {
                              hl7terser: {
                                $ref: '#/definitions/org.apache.camel.model.language.Hl7TerserExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['java'],
                            properties: {
                              java: {
                                $ref: '#/definitions/org.apache.camel.model.language.JavaExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['joor'],
                            properties: {
                              joor: {
                                $ref: '#/definitions/org.apache.camel.model.language.JoorExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['jq'],
                            properties: {
                              jq: {
                                $ref: '#/definitions/org.apache.camel.model.language.JqExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['js'],
                            properties: {
                              js: {
                                $ref: '#/definitions/org.apache.camel.model.language.JavaScriptExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['jsonpath'],
                            properties: {
                              jsonpath: {
                                $ref: '#/definitions/org.apache.camel.model.language.JsonPathExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['language'],
                            properties: {
                              language: {
                                $ref: '#/definitions/org.apache.camel.model.language.LanguageExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['method'],
                            properties: {
                              method: {
                                $ref: '#/definitions/org.apache.camel.model.language.MethodCallExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['mvel'],
                            properties: {
                              mvel: {
                                $ref: '#/definitions/org.apache.camel.model.language.MvelExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['ognl'],
                            properties: {
                              ognl: {
                                $ref: '#/definitions/org.apache.camel.model.language.OgnlExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['python'],
                            properties: {
                              python: {
                                $ref: '#/definitions/org.apache.camel.model.language.PythonExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['ref'],
                            properties: {
                              ref: {
                                $ref: '#/definitions/org.apache.camel.model.language.RefExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['simple'],
                            properties: {
                              simple: {
                                $ref: '#/definitions/org.apache.camel.model.language.SimpleExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['spel'],
                            properties: {
                              spel: {
                                $ref: '#/definitions/org.apache.camel.model.language.SpELExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['tokenize'],
                            properties: {
                              tokenize: {
                                $ref: '#/definitions/org.apache.camel.model.language.TokenizerExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['variable'],
                            properties: {
                              variable: {
                                $ref: '#/definitions/org.apache.camel.model.language.VariableExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['wasm'],
                            properties: {
                              wasm: {
                                $ref: '#/definitions/org.apache.camel.model.language.WasmExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['xpath'],
                            properties: {
                              xpath: {
                                $ref: '#/definitions/org.apache.camel.model.language.XPathExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['xquery'],
                            properties: {
                              xquery: {
                                $ref: '#/definitions/org.apache.camel.model.language.XQueryExpression',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['xtokenize'],
                            properties: {
                              xtokenize: {
                                $ref: '#/definitions/org.apache.camel.model.language.XMLTokenizerExpression',
                              },
                            },
                          },
                        ],
                      },
                    ],
                    properties: {
                      constant: {},
                      csimple: {},
                      datasonnet: {},
                      exchangeProperty: {},
                      groovy: {},
                      header: {},
                      hl7terser: {},
                      java: {},
                      joor: {},
                      jq: {},
                      js: {},
                      jsonpath: {},
                      language: {},
                      method: {},
                      mvel: {},
                      ognl: {},
                      python: {},
                      ref: {},
                      simple: {},
                      spel: {},
                      tokenize: {},
                      variable: {},
                      wasm: {},
                      xpath: {},
                      xquery: {},
                      xtokenize: {},
                    },
                  },
                  {
                    not: {
                      anyOf: [
                        {
                          required: ['expression'],
                        },
                        {
                          required: ['constant'],
                        },
                        {
                          required: ['csimple'],
                        },
                        {
                          required: ['datasonnet'],
                        },
                        {
                          required: ['exchangeProperty'],
                        },
                        {
                          required: ['groovy'],
                        },
                        {
                          required: ['header'],
                        },
                        {
                          required: ['hl7terser'],
                        },
                        {
                          required: ['java'],
                        },
                        {
                          required: ['joor'],
                        },
                        {
                          required: ['jq'],
                        },
                        {
                          required: ['js'],
                        },
                        {
                          required: ['jsonpath'],
                        },
                        {
                          required: ['language'],
                        },
                        {
                          required: ['method'],
                        },
                        {
                          required: ['mvel'],
                        },
                        {
                          required: ['ognl'],
                        },
                        {
                          required: ['python'],
                        },
                        {
                          required: ['ref'],
                        },
                        {
                          required: ['simple'],
                        },
                        {
                          required: ['spel'],
                        },
                        {
                          required: ['tokenize'],
                        },
                        {
                          required: ['variable'],
                        },
                        {
                          required: ['wasm'],
                        },
                        {
                          required: ['xpath'],
                        },
                        {
                          required: ['xquery'],
                        },
                        {
                          required: ['xtokenize'],
                        },
                      ],
                    },
                  },
                  {
                    type: 'object',
                    required: ['expression'],
                    properties: {
                      expression: {
                        title: 'Expression',
                        description: 'Expression to return the value of the header',
                        $ref: '#/definitions/org.apache.camel.model.language.ExpressionDefinition',
                      },
                    },
                  },
                ],
                format: 'expression',
              },
            ],
            properties: {
              id: {
                type: 'string',
                title: 'Id',
                description: 'Sets the id of this node',
                $comment: 'group:common',
              },
              description: {
                type: 'string',
                title: 'Description',
                description: 'Sets the description of this node',
                $comment: 'group:common',
              },
              disabled: {
                type: 'boolean',
                title: 'Disabled',
                description:
                  'Whether to disable this EIP from the route during build time. Once an EIP has been disabled then it cannot be enabled later at runtime.',
                $comment: 'group:advanced',
              },
              name: {
                type: 'string',
                title: 'Name',
                description:
                  'Name of message header to set a new value The simple language can be used to define a dynamic evaluated header name to be used. Otherwise a constant name will be used.',
                $comment: 'group:common',
              },
              expression: {},
              constant: {},
              csimple: {},
              datasonnet: {},
              exchangeProperty: {},
              groovy: {},
              header: {},
              hl7terser: {},
              java: {},
              joor: {},
              jq: {},
              js: {},
              jsonpath: {},
              language: {},
              method: {},
              mvel: {},
              ognl: {},
              python: {},
              ref: {},
              simple: {},
              spel: {},
              tokenize: {},
              variable: {},
              wasm: {},
              xpath: {},
              xquery: {},
              xtokenize: {},
            },
            required: ['name', 'expression'],
          },
        };
      },
      updateModel: () => {},
      getBaseEntity: () => {},
    } as unknown as IVisualizationNode,
  },
};

export default {
  title: 'Canvas/SetHeader',
  component: CanvasSideBar,
  decorators: [
    (Story: StoryFn) => (
      <SuggestionRegistryProvider>
        <Story />
      </SuggestionRegistryProvider>
    ),
  ],
} as Meta<typeof CanvasSideBar>;

const Template: StoryFn<typeof CanvasSideBar> = (args) => {
  return (
    <CanvasFormTabsContext.Provider
      value={{
        selectedTab: 'All',
        setSelectedTab: () => {},
      }}
    >
      <VisibleFlowsProvider>
        <CanvasSideBar {...args} onClose={() => {}} />
      </VisibleFlowsProvider>
    </CanvasFormTabsContext.Provider>
  );
};

export const SetHeaderNode = Template.bind({});
SetHeaderNode.args = {
  selectedNode,
};
