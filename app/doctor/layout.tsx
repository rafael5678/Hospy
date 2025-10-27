import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Médico - Hospy",
  description: "Portal para Profesionales Médicos",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

