import Link from "next/link";

export function Nav() {
  return (
    <header className="app-header">
      <Link href="/" className="app-brand">
        M4com inventario
      </Link>
      <nav className="app-nav">
        <Link href="/inventario" className="nav-link">
          Inventario
        </Link>
        <Link href="/inventario/nueva" className="nav-link">
          Nueva compra
        </Link>
      </nav>
    </header>
  );
}
