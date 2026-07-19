
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DefaultLogo from "./ui/default-logo";
import { Menu, X } from "lucide-react";

const Navbar = ({raffle}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-headerRaffle border-b-2 border-borderRaffle text-headerRaffle-foreground fixed w-full top-0 z-50'>
      <div className="w-[1400px] max-w-[100vw] box-border mx-auto px-4">
        <div className='flex justify-between items-center h-16'>
          {/* Mobile menu button */}
          <div className={`flex w-full h-full items-center justify-between md:hidden ${raffle.logo_position === "right" && "flex-row-reverse"}`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
            <Link to="" className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" && "h-20"} ${raffle.logo_type === "on" && " round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
              {raffle.logo?.url ?
                <img alt="logo" className="h-full" src={raffle.logo.url}   />
                : <DefaultLogo className="h-full"/> }
              </Link>
              {raffle.logo_display_name &&
                <span className={`min-w-max ${raffle.logo_position === "center" && "absolute left-[calc(100%+10px)] "}`}>{raffle.business_name}</span>
              }
            </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className=""
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>

          
          {/* Desktop Navigation */}
          <div className={`hidden w-full justify-between ${raffle.logo_position === "right" && "flex-row-reverse"} md:flex md:items-center md:gap-8`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
            <Link to="" className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" && "h-20"} ${raffle.logo_type === "on" && "round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
              {raffle.logo?.url ?
                <img alt="logo" className="h-full" src={raffle.logo.url}   />
                : <DefaultLogo className="h-full"/> }
              </Link>
              {raffle.logo_display_name &&
                <span className={`min-w-max ${raffle.logo_position === "center" && "absolute left-[calc(100%+10px)] "}`}>{raffle.business_name}</span>
              }
            </div>
          
            <div className='text-[15px] hidden md:flex md:items-center md:space-x-4'>
              <Link to="payment" className="hover:text-headerRaffle-foreground/80">Métodos de Pago</Link>
              <Link to="verify" className="hover:text-headerRaffle-foreground/80">Boletos Disponibles</Link>
              <Link to="contact" className="hover:text-headerRaffle-foreground/80">Contacto</Link>
            </div>
          </div>
      </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="text-[15px] md:hidden">
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
