
import React, { useEffect, useState, useRef} from "react";
import { motion } from "framer-motion";
import TriDown from "../../components/TriDown";
import { CopyIcon, CopyCheck } from "lucide-react";
import bankLogos from "../../../seed/bankLogo";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const Payment = () => {
  const raffle = useOutletContext();
  const [copied, setCopied] = useState({})
  const topRef = useRef(null);

  
  const setPhoneFormat = (phone) => {
    const digits = phone.replace(/\D/g, ''); 

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

  const copyFunc = (index, attr, text) => {
    navigator.clipboard.writeText(text)
    setCopied({[index]: {
      [attr]: text
    }})
  }

  useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => {
        setCopied([]);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [copied]);


  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '');
  
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  function formatCLABE(clabe) {
    if (!clabe) return "";
  
    const digits = clabe.replace(/\D/g, '').slice(0, 18);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,11})(\d{0,1})$/);
  
    if (!match) return digits;
  
    // Destructure the match array and ignore the full match at index 0
    const [, bank, branch, account, control] = match;
  
    return [bank, branch, account, control].filter(Boolean).join(' ');
  }

  return (
    <div className="max-w-screen py-8 mb-10" ref={topRef}>
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          {raffle.logo?.url ?
                <div className={`h-36 ${raffle.logo_type === "on" && "border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} mb-6`}>
                <img alt="logo" className="h-36 object-cover mx-auto" src={raffle.logo.url}  />
            </div>
                : <DefaultLogo className="rounded-full w-32 h-32 mx-auto"/> }
          <h1 className="md:text-3xl text-xl font-semibold py-2 text-headerRaffle-foreground w-full bg-headerRaffle">
          INFORMACIÓN DE PAGO
          </h1>
        </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center px-3"
      >
        <p className="text-colorRaffle max-w-2xl gap-4 flex flex-col text-xl items-center font-semibold text-center mb-8"> 
                <TriDown fill={raffle.colorPalette.accent} className="w-[30px] lg:w-[30px]" />
                <span>DEBES REALIZAR EL PAGO POR ALGUNA DE ESTAS OPCIONES Y ENVIAR TU COMPROBANTE DE PAGO AL BOTÓN DE ABAJO</span>
          </p>
          <div className="w-[400px] font-semibold max-w-full uppercase">
            <a href={`https://wa.me/521${raffle.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                 className="bg-primaryRaffle cursor-pointer block py-3 text-center font-semibold text-2xl rounded-xl text-headerRaffle-foreground border-2 border-primaryRaffle hover:bg-headerRaffle mb-5">CLICK AQUÍ PARA IR A <br/> WHATSAPP {setPhoneFormat(raffle.phone)}</a>
            <div className="border-[3px] border-primaryRaffle w-full p-2">
              <header className="pb-2 flex justify-center w-full">
              {raffle.logo?.url ?
                  <div className={`h-16 ${raffle.logo_type === "on" && "border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"}`}>
                  <img alt="logo" className="h-16 object-cover mx-auto" src={raffle.logo.url}  />
              </div>
                  : <DefaultLogo className="rounded-full w-16 h-16 mx-auto"/> }
              </header>
              {raffle.paymentMethods.map((method, index) => (
                <div key={index} className="max-w-full w-full border-2 border-borderRaffle p-2 mb-3">
                    <div className="text-primaryRaffle underline w-full text-center">TU NOMBRE EN CONCEPTO DE PAGO</div>
                    <ul className="mb-3">
                      <li className="flex justify-between items-center"><div className="flex flex-wrap"><span className="text-blue-800 mr-1">Banco:</span><span>{bankLogos[method.bank] ? (
                        <img className="h-[30px]" src={bankLogos[method.bank]} />
                      ) : method.bank}</span></div><span>{ copied[index]?.bank ? <CopyCheck className="w-4 h-4" /> : <CopyIcon onClick={()=>{copyFunc(index, "bank", method.bank)}} className="w-4 h-4" />}</span></li>
                      <li className="flex justify-between items-center"><div className="flex flex-wrap"><span className="text-blue-800 mr-1">Nombre:</span><span>{method.person}</span></div><span>{ copied[index]?.person ? <CopyCheck className="w-4 h-4" /> : <CopyIcon onClick={()=>{copyFunc(index, "person", method.person)}} className="w-4 h-4" />}</span></li>
                      {method.number &&
                        <li className="flex justify-between items-center"><div className="flex flex-wrap"><span className="text-blue-800 mr-1">Numero de tarjeta:</span><span>{formatMethodNumber(method.number)}</span></div><span>{ copied[index]?.number ? <CopyCheck className="w-4 h-4" /> : <CopyIcon onClick={()=>{copyFunc(index, "number", method.number)}} className="w-4 h-4" />}</span></li>
                      }
                      {method.clabe &&
                          <li className="flex justify-between items-center"><div className="flex flex-wrap"><span className="text-blue-800 mr-1">clabe:</span><span>{formatCLABE(method.clabe)}</span></div><span>{ copied[index]?.clabe ? <CopyCheck className="w-4 h-4" /> : <CopyIcon onClick={()=>{copyFunc(index, "clabe", method.clabe)}} className="w-4 h-4" />}</span></li>
                      }
                    </ul>
                    {method.instructions &&
                        <div>{method.instructions}</div>
                    } 
                </div>
              ))}
              <footer className="text-primaryRaffle underline text-center">si alguna cuenta aparece saturada por favor intenta con otra</footer>
            </div>
          </div>
          
      
      </motion.div>
    </div>
  );
};

export default Payment;
