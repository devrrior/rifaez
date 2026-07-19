
import React from "react";
import { Facebook, Phone } from "lucide-react";
import Logo from "../../Logo";
import { Link } from "react-router-dom";

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
    <footer className={`mt-auto bg-headerRaffle text-headerRaffle-foreground py-8`}>
      <div className="container mx-auto px-4">
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
  );
};

export default Footer;
