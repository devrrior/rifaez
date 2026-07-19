
export default function VerifiedFooter(){
    return (
        <div className="bg-backgroundRaffle text-blue-500 border-t-2 border-borderRaffle flex gap-2 sm:gap-3 items-center justify-center px-2 sm:px-3 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="fill-blue-500 h-[20px] w-[20px] sm:h-[40px] sm:w-[40px]"  viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <div className="uppercase text-center font-medium">
                <p className="text-base leading-[8px] sm:text-xl sm:leading-[20px]">Estos sorteos son seguros</p>
                <a href="https://rifaez.com/verification" className="text-[10px] tracking-[-0.5px] sm:text-xs underline">es una pagina verificada, click aqui para mas detalles</a>
            </div>
        </div>
    )
}