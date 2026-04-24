import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const MensFirstLayout = () => (
  <>
    <Breadcrumbs />
    <Outlet />
  </>
);

export default MensFirstLayout;