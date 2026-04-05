import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function supabaseLine(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || !key?.trim()) {
    return "Supabase: configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }
  const supabase = createClient(url, key);
  const { error } = await supabase.auth.getSession();
  if (error) return `Supabase: error — ${error.message}`;
  return "Supabase: conexión correcta.";
}

export default async function Home() {
  const line = await supabaseLine();

  return (
    <>
      <h1>M4com</h1>
      <p className="lead">Inventario: compras, recepción física con fotos y seguimiento por etapa.</p>

      <div className="home-actions">
        <Link href="/inventario/nueva" className="btn btn-primary">
          Nueva compra
        </Link>
        <Link href="/inventario" className="btn btn-secondary">
          Ver inventario
        </Link>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h2>Paso 1</h2>
        <p className="status ok" style={{ margin: 0 }}>
          Captura de compra (ID automático, ficha técnica) y reporte de recepción (estado físico, comentarios,
          fotografías).
        </p>
        <p className="lead" style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.9rem" }}>
          Primera vez: en Supabase ejecuta el SQL <code>supabase/migrations/001_inventario_paso1.sql</code>.
        </p>
      </div>

      <p className="meta-footer">{line}</p>
    </>
  );
}
