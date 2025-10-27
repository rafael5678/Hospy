import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrador - Hospy",
  description: "Panel de Administración",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

