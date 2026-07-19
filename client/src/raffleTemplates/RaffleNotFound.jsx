import { ArrowLeft, Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[1200px] flex justify-center">
    <div className="min-h-[650px] space-y-7 flex flex-col text-foreground items-left justify-center text-left px-6">
      {/* <Ghost className="w-20 h-20 text-muted-foreground" /> */}
      <Logo className="lg:hidden w-20 h-20"/>
      <h1 className="text-4xl font-medium text-foreground text-colorRaffle">Pagina de Rifa no se encontro.</h1>
      <p className="text-lg text-colorRaffle-600">
        No pudimos encontrar la página de rifa que estabas buscando.
      </p>
      <Link
        to="/"
        className="px-5 w-fit py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition flex items-center gap-3"
      >
        <ArrowLeft className="w-5 h-5"/>
        <span>Pagina de Inicio</span>
      </Link>
    </div>
    <div className="flex grow items-center justify-center">
        <Logo className="w-40 h-40 hidden lg:block"/>
    </div>
    </div>
  );
}