import { Outlet } from "react-router-dom";
import { SubNav, SubNavItem } from "@/components/layout/SubNav";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const items: SubNavItem[] = [
  { to: "/club", key: "club.overview", end: true },
  { to: "/club/history", key: "club.history" },
  { to: "/club/identity", key: "club.identity" },
  { to: "/club/leadership", key: "club.leadership" },
  { to: "/club/partners", key: "club.partners" },
  { to: "/club/sustainability", key: "club.sustainability" },
  { to: "/club/museum", key: "club.museum" },
];

const ClubLayout = () => (
  <div className="pt-20">
    <SubNav items={items} />
    <Breadcrumbs />
    <Outlet />
  </div>
);

export default ClubLayout;