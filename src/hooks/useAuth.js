import { useGetUserAuthQuery } from "../services/api/auth/getUserAuth";

export const useAuth = (prop) => {
  // const user = useSelector(getUser);
  const { data, isSuccess, isLoading, isFetching, isError, error, refetch } =
    useGetUserAuthQuery(undefined);

  return {
    data,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
