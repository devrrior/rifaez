import PromotionalLayout from "./PromotionalLayout"
import VerifiedFooter from "./raffleTemplates/components/Verified"

export default function RifaezVerification(){
    return (
        <PromotionalLayout>
               <section className="w-full max-w-[1000px] mx-auto mt-5 pt-10">
                    <div className="flex flex-col items-center gap-6 sm:gap-8 px-2 sm:px-8 text-center mb-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="fill-blue-500 shadow-lg border-[3px] border-white rounded-full h-[48px] w-[48px] sm:h-[56px] sm:w-[56px]"  viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <h1 className="text-3xl sm:text-4xl">
                            Certificado de Confianza
                        </h1>
                        <p className="sm:text-lg">
                            Las paginas que cuenten con este certificado han pagado para ser verificado por <b>Rifaez</b> como una empresa de rifa legitima.
                        </p>
                    </div>
                    <div className="text-blue-500 border-t-2 border-borderRaffle flex gap-2 sm:gap-3 items-center justify-center px-2 sm:px-3 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="fill-blue-500 h-[20px] w-[20px] sm:h-[40px] sm:w-[40px]"  viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <div className="uppercase text-center font-medium">
                            <p className="text-base leading-[8px] sm:text-xl sm:leading-[20px]">Estos sorteos son seguros</p>
                            <span className="text-[10px] tracking-[-0.5px] sm:text-xs underline">es una pagina verificada, click aqui para mas detalles</span>
                        </div>
                    </div>
               </section>
        </PromotionalLayout>
    )
}