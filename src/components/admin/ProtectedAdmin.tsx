import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type Capability = "cms" | "sports" | "sync" | "any";

export const ProtectedAdmin = ({
  children,
  require = "any",
}: {
  children: ReactNode;
  require?: Capability;
}) => {
  const { user, isEditor, canEditCms, canEditSports, canSync, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  const hasAccess =
    require === "cms" ? canEditCms
    : require === "sports" ? canEditSports
    : require === "sync" ? canSync
    : (isEditor || canEditCms || canEditSports);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">Access denied</h1>
        <p className="text-muted-foreground max-w-md">
          Your account does not have the required role for this section.
          Ask an administrator to grant you access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};