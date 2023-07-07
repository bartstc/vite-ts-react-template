import {
  DefinedQueryObserverResult,
  QueryClient,
  QueryKey,
  useQuery as useReactQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useReactQuery<TQueryFnData, TError, TData, TQueryKey>({
    staleTime: 2000,
    ...options,
  }) as DefinedQueryObserverResult<TData, TError>;
}
