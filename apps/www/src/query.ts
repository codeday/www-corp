import { createContext, useContext } from "react";

const QueryContext = createContext<any>({});

export const Provider = QueryContext.Provider;
export const useQuery = () => useContext(QueryContext);
