// components/NotFoundPage.jsx
import { ArrowLeft, Ghost } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[500px] space-y-7 flex flex-col items-center justify-center bg-background text-center px-6">
      {/* <Ghost className="w-20 h-20 text-muted-foreground" /> */}
      <h1 className="text-6xl font-medium text-foreground ">404</h1>
      <p className="text-xl text-muted-foreground">
        No pudimos encontrar la página que estabas buscando.
      </p>
      <Link
        to="/raffle-admin"
        className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition flex items-center gap-3"
      >
        <ArrowLeft className="w-5 h-5"/>
        <span>Pagina de Inicio</span>
      </Link>
    </div>
  );
}
