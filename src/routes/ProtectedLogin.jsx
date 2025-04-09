import { useAuth } from "../authen/auth";
import { Navigate } from "react-router-dom";
import AuthPage from "../page/AuthPage";

const ProtectedLogin = () => {
  const { isAuthorized } = useAuth();
  return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="login" />;
};

export default ProtectedLogin;
