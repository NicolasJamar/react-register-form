import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.user 
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace /> 
      // if not a user, we redirect to login. 
      // We set a state to keep the visitor history
  )
}

export default RequireAuth;