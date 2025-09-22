import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function PublicLayout() {
  return (
    <div>
      <Header />
      <div className="mt-[66px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default PublicLayout;
