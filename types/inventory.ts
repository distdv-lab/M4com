export type Equipo = {
  id: number;
  marca: string;
  modelo: string;
  tamano_pantalla: string | null;
  procesador: string | null;
  touch: boolean;
  video: string | null;
  ram: string | null;
  ssd: string | null;
  hdd: string | null;
  etapa: string;
  created_at: string;
};

export function normalizeEquipo(row: Record<string, unknown>): Equipo {
  const id = row.id;
  return {
    id: typeof id === "string" ? parseInt(id, 10) : Number(id),
    marca: String(row.marca ?? ""),
    modelo: String(row.modelo ?? ""),
    tamano_pantalla: row.tamano_pantalla != null ? String(row.tamano_pantalla) : null,
    procesador: row.procesador != null ? String(row.procesador) : null,
    touch: Boolean(row.touch),
    video: row.video != null ? String(row.video) : null,
    ram: row.ram != null ? String(row.ram) : null,
    ssd: row.ssd != null ? String(row.ssd) : null,
    hdd: row.hdd != null ? String(row.hdd) : null,
    etapa: String(row.etapa ?? ""),
    created_at: String(row.created_at ?? ""),
  };
}
