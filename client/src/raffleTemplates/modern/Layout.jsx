import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Aperture, Phone, Facebook } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from '../lib/utils';
import WhatsWidget from "../components/WhatsWidget";
import VerifiedFooter from '../components/Verified';
import "../noRadius.css";
import DefaultLogo from "../components/ui/default-logo";
import Logo from '../../Logo';
const navLinks = [
  { to: "verificar", label: "Boletos Disponibles" },
  { to: "pago", label: "Pago" },
  { to: "contacto", label: "Contacto" },
];

const Layout = ({raffle}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "bg-headerRaffle-foreground text-headerRaffle";
  const inactiveLinkClasses = "text-headerRaffle-foreground hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground";
  const activeLinkClassesMenu = "bg-primaryRaffle text-primaryRaffle-foreground";
  const inactiveLinkClassesMenu = "text-colorRaffle hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground";

  const setPhoneFormat = (phone) => {
    const digits = phone?.replace(/\D/g, ''); 

    const parts = [];

    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    if (digits?.length >= 4) {
      parts[0] += ') ';
      parts.push(digits.substring(3, Math.min(6, digits.length)));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10));
    }

    return parts.join('');
  }

  return (
    <div className={`${raffle.border_corner === "square" && "no-radius"} min-h-screen flex flex-col bg-gradient-to-br from-backgroundRaffle to-lightColorTint font-fontRaffle`}>
      <header className='sticky top-0 z-50 bg-headerRaffle backdrop-blur-md shadow-sm border-b border-borderRaffle'>
        <div className="max-w-[calc(100vw-24px)] w-[1400px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className={`relative flex items-center justify-between  ${raffle.logo_position === "left" ? "flex-row" : "flex-row-reverse"}  ${raffle.logo_position === "right" && "gap-4"} h-16`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
            <NavLink to="" className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" && "h-20 "} ${raffle.logo_type === "on" && "round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
              {raffle.logo?.url ?
                <img alt="logo" className="h-full" src={raffle.logo.url}   />
                : <DefaultLogo className="h-full"/> }
              </NavLink>
              {raffle.logo_display_name &&
                <span className={`min-w-max text-headerRaffle-foreground ${raffle.logo_position === "center" && "absolute right-[calc(100%+10px)] customLg:right-0 customLg:left-[calc(100%+10px)] "}`}>{raffle.business_name}</span>
              }
            </div>
            <nav className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    cn(linkClasses, isActive ? activeLinkClasses : inactiveLinkClasses)
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Abrir menú">
                {isMobileMenuOpen ? <X className="h-6 w-6 text-headerRaffle-foreground" /> : <Menu className="h-6 w-6 text-headerRaffle-foreground" />}
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-backgroundRaffle shadow-lg absolute w-full"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn("block px-3 py-2 rounded-md text-base font-medium", isActive ? activeLinkClassesMenu : inactiveLinkClassesMenu)
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow max-w-[calc(100vw-24px)] w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
             <Outlet context={raffle} />
          </motion.div>
        </AnimatePresence>
      </main>
     
      <footer className="bg-headerRaffle border-t border-borderRaffle text-headerRaffle-foreground">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center gap-3">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            { raffle.facebookUrl &&
              <a href={raffle.facebookUrl} className="hover:text-primaryRaffle">
                <Facebook size={24} />
              </a>
            }
            { raffle.phone &&
              <a href={`tel:${raffle.phone}`} className="hover:text-primaryRaffle">
                <Phone size={24} />
              </a>
            }
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">PREGUNTAS AL WHATSAPP</p>
            <a href={`tel:${raffle.phone}`} className="text-xl hover:text-primaryRaffle">
              {setPhoneFormat(raffle.phone)}
            </a>
          </div>
          <div className="flex flex-col items-center gap-5 text-sm text-headerRaffle-foreground mt-4">
            <div className="flex items-center gap-4 ">
              <p>Sitio desarrollado por</p>
              <Link to="/">
                <Logo/>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </footer>
      <div className='w-screen sticky bottom-0 right-0'>
        <WhatsWidget number={raffle.phone}/>
        {raffle.verified &&
          <VerifiedFooter />
        }
    </div>
    </div>
  );
};

export default Layout;