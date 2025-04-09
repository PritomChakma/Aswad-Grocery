import { createBrowserRouter } from "react-router-dom";
import RedirectGoogleAuth from "../Components/GoogleRedirectHandler";
import ErrorElement from "../Error/ErrorElement";
import MainLayout from "../Layout/mainLayout";
import Dashboard from "../Page/Dashboard/Dashboard";
import User from "../Page/Dashboard/user";
import Home from "../Page/Home";
import ProtectedLogin from "../routes/ProtectedLogin";
import ProtectedRegister from "../routes/ProtectedRegister";
import TotalProduct from "../Page/Dashboard/TotalProduct";

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
      { path: "totalUser", element: <User /> }, 
      { path: "totalProducts", element: <TotalProduct></TotalProduct> }, 
      {
        path: "/dashboard", // Parent route
        element: <Dashboard />,
        children: [
          // Relative route to /dashboard
        
        
        ],
      },
    ],
  },
]);

export default router;
