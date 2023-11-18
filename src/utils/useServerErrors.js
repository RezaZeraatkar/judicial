import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {*} error
 * @param {*} navigate
 * @returns
 */
function useServerErrors() {
  const navigate = useNavigate();

  function handleServerErrors(error) {
    if (error?.status === 401) {
      return navigate("/login");
    } else if (error?.status === 400 || error?.status === 500) {
      return toast.error(error?.data?.message, {
        position: "top-right",
      });
    } else {
      return toast.error(error?.data?.message, {
        position: "top-right",
      });
    }
  }

  return handleServerErrors;
}

export default useServerErrors;
