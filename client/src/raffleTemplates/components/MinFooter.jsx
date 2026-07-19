
import React from "react";
import {Link} from "react-router-dom";
import { Facebook, Phone } from "lucide-react";
import Logo from "../../Logo";

const Footer = ({raffle}) => {
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
    <footer className="bg-headerRaffle relative z-[1] w-screen text-headerRaffle-foreground">
        <div className="flex flex-col items-center w-full">
          
          <div className="text-center underline flex flex-col items-center gap-2 w-full bg-primaryRaffle px-3 py-3">
          { raffle.facebookUrl &&
              <a href={raffle.facebookUrl} className="hover:text-primaryRaffle">
                <Facebook size={24} />
              </a>
            }
            <p className="text-xl font-bold">PREGUNTAS AL WHATSAPP</p>
            <a href={`tel:${raffle.phone}`} className="text-xl">
              {setPhoneFormat(raffle.phone)}
            </a>
          </div>
          <div className="text-center text-base px-3 py-3 ">
          <div className="flex items-center gap-4 ">
              <p className="no-underline mt-1">Sitio desarrollado por</p>
              <Link to="/">
                <Logo/>
              </Link>
            </div>
          </div>
          <div className="mb-5 underline">
            <Link to="contact">Contacto</Link>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
