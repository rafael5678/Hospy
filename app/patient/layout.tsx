import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal de Pacientes - Hospy",
  description: "Acceso a tu información médica",
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

