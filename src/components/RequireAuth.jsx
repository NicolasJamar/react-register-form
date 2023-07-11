import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const decoded = auth?.accessToken
      ? jwt_decode(auth.accessToken)
      : undefined

  const roles = decoded?.UserInfo?.roles || []

  return (
    roles.find( role => allowedRoles?.includes(role) )
      ? <Outlet />
      : auth?.user // if it's an user but don't have the authorized role ?
        ? <Navigate  to="/unauthorized" state={{ from: location }} replace />
        // if not a user, we redirect to login 
        : <Navigate to="/login" state={{ from: location }} replace /> 
        // We set a state to keep the visitor history
  )
}

export default RequireAuth;