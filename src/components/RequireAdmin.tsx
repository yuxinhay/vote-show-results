import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  // TEMPORARY: Bypass admin check for development
  return <>{children}</>;
}
