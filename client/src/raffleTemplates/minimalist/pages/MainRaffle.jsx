import { Link } from "react-router-dom"
import { useOutletContext } from "react-router-dom"

export default function MainRaffle(){
    const raffle = useOutletContext()
    return (
        <section>
            <div className="fixed z-[0] left-0 top-0 w-screen h-screen">
                <img src={raffle.images[0].url} className="w-full h-full object-cover" alt="" />
            </div>
            <main className="relative z-[3]">
                <section className="h-[300px] sm:h-[500px] px-4 py-8">
                    <Link to="lista" className="mx-auto font-semibold text-base sm:text-xl lg:text-3xl w-fit tracking-[1px] sm:tracking-[3px] block uppercase border-[3px] border-borderRaffle bg-primaryRaffle text-primaryRaffle-foreground hover:bg-headerRaffle hover:border-primaryRaffle border-primaryRaffle-foreground rounded-2xl px-3 sm:px-5 lg:px-8 py-3">- Lista de disponibles -</Link>
                </section>
                <section className="bg-primaryRaffle text-center px-4 py-3">
                    <h1 className="text-2xl sm:text-4xl lg:text-6xl font-semibold text-primaryRaffle-foreground">{raffle.textHtml.title}</h1>
                </section>
                <section className="bg-backgroundRaffle w-full py-3 px-4">
                <div className="max-w-2xl mx-auto w-full">
                <div className="ql-editor text-center" dangerouslySetInnerHTML={{ __html: raffle.textHtml.html }} />
                </div>
                </section>
            </main>
        </section>
    )
}