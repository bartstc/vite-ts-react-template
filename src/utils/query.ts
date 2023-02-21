import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// todo: type
type QueryFactory<R> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryKey: Array<string | Record<string, unknown> | any>;
  queryFn(...args: any[]): Promise<R>;
};

export async function createLoader<R>(query: QueryFactory<R>) {
  return (
    queryClient.getQueryData<R>(query.queryKey)! ??
    (await queryClient.fetchQuery(query))
  );
}
