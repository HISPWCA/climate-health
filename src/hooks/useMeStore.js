import { useDataQuery } from '@dhis2/app-runtime';

const meQuery = {
      me: {
            resource: 'me',
            params: {
                  fields: 'organisationUnits'
            }
      }
};
const useMeStore = () => {
      const { data: meData, loading } = useDataQuery(meQuery);
      return { me: meData?.me, loading };
};

export default useMeStore;
