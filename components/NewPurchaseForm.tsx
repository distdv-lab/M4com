"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function NewPurchaseForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const touch = fd.get("touch") === "on";

    const payload = {
      marca: String(fd.get("marca") ?? "").trim(),
      modelo: String(fd.get("modelo") ?? "").trim(),
      tamano_pantalla: emptyToNull(fd.get("tamano_pantalla")),
      procesador: emptyToNull(fd.get("procesador")),
      touch,
      video: emptyToNull(fd.get("video")),
      ram: emptyToNull(fd.get("ram")),
      ssd: emptyToNull(fd.get("ssd")),
      hdd: emptyToNull(fd.get("hdd")),
      etapa: "pendiente_recepcion",
    };

    if (!payload.marca || !payload.modelo) {
      setError("Marca y modelo son obligatorios.");
      setPending(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: insertError } = await supabase.from("equipos").insert(payload).select("id").single();

      if (insertError) {
        setError(insertError.message);
        setPending(false);
        return;
      }

      const rawId = data?.id;
      const id = typeof rawId === "string" ? parseInt(rawId, 10) : Number(rawId);
      router.push(`/inventario/${id}/recepcion`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
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

      <div className="form-grid">
        <label className="field">
          <span>Marca *</span>
          <input name="marca" type="text" required autoComplete="off" placeholder="Ej. Dell" />
        </label>
        <label className="field">
          <span>Modelo *</span>
          <input name="modelo" type="text" required autoComplete="off" placeholder="Ej. Latitude 5420" />
        </label>
        <label className="field">
          <span>Tamaño de pantalla</span>
          <input name="tamano_pantalla" type="text" placeholder='Ej. 15.6" o 14"' />
        </label>
        <label className="field">
          <span>Procesador</span>
          <input name="procesador" type="text" placeholder="Ej. Intel Core i5-1135G7" />
        </label>
        <label className="field field-check">
          <input name="touch" type="checkbox" />
          <span>Pantalla táctil (touch)</span>
        </label>
        <label className="field">
          <span>Video / GPU</span>
          <input name="video" type="text" placeholder="Ej. Intel Iris Xe" />
        </label>
        <label className="field">
          <span>RAM</span>
          <input name="ram" type="text" placeholder="Ej. 16 GB DDR4" />
        </label>
        <label className="field">
          <span>SSD</span>
          <input name="ssd" type="text" placeholder="Ej. 512 GB NVMe" />
        </label>
        <label className="field">
          <span>HDD</span>
          <input name="hdd" type="text" placeholder="Ej. 1 TB o N/A" />
        </label>
      </div>

      <p className="form-hint">El ID se asigna automáticamente al guardar. Después podrás registrar la recepción física y las fotos.</p>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando…" : "Guardar y continuar a recepción"}
        </button>
      </div>
    </form>
  );
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}
