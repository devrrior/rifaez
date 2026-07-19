
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOutletContext, useParams } from "react-router-dom";
import { Search, TriangleAlert } from "lucide-react";
import DefaultLogo from "../../components/ui/default-logo";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const TicketVerification = ({test}) => {
  const { id } = useParams();
  const [ticketNumber, setTicketNumber] = useState("");
  const [success, setSuccess] = useState(null)
  const raffle = useOutletContext();

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

  const handleVerification = async (e) => {
    e.preventDefault();
    if(test){
      return
    }
    const res = await api.post(`/api/raffle/${id}/verify`, { query: ticketNumber })
    if(res.data.status === 200){
      setSuccess({message: 'success', ticket: res.data.ticket})
    } else {
      setSuccess({message: 'unsuccessful'})
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center"
        >
         {raffle.logo?.url ?
               <div className={`h-32 flex items-center justify-center ${raffle.logo_type === "on" && "border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} mb-6`}>
                  <img alt="logo" className="h-32 object-cover mx-auto" src={raffle.logo.url}  />
              </div>
                : <DefaultLogo className="rounded-full w-32 h-32 mx-auto"/>}
          <h1 className="text-3xl font-bold text-colorRaffle mb-4">
            VERIFICADOR DE BOLETOS
          </h1>
          <p className="text-xl text-colorRaffle">
            {raffle.title}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cardRaffle p-8 rounded-lg shadow-xl"
        >
          
          {!success &&
          <>
          <p className="text-colorRaffle text-center mb-8">
            Introduce tu BOLETO, FOLIO ó CELULAR y haz click en "Verificar"
          </p>
          <form onSubmit={handleVerification} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full bg-transparent p-4 rounded text-colorRaffle border-2 border-borderRaffle text-center text-lg"
                placeholder="Escribe Boleto, Folio ó Celular"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primaryRaffle text-primaryRaffle-foreground hover:bg-primaryRaffle-400 text-lg py-6"
            >
              Verificar
            </Button>
          </form>
          </>
          }
          {success?.message === "success" &&
            <div className="space-y-5">
              <div className="text-colorRaffle text-xl">
                Transaccion #{success.ticket.id}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-colorRaffle">Estado de Pago:</div>
                {success.ticket.status === "paid" ? 
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Pagado</span>
                 : <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                 }
              </div>
            </div>
          }
          {success?.message === "unsuccessful" &&
            <div className="space-y-4">
              <TriangleAlert className="text-red-400"/>
              <h1 className="text-colorRaffle text-xl">Boleto no encontrado</h1>
              <p className="text-colorRaffle">Asegurese de haber ingresado los datos correctamente</p>
            </div>
          }


        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-400"
        >
          <p>
            ¿Tienes dudas? Contáctanos por WhatsApp al{" "}
            <a href={`tel:${raffle.phone}`} className="text-colorRaffle">
              {setPhoneFormat(raffle.phone)}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketVerification;
