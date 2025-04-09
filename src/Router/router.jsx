import { createBrowserRouter } from "react-router-dom";
import ErrorElement from "../Error/ErrorElement";
import MainLayout from "../Layout/mainLayout";
import Home from "../Page/Home";
import ProtectedLogin from "../routes/ProtectedLogin";
import ProtectedRegister from "../routes/ProtectedRegister";
import RedirectGoogleAuth from "../Components/GoogleRedirectHandler";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorElement />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <ProtectedLogin /> },
      { path: "/register", element: <ProtectedRegister /> },
      { path: "/login/callback", element: <RedirectGoogleAuth /> },
    ],
  },
]);

export default router;
