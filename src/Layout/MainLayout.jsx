import { Outlet } from "react-router-dom";
import Footer from "../Shared/footer";
import Navbar from "../Shared/navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
     <div className="min-h-screen">
     <Outlet></Outlet>
     </div>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
