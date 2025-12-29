import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoading && user && !isAdmin && !hasShownToast.current) {
      toast.error("You don't have permission to access the admin area");
      hasShownToast.current = true;
    }
  }, [isLoading, user, isAdmin]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
