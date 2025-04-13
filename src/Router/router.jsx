import { createBrowserRouter } from "react-router-dom";
import RedirectGoogleAuth from "../Components/GoogleRedirectHandler";
import Order from "../Page/Dashboard/Orders";
import ErrorElement from "../Error/ErrorElement";
import MainLayout from "../Layout/mainLayout";
import Dashboard from "../Page/Dashboard/Dashboard";
import TotalProduct from "../Page/Dashboard/TotalProduct";
import Home from "../Page/Home";
import ProtectedLogin from "../routes/ProtectedLogin";
import ProtectedRegister from "../routes/ProtectedRegister";
import Categories from "../Page/Dashboard/Categories";
import AddProduct from "../Page/Dashboard/AddProduct";
import EditProduct from "../Page/Dashboard/EditProduct";
import TotalUsers from "../Page/Dashboard/TotalUser";

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
      { path: "/totalProducts/", element: <TotalProduct /> },
      { path: "/addProduct", element: <AddProduct /> },
      { path: "/editProducts/:productId", element: <EditProduct /> },
      { path: "/orders", element: <Order></Order> },
      { path: "/categories", element: <Categories></Categories> },
      { path: "/totalusers", element: <TotalUsers></TotalUsers> },
      {
        path: "/dashboard",
        element: <Dashboard />,
        // children: [{ path: "totalusers", element: <TotalUsers /> }],
      },
    ],
  },
]);

export default router;
