import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom"; 
import "./App.css";
import router from "./Router/router";

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;