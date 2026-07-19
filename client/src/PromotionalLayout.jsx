import Logo from "./Logo";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const style = {
    '--background': '0 0% 100%',
    '--foreground': '222.2 84% 4.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '222.2 84% 4.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '222.2 84% 4.9%',
    '--primary': '#3b82f6',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 96.1%',
    '--secondary-foreground': '222.2 47.4% 11.2%',
    '--muted': '210 40% 96.1%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    '--accent': '210 40% 96.1%',
    '--accent-foreground': '222.2 47.4% 11.2%',
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '210 40% 98%',
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '221.2 83.2% 53.3%',
    '--radius': '0.5rem',
    '--background-raffle': 'hsl(224.05 72% 4%)',
    '--primary-raffle': 'hsl(0 100% 50%)',
    '--card-raffle': 'hsl(224 4% 14%)',
    '--color-raffle': 'hsl(220 0% 94%)'
  };

export default function PromotionalLayout({children}){
    const navigate = useNavigate()
    return (
        <div
        style={style}
         className="bg-[#FBFCFF] w-[100vw] min-h-[100vh] flex flex-col text-[#242426]">
            <header>
                <div className="mx-auto py-4 max-w-[100vw] sm:px-14 px-6 w-[1400px]">
                    <nav className="w-full flex justify-between">
                        <Link to="/">
                            <Logo className="w-8 h-8"/>
                        </Link>
                        <button onClick={()=>{navigate("/login")}} className="bg-primary text-white text-sm flex items-center rounded-full gap-1 px-4 py-1.5">
                            <span>Login</span>
                            <ChevronRight className="w-4 h-4"/>                   
                        </button>
                    </nav>
                </div>
            </header>
            {children}
            <footer className="border flex flex-col gap-4 mt-auto border-gray-200 w-screen py-10 px-8 text-center">
             <span> Potenciando tus rifas, simplificando tu éxito.</span>
              <Link to="/privacy-policy" className="underline">
                Politica de Privacidad
              </Link>
            </footer>     
        </div>
    )
}