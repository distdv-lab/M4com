import Link from "next/link";

export function MissingSupabase() {
  return (
    <div className="card">
      <h2>Configuración</h2>
      <p className="status warn">
        Faltan variables <code>NEXT_PUBLIC_SUPABASE_URL</code> o <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Configura{" "}
        <code>.env.local</code> o Vercel y vuelve a cargar.
      </p>
      <p className="lead" style={{ marginTop: "1rem" }}>
        <Link href="/">Volver al inicio</Link>
      </p>
    </div>
  );
}
