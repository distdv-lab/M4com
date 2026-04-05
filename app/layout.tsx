import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "M4com — Inventario",
  description: "Control de inventario: compras, recepción y equipos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="shell">
          <Nav />
          <main className="page-main">{children}</main>
          <footer className="app-footer">
            <Link href="/">Inicio</Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
