import Link from "next/link";
import { NewPurchaseForm } from "@/components/NewPurchaseForm";

export default function NuevaCompraPage() {
  return (
    <>
      <h1>Nueva compra</h1>
      <p className="lead">
        Captura los datos del equipo. Al guardar se asigna un <strong>ID automático</strong> y pasas al reporte de
        recepción (estado físico, comentarios y fotos).
      </p>
      <div className="card">
        <h2>Ficha técnica</h2>
        <NewPurchaseForm />
      </div>
      <p className="lead" style={{ marginTop: "1.5rem" }}>
        <Link href="/inventario">← Volver al inventario</Link>
      </p>
    </>
  );
}
