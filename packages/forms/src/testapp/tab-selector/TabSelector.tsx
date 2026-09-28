import { ContentSwitcher, Switch } from '@carbon/react';
import { FunctionComponent, useContext } from 'react';
import { CanvasFormTabsContext } from '../../form/providers/canvas-form-tabs.provider';

const TAB_INDEX: Record<string, number> = { All: 0, Required: 1, Modified: 2 };
const INDEX_TAB = ['All', 'Required', 'Modified'] as const;

export const TabSelector: FunctionComponent = () => {
  const { selectedTab, setSelectedTab } = useContext(CanvasFormTabsContext);

  return (
    <ContentSwitcher
      size="md"
      selectedIndex={TAB_INDEX[selectedTab] ?? 0}
      onChange={(e) => {
        const tab = INDEX_TAB[e.index];
        if (tab) setSelectedTab(tab);
      }}
    >
      <Switch name="All" text="All" />
      <Switch name="Required" text="Required" />
      <Switch name="Modified" text="Modified" />
    </ContentSwitcher>
  );
};
