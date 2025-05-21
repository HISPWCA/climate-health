import { useEffect } from "react";
import useDataStore from "./hooks/useDataStore";
import App from "./App";

const AppWrapper = (props) => {
  const { initDatastore, loading, isInitialized } = useDataStore(props);

  useEffect(() => {
    initDatastore();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }
  return !loading && isInitialized ? (
    <App {...props} />
  ) : (
    <>Impossible to initialize App</>
  );
};

export default AppWrapper;
