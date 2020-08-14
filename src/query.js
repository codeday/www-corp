import { createContext, useContext } from 'react';

const QueryContext = createContext({});

export const Provider = QueryContext.Provider;
export const useQuery = () => useContext(QueryContext);
