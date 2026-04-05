import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MissingSupabase } from "@/components/MissingSupabase";
import { SchemaHint } from "@/components/SchemaHint";
import { ReceptionForm } from "@/components/ReceptionForm";
import { ReceptionSummary } from "@/components/ReceptionSummary";
import { normalizeEquipo } from "@/types/inventory";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RecepcionPage({ params }: Props) {
  const { id: idParam } = await params;
  const equipoId = parseInt(idParam, 10);
  if (Number.isNaN(equipoId)) notFound();

  const supabase = createSupabaseServerClient();
  if (!supabase) return <MissingSupabase />;

  const { data: row, error: eqErr } = await supabase.from("equipos").select("*").eq("id", equipoId).maybeSingle();

  if (eqErr) {
    const m = eqErr.message.toLowerCase();
    const missingTable =
      m.includes("does not exist") || m.includes("schema cache") || m.includes("could not find the table");
    return (
      <SchemaHint
        message={missingTable ? "No existe la tabla «equipos». Ejecuta la migración SQL en Supabase." : eqErr.message}
      />
    );
  }

  if (!row) notFound();

  const equipo = normalizeEquipo(row as Record<string, unknown>);

  const { data: recepcion, error: recErr } = await supabase
    .from("recepciones")
    .select("id, estado_fisico, comentarios, created_at")
    .eq("equipo_id", equipoId)
    .maybeSingle();

  if (recErr) {
    return <SchemaHint message={recErr.message} />;
  }

  let fotos: { url: string; orden: number }[] = [];
  if (recepcion) {
    const recId = typeof recepcion.id === "string" ? parseInt(recepcion.id, 10) : Number(recepcion.id);
    const { data: fotosRows } = await supabase
      .from("recepcion_fotos")
      .select("storage_path, orden")
      .eq("recepcion_id", recId)
      .order("orden", { ascending: true });

    fotos = (fotosRows ?? []).map((f) => {
      const { data: pub } = supabase.storage.from("recepcion-fotos").getPublicUrl(f.storage_path);
      return { url: pub.publicUrl, orden: f.orden };
    });
  }

  return (
    <>
      <h1>Recepción física</h1>
      <p className="lead">
        Equipo <strong>#{equipo.id}</strong> — {equipo.marca} {equipo.modelo}
      </p>

      {recepcion ? (
        <ReceptionSummary
          estadoFisico={recepcion.estado_fisico}
          comentarios={recepcion.comentarios}
          fotos={fotos}
          registradoEn={recepcion.created_at}
        />
      ) : (
        <div className="card">
          <h2>Reporte al recibir el equipo</h2>
          <p className="form-hint" style={{ marginBottom: "1.25rem" }}>
            Describe el estado físico, añade comentarios y sube fotografías. Al guardar, el equipo pasa a etapa{" "}
            <strong>recibido</strong>.
          </p>
          <ReceptionForm equipoId={equipoId} />
        </div>
      )}

      <p className="lead" style={{ marginTop: "1.5rem" }}>
        <Link href="/inventario">← Inventario</Link>
      </p>
    </>
  );
}
