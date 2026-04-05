import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function checkSupabase(): Promise<{ label: string; tone: "ok" | "warn" | "err" }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url?.trim() || !key?.trim()) {
    return {
      label:
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Cópialas desde .env.example a .env.local o en Vercel → Settings → Environment Variables.",
      tone: "warn",
    };
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.auth.getSession();

  if (error) {
    return {
      label: `Supabase respondió con error: ${error.message}. Revisa URL y clave anon en el dashboard de Supabase.`,
      tone: "err",
    };
  }

  return {
    label:
      "Conexión a Supabase correcta (el proyecto Auth respondió con la clave anon). GitHub → Vercel → variables → esta página lo confirma en producción.",
    tone: "ok",
  };
}

export default async function Home() {
  const supabaseStatus = await checkSupabase();

  return (
    <main>
      <h1>Hola mundo</h1>
      <p className="lead">
        Si ves esto en la URL de Vercel, el flujo <strong>GitHub → deploy</strong> funciona. El recuadro de abajo
        comprueba <strong>Supabase</strong> con las variables públicas.
      </p>
      <div className="card">
        <h2>Estado Supabase</h2>
        <p className={`status ${supabaseStatus.tone}`}>{supabaseStatus.label}</p>
      </div>
      <p className="lead" style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
        Local: crea <code>.env.local</code> con los mismos nombres que <code>.env.example</code> y ejecuta{" "}
        <code>npm run dev</code>.
      </p>
    </main>
  );
}
