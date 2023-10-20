import { FunctionComponent, PropsWithChildren, Ref, MouseEvent, useCallback, useContext, useState } from 'react';
import { EntitiesContext } from '../../../../providers/entities.provider';
import {
  MenuToggle,
  MenuToggleAction,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Tooltip,
} from '@patternfly/react-core';
import { ISourceSchema, sourceSchemaConfig, SourceSchemaType } from '../../../../models/camel';

interface ISourceTypeSelector extends PropsWithChildren {
  isStatic?: boolean;
  onSelect?: (value: SourceSchemaType) => void;
}

export const FlowTypeSelector: FunctionComponent<ISourceTypeSelector> = (props) => {
  const { currentSchemaType, visualEntities } = useContext(EntitiesContext)!;
  const totalFlowsCount = visualEntities.length;
  const currentFlowType: ISourceSchema = sourceSchemaConfig.config[currentSchemaType];
  const [isOpen, setIsOpen] = useState(false);

  /** Toggle the DSL dropdown */
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  /** Selecting a DSL checking the the existing flows */
  const onSelect = useCallback(
    (_event: MouseEvent | undefined, flowType: string | number | undefined) => {
      if (flowType) {
        const dsl = sourceSchemaConfig.config[flowType as SourceSchemaType];

        setIsOpen(false);
        if (typeof props.onSelect === 'function' && dsl !== undefined) {
          props.onSelect(flowType as SourceSchemaType);
        }
      }
    },
    [props],
  );

  /** Selecting the same DSL directly*/
  const onNewSameTypeRoute = useCallback(() => {
    onSelect(undefined, currentSchemaType);
  }, [onSelect, currentSchemaType]);

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <MenuToggle
      data-testid="dsl-list-dropdown"
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
      splitButtonOptions={{
        variant: 'action',
        items: [
          <Tooltip
            key="dsl-list-tooltip"
            position="bottom"
            content={
              currentFlowType.multipleRoute ? (
                <p>Add a new {currentFlowType.name} route</p>
              ) : (
                <p>The {currentFlowType.name} type doesn't support multiple routes</p>
              )
            }
          >
            <MenuToggleAction
              id="dsl-list-btn"
              key="dsl-list-btn"
              data-testid="dsl-list-btn"
              aria-label="DSL list"
              onClick={onNewSameTypeRoute}
              isDisabled={!sourceSchemaConfig.config[currentSchemaType].multipleRoute && totalFlowsCount > 0}
            >
              {props.children}
            </MenuToggleAction>
          </Tooltip>,
        ],
      }}
    />
  );

  return (
    <Select
      id="dsl-list-select"
      isOpen={isOpen}
      selected={currentSchemaType}
      onSelect={onSelect}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
      toggle={toggle}
    >
      <SelectList>
        {Object.entries({
          [SourceSchemaType.Route]: sourceSchemaConfig.config[SourceSchemaType.Route],
          [SourceSchemaType.Pipe]: sourceSchemaConfig.config[SourceSchemaType.Pipe],
        }).map((obj, index) => {
          const sourceType = obj[0] as SourceSchemaType;
          const sourceSchema = obj[1] as ISourceSchema;
          const isOptionDisabled =
            sourceSchema.name === currentFlowType.name && !sourceSchema.multipleRoute && totalFlowsCount > 0;
          return (
            <SelectOption
              key={`dsl-${sourceSchema.schema?.name ?? index}`}
              data-testid={`dsl-${sourceSchema.schema?.name}`}
              itemId={sourceType}
              description={
                <span className="pf-u-text-break-word">
                  {(sourceSchema.schema?.schema as { description: string }).description ?? ''}
                </span>
              }
              isDisabled={isOptionDisabled}
            >
              {sourceSchema.name}
              {isOptionDisabled && ' (single route only)'}
            </SelectOption>
          );
        })}
      </SelectList>
    </Select>
  );
};