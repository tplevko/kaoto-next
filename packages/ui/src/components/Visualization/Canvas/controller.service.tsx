import {
  ComponentFactory,
  DagreGroupsLayout,
  Graph,
  GraphComponent,
  GraphElement,
  Layout,
  LEFT_TO_RIGHT,
  ModelKind,
  TOP_TO_BOTTOM,
  Visualization,
  withPanZoom,
  ContextMenuItem,
  withContextMenu,
} from '@patternfly/react-topology';
import { CustomGroupWithSelection, CustomNodeWithSelection, NoBendpointsEdge } from '../Custom';
import { PlaceholderNodeWithDnD } from '../Custom/Node/PlaceholderNode';
import { LayoutType } from './canvas.models';
import { CustomEdge } from '../Custom/Edge/CustomEdge';
import { VisualFlowsApi } from '../../../models/visualization/flows/support/flows-visibility';
import { CamelResource, SourceSchemaType } from '../../../testing-api';
import { EntityType } from '../../../models/camel/entities';

export class ControllerService {
  static createController(
    visualFlowsApi?: VisualFlowsApi,
    camelResource?: CamelResource,
    updateEntitiesFromCamelResource?: () => void,
  ): Visualization {
    const newController = new Visualization();

    newController.registerLayoutFactory(this.baselineLayoutFactory);
    newController.registerComponentFactory((kind, type) =>
      this.baselineComponentFactory(kind, type, visualFlowsApi, camelResource, updateEntitiesFromCamelResource),
    );
    newController.registerElementFactory(this.baselineElementFactory);
    newController.fromModel({
      graph: {
        id: 'g1',
        type: 'graph',
      },
    });

    return newController;
  }

  static baselineLayoutFactory(type: string, graph: Graph): Layout | undefined {
    const isHorizontal = type === LayoutType.DagreHorizontal;

    return new DagreGroupsLayout(graph, {
      rankdir: isHorizontal ? LEFT_TO_RIGHT : TOP_TO_BOTTOM,
      nodeDistance: isHorizontal ? 30 : 40,
      ranker: 'network-simplex',
      nodesep: 10,
      edgesep: 10,
      ranksep: 0,
    });
  }
  static baselineComponentFactory(
    kind: ModelKind,
    type: string,
    visualFlowsApi?: VisualFlowsApi,
    camelResource?: CamelResource,
    updateEntitiesFromCamelResource?: () => void,
  ): ReturnType<ComponentFactory> {
    const contextMenuItem = (label: string): React.ReactElement => {
      return (
        <ContextMenuItem
          key={label}
          onClick={() => {
            if (label === 'Show all') {
              visualFlowsApi?.showFlows();
            } else if (label === 'Hide all') {
              visualFlowsApi?.hideFlows();
            } else if (label === 'Add new entity') {
              if (camelResource?.getType() !== SourceSchemaType.Route) {
                return;
              }
              const newId = camelResource?.addNewEntity(EntityType.Route);
              if (newId) {
                visualFlowsApi?.toggleFlowVisible(newId);
              }
              updateEntitiesFromCamelResource?.();
            }
          }}
        >
          {label}
        </ContextMenuItem>
      );
    };
    const createContextMenuItems = (...labels: string[]): React.ReactElement[] => labels.map(contextMenuItem);
    const contextMenuLabels = [
      'Show all',
      'Hide all',
      camelResource?.getType() === SourceSchemaType.Route ? 'Add new entity' : undefined,
    ].filter((label): label is string => label !== undefined);
    const contextMenu = createContextMenuItems(...contextMenuLabels);

    switch (type) {
      case 'group':
        return CustomGroupWithSelection;
      case 'node-placeholder':
        return PlaceholderNodeWithDnD;
      default:
        switch (kind) {
          case ModelKind.graph:
            return withPanZoom()(withContextMenu(() => contextMenu)(GraphComponent));
          case ModelKind.node:
            return CustomNodeWithSelection;
          case ModelKind.edge:
            return CustomEdge;
          default:
            return undefined;
        }
    }
  }

  static baselineElementFactory(kind: ModelKind): GraphElement | undefined {
    switch (kind) {
      case ModelKind.edge:
        return new NoBendpointsEdge();
      default:
        return undefined;
    }
  }
}
