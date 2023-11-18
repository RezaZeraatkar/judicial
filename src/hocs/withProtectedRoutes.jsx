import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useGetUserAuthQuery } from "../services/api/auth/getUserAuthSlice";
import CircularProgress from "../components/circularLoaders/circularProgress";
import { useUserContext } from "../hocs/UserProvider";

export default function WithProtectedRoutes(Component) {
  function ComponentWithRouteProp(props) {
    const { updateUser } = useUserContext();
    const {
      data: user,
      isSuccess,
      isLoading,
      isFetching,
      isError,
    } = useGetUserAuthQuery(undefined);

    useEffect(() => {
      if (isSuccess) {
        updateUser(user?.data);
      }
    }, [isSuccess, user, updateUser]);

    if (isLoading || isFetching) {
      return <CircularProgress />;
    }

    if (isSuccess) {
      return <Component {...props} />;
    }
    if (isError) {
      return <Navigate to="/login" />;
    }
  }

  return ComponentWithRouteProp;
}
