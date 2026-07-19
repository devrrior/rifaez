
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DefaultLogo from "./ui/default-logo";
import { Menu, X } from "lucide-react";

const Navbar = ({raffle}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-headerRaffle border-y-[12.5px] shadow-lg lg:border-y-[20px] border-primaryRaffle text-headerRaffle-foreground fixed w-full top-0 z-[150]'>
      <div className="w-[1600px] max-w-[100vw] box-border mx-auto px-5">
        <div className='flex justify-between items-center h-[45px] lg:h-20'>
          {/* Mobile menu button */}
          <div className={`flex w-full h-full items-center justify-between lg:hidden ${raffle.logo_position === "right" && "flex-row-reverse"}`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
            <Link to="" className={`relative flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
                <div className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" &&"h-[85px] lg:h-28"} ${raffle.logo_type === "on" && "round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} `}>
                {raffle.logo?.url ?
                  <img alt="logo" className="h-full" src={raffle.logo.url}   />
                  : <DefaultLogo className="h-full"/> }
                </div>
                  {raffle.verified &&
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-500 border-2 border-white bg-white round-must rounded-full absolute right-0 top-0 h-[28px] w-[28px]"  viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  }
                </Link>
            </div>

            <Link
                to="payment"
                className="block text-center font-medium uppercase leading-[14px] text-xs px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                Métodos <br/> de Pago
              </Link>
              <Link
                to="verify"
                className="block text-center font-medium uppercase leading-[14px] text-xs px-3  py-2"
                onClick={() => setIsOpen(false)}
              >
                Boletos <br/> Disponibles
              </Link>
          </div>

          
          {/* Desktop Navigation */}
          <div className={`hidden w-full justify-between ${raffle.logo_position === "right" && "flex-row-reverse"} lg:flex lg:items-center lg:gap-8`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
                
            <Link to="" className={`relative flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
              <div className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" &&"h-28"} ${raffle.logo_type === "on" && "round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} `}>
              {raffle.logo?.url ?
                <img alt="logo" className="h-full" src={raffle.logo.url}   />
                : <DefaultLogo className="h-full"/> }
              </div>
                {raffle.verified &&
                  <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-500 border-2 border-white bg-white round-must rounded-full absolute right-0 top-0 h-[28px] w-[28px]"  viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                }
              </Link>
              
            </div>
          
            <div className='text-lg hidden lg:flex lg:items-center lg:space-x-4'>
              <Link to="payment" className="hover:text-headerRaffle-foreground/80">Métodos de Pago</Link>
              <div className="h-[28px] bg-white w-[1.5px]"></div>
              <Link to="verify" className="hover:text-headerRaffle-foreground/80">Verificador de Boletos</Link>
              <div className="h-[28px] bg-white w-[1.5px]"></div>
              <Link to="contact" className="hover:text-headerRaffle-foreground/80">Contacto</Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="text-[15px] lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 text-headerRaffle-foreground">
              <Link
                to="payment"
                className="block px-3 py-2 hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground"
                onClick={() => setIsOpen(false)}
              >
                Métodos de Pago
              </Link>
              <Link
                to="verify"
                className="block px-3 py-2 hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground"
                onClick={() => setIsOpen(false)}
              >
                Boletos Disponibles
              </Link>
              <Link
                to="contact"
                className="block px-3 py-2 hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
