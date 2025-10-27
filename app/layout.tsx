import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospy - Sistema de Gestión Hospitalaria",
  description: "Sistema profesional de gestión de pacientes para hospitales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

