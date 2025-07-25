import { SuggestionRegistryProvider } from '@kaoto/forms';
import { VisualizationProvider } from '@patternfly/react-topology';
import { FunctionComponent, useContext, useLayoutEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { RenderingProvider } from './components/RenderingAnchor/rendering.provider';
import { ControllerService } from './components/Visualization/Canvas/controller.service';
import { RegisterComponents } from './components/registers/RegisterComponents';
import { RegisterNodeInteractionAddons } from './components/registers/RegisterNodeInteractionAddons';
import { NodeInteractionAddonProvider } from './components/registers/interactions/node-interaction-addon.provider';
import { Shell } from './layout/Shell';
import { LocalStorageSettingsAdapter } from './models/settings/localstorage-settings-adapter';
import {
  CatalogLoaderProvider,
  CatalogTilesProvider,
  EntitiesContext,
  EntitiesProvider,
  RuntimeProvider,
  SchemasLoaderProvider,
  SettingsProvider,
  SourceCodeLocalStorageProvider,
  VisibleFlowsContext,
  VisibleFlowsProvider,
} from './providers';
import { isDefined } from './utils';
import { CatalogSchemaLoader } from './utils/catalog-schema-loader';
import { setColorScheme } from './utils/color-scheme';

function App() {
  const settingsAdapter = new LocalStorageSettingsAdapter();
  let catalogUrl = CatalogSchemaLoader.DEFAULT_CATALOG_PATH;
  const settingsCatalogUrl = settingsAdapter.getSettings().catalogUrl;
  const colorSchema = settingsAdapter.getSettings().colorScheme;

  if (isDefined(settingsCatalogUrl) && settingsCatalogUrl !== '') {
    catalogUrl = settingsCatalogUrl;
  }

  useLayoutEffect(() => {
    setColorScheme(colorSchema);
  }, [colorSchema]);

  return (
    <SettingsProvider adapter={settingsAdapter}>
      <SourceCodeLocalStorageProvider>
        <RuntimeProvider catalogUrl={catalogUrl}>
          <SchemasLoaderProvider>
            <CatalogLoaderProvider>
              <EntitiesProvider>
                <Shell>
                  <CatalogTilesProvider>
                    <VisibleFlowsProvider>
                      <VisibleFlowsConsumer />
                    </VisibleFlowsProvider>
                  </CatalogTilesProvider>
                </Shell>
              </EntitiesProvider>
            </CatalogLoaderProvider>
          </SchemasLoaderProvider>
        </RuntimeProvider>
      </SourceCodeLocalStorageProvider>
    </SettingsProvider>
  );
}

const VisibleFlowsConsumer: FunctionComponent = () => {
  const { camelResource, updateEntitiesFromCamelResource } = useContext(EntitiesContext)!;
  const { visualFlowsApi } = useContext(VisibleFlowsContext)!;
  const controller = useMemo(
    () => ControllerService.createController(visualFlowsApi, camelResource, updateEntitiesFromCamelResource),
    [visualFlowsApi, camelResource, updateEntitiesFromCamelResource],
  );

  return (
    <VisualizationProvider controller={controller}>
      <RenderingProvider>
        <RegisterComponents>
          <NodeInteractionAddonProvider>
            <RegisterNodeInteractionAddons>
              <SuggestionRegistryProvider>
                <Outlet />
              </SuggestionRegistryProvider>
            </RegisterNodeInteractionAddons>
          </NodeInteractionAddonProvider>
        </RegisterComponents>
      </RenderingProvider>
    </VisualizationProvider>
  );
};

export default App;
