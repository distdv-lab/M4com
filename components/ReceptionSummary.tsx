type Foto = { url: string; orden: number };

type Props = {
  estadoFisico: string;
  comentarios: string | null;
  fotos: Foto[];
  registradoEn: string;
};

export function ReceptionSummary({ estadoFisico, comentarios, fotos, registradoEn }: Props) {
  return (
    <div className="card reception-done">
      <h2>Reporte de recepción registrado</h2>
      <p className="meta">Registrado: {new Date(registradoEn).toLocaleString("es-MX")}</p>
      <section className="reception-block">
        <h3>Estado físico</h3>
        <p className="pre-wrap">{estadoFisico}</p>
      </section>
      {comentarios ? (
        <section className="reception-block">
          <h3>Comentarios</h3>
          <p className="pre-wrap">{comentarios}</p>
        </section>
      ) : null}
      {fotos.length > 0 ? (
        <section className="reception-block">
          <h3>Fotografías</h3>
          <div className="photo-grid">
            {fotos.map((f) => (
              <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="photo-thumb">
                <img src={f.url} alt={`Foto ${f.orden + 1}`} />
              </a>
            ))}
          </div>
        </section>
      ) : (
        <p className="muted">No se adjuntaron fotografías.</p>
      )}
    </div>
  );
}
