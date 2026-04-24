import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

/**
 * Wrapper for a single sport (basketball, handball, volleyball).
 * The rubric navigation lives in the sport's index page (RubricCards);
 * once the visitor enters a rubric the breadcrumb tells them where they are.
 */
const SportLayout = () => (
  <>
    <Breadcrumbs />
    <Outlet />
  </>
);

export default SportLayout;