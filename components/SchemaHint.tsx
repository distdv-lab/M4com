export function SchemaHint({ message }: { message: string }) {
  return (
    <div className="card">
      <h2>Base de datos</h2>
      <p className="status err">{message}</p>
      <p className="lead" style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
        En Supabase, abre <strong>SQL Editor</strong> y ejecuta el script{" "}
        <code>supabase/migrations/001_inventario_paso1.sql</code> de este repositorio. Crea tablas{" "}
        <code>equipos</code>, <code>recepciones</code>, <code>recepcion_fotos</code> y el bucket de almacenamiento.
      </p>
    </div>
  );
}
