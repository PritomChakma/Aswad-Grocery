import { createBrowserRouter } from "react-router-dom";
import ErrorElement from "../Error/ErrorElement";
import MainLayout from "../Layout/mainLayout";
import Home from "../Page/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
    ],
  },
]);

export default router;
