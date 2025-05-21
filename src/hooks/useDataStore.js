import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import { useState } from "react";

const DATASTORE_NAME = "climate_health";
const SETTING_KEY = "settings";

const settingQuery = {
  settings: {
    resource: `dataStore/${DATASTORE_NAME}/${SETTING_KEY}`,
  },
};

const settingMutation = {
  resource: `dataStore/${DATASTORE_NAME}/${SETTING_KEY}`,
  type: "create",
  data: ({ payload }) => payload,
};

const useDataStore = () => {
  const [settingMutate] = useDataMutation(settingMutation);
  const [isSettingOk, setIsSettingOk] = useState(false);

  const { loading: loadingConfig, refetch: loadConfigs } = useDataQuery(
    settingQuery,
    {
      lazy: true,
      onComplete: () => setIsSettingOk(true),
      onError: async () => {
        try {
          await settingMutate({ payload: {} });
          loadConfigs();
        } catch (err) {
          loadConfigs();
        }
      },
    }
  );

  const initDatastore = async () => {
    try {
      await Promise.all([loadConfigs()]);
    } catch (err) {}
  };

  const loading = loadingConfig;
  const isInitialized = !loading && isSettingOk;

  return {
    isInitialized,
    loading,
    initDatastore,
  };
};

export default useDataStore;
