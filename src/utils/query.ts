import { QueryClient, useQuery } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// todo: type
type QueryFactory<R> = {
  queryKey: string[];
  queryFn(...args: any[]): Promise<R>;
};

export function createQuery<R>(queryConf: QueryFactory<R>) {
  return () => {
    return useQuery({
      ...queryConf,
      // todo: test
      initialData: {} as R,
    });
  };
}

export function createLoader<R>(query: QueryFactory<R>) {
  return async () => {
    return (
      queryClient.getQueryData<R>(query.queryKey)! ??
      (await queryClient.fetchQuery(query))
    );
  };
}
