import { Link } from "react-router-dom"
import Logo from "./Logo"


export default function PrivacyPolicy(){
    return (
        <div className="bg-[#FBFCFF] w-[100vw] min-h-[100vh] flex flex-col text-[#242426]">
            <header className="flex justify-center py-4 shadow-lg">
                    <Link to="/">
                        <Logo className="w-10 h-10"/>
                    </Link>
            </header>
            <section className="max-w-2xl mx-auto px-6 mb-10">
            <h1 className="text-primary font-medium text-4xl text-center my-[60px]">Política de Privacidad</h1>
            <p className="mb-6">Última actualización: 6 de agosto de 2025</p>
                <main className="space-y-4" >
                <p><strong>Rifaez</strong> es una plataforma tecnológica que brinda herramientas para la gestión y administración de rifas creadas por terceros.</p>

                <p>La plataforma <strong>no organiza, promueve ni es responsable</strong> del contenido, cumplimiento, legalidad ni entrega de premios relacionados con las rifas publicadas.</p>

                <p>Los <strong>organizadores de cada rifa</strong> son los únicos responsables de cumplir con las leyes aplicables, términos ofrecidos y entrega de premios.</p>

                <p>Rifaez no tiene control ni participación sobre la operación, resultados ni distribución de premios. En caso de dudas o reclamaciones, te invitamos a contactar directamente al creador de la rifa correspondiente.</p>
                
                </main>
            </section>
            <footer className="border mt-auto border-gray-200 w-screen py-10 px-8 text-center">
              Potenciando tus rifas, simplificando tu éxito.
            </footer>  
    </div>
    
    )
}