import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MissingSupabase } from "@/components/MissingSupabase";
import { SchemaHint } from "@/components/SchemaHint";
import { normalizeEquipo, type Equipo } from "@/types/inventory";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return <MissingSupabase />;

  const { data, error } = await supabase.from("equipos").select("*").order("id", { ascending: false });

  if (error) {
    const m = error.message.toLowerCase();
    const missingTable =
      m.includes("does not exist") || m.includes("schema cache") || m.includes("could not find the table");
    return (
      <SchemaHint
        message={missingTable ? "No existe la tabla «equipos». Ejecuta la migración SQL en Supabase." : error.message}
      />
    );
  }

  const equipos: Equipo[] = (data ?? []).map((row) => normalizeEquipo(row as Record<string, unknown>));

  return (
    <>
      <h1>Inventario</h1>
      <p className="lead">Equipos capturados por compra. El ID es numérico y automático.</p>

      {equipos.length === 0 ? (
        <div className="card">
          <p>Aún no hay equipos. Registra una compra nueva.</p>
          <p className="lead" style={{ marginTop: "1rem" }}>
            <Link href="/inventario/nueva" className="btn btn-primary inline">
              Nueva compra
            </Link>
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Touch</th>
                <th>Etapa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.marca}</td>
                  <td>{e.modelo}</td>
                  <td>{e.touch ? "Sí" : "No"}</td>
                  <td>
                    <span className={`badge ${e.etapa === "recibido" ? "badge-ok" : "badge-pending"}`}>
                      {e.etapa === "pendiente_recepcion" ? "Pendiente recepción" : e.etapa}
                    </span>
                  </td>
                  <td>
                    <Link href={`/inventario/${e.id}/recepcion`} className="link-action">
                      {e.etapa === "pendiente_recepcion" ? "Recepción" : "Ver recepción"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
