import { useAuth } from "../authen/auth";
import { Navigate } from "react-router-dom";
import AuthPage from "../page/AuthPage";

const ProtectedRegister = () => {
  const { isAuthorized } = useAuth();
  return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="register" />;
};

export default ProtectedRegister;
