"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  equipoId: number;
};

export function ReceptionForm({ equipoId }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const estadoFisico = String(fd.get("estado_fisico") ?? "").trim();
    const comentarios = String(fd.get("comentarios") ?? "").trim();

    if (!estadoFisico) {
      setError("Describe el estado físico del equipo.");
      setPending(false);
      return;
    }

    const fileInput = form.elements.namedItem("fotos");
    const files =
      fileInput instanceof HTMLInputElement && fileInput.files ? Array.from(fileInput.files) : [];

    try {
      const supabase = createSupabaseBrowserClient();

      const { data: recepcion, error: recErr } = await supabase
        .from("recepciones")
        .insert({
          equipo_id: equipoId,
          estado_fisico: estadoFisico,
          comentarios: comentarios || null,
        })
        .select("id")
        .single();

      if (recErr) {
        setError(recErr.message);
        setPending(false);
        return;
      }

      const recepcionIdRaw = recepcion?.id;
      const recepcionId =
        typeof recepcionIdRaw === "string" ? parseInt(recepcionIdRaw, 10) : Number(recepcionIdRaw);

      let orden = 0;
      for (const file of files) {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${equipoId}/${recepcionId}-${orden}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("recepcion-fotos").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) {
          setError(`Foto no subida (${safeName}): ${upErr.message}`);
          setPending(false);
          return;
        }
        const { error: rowErr } = await supabase.from("recepcion_fotos").insert({
          recepcion_id: recepcionId,
          storage_path: path,
          orden,
        });
        if (rowErr) {
          setError(rowErr.message);
          setPending(false);
          return;
        }
        orden += 1;
      }

      const { error: updErr } = await supabase.from("equipos").update({ etapa: "recibido" }).eq("id", equipoId);
      if (updErr) {
        setError(updErr.message);
        setPending(false);
        return;
      }

      router.push("/inventario");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la recepción.");
      setPending(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      {error ? (
        <p className="alert alert-err" role="alert">
          {error}
        </p>
      ) : null}

      <label className="field">
        <span>Estado físico *</span>
        <textarea
          name="estado_fisico"
          required
          rows={4}
          placeholder="Rayones, golpes, teclado, bisagras, pantalla, puertos…"
        />
      </label>

      <label className="field">
        <span>Comentarios</span>
        <textarea name="comentarios" rows={3} placeholder="Observaciones adicionales (opcional)" />
      </label>

      <label className="field">
        <span>Fotografías</span>
        <input name="fotos" type="file" accept="image/*" multiple className="input-file" />
        <span className="field-help">Puedes seleccionar varias imágenes. Formatos habituales: JPG, PNG, WebP.</span>
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando…" : "Guardar reporte de recepción"}
        </button>
      </div>
    </form>
  );
}
