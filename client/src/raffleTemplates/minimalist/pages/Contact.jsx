
import { motion } from "framer-motion";
import axios from 'axios';
import { useOutletContext } from "react-router-dom";
import { ChevronRight, Facebook, Mail, Phone, Send } from 'lucide-react';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const Contact = () => {
  const raffle = useOutletContext()


  const setPhoneFormat = (phone) => {
    if(phone){
      const digits = phone?.replace(/\D/g, ''); 

      const parts = [];

      if (digits.length > 0) {
        parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
      }
      if (digits.length >= 4) {
        parts[0] += ') ';
        parts.push(digits.substring(3, Math.min(6, digits.length)));
      }
      if (digits.length >= 7) {
        parts.push('-' + digits.substring(6, 10));
      }

      return parts.join('');
    }
    
  }


  return (
    <div className="max-w-[100vw] w-[1400px] mb-6 flex justify-center mx-auto px-4 py-8 h-[calc(100vh-280px)] min-h-[500px]">
      <motion.div 
          className="space-y-8 my-12 max-w-full"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl text-center font-semibold text-colorRaffle">Información de Contacto</h2>
          <div className="space-y-4">
            <div className="flex w-[400px] max-w-full items-start space-x-3 p-4 bg-cardRaffle rounded-lg">
              <Mail className="h-6 w-6 text-primaryRaffle mt-1" />
              <div>
                <h3 className="font-semibold text-colorRaffle">Correo Electrónico</h3>
                <p className="text-colorRaffle-300 hover:text-primaryRaffle transition-colors cursor-pointer">{raffle.email}</p>
              </div>
            </div>
            <div className="flex w-[400px] max-w-full items-start space-x-3 p-4 bg-cardRaffle rounded-lg">
              <Phone className="h-6 w-6 text-primaryRaffle mt-1" />
              <div>
                <h3 className="font-semibold text-colorRaffle">Teléfono</h3>
                <p className="text-colorRaffle-300 hover:text-primaryRaffle transition-colors cursor-pointer">{setPhoneFormat(raffle.phone)}</p>
              </div>
            </div>
            {raffle.facebookUrl && 
              <a
                  href={`${raffle.facebookUrl}`}
                  target="_blank"
                  rel="noopener noreferrer" className="flex w-[400px] max-w-full items-center space-x-3 p-4 bg-blue-600 text-white rounded-lg">
                <Facebook className="h-6 w-6" />
                <div className='grow justify-between flex items-center'>
                  <p className="text-white-300 hover:text-primaryRaffle transition-colors cursor-pointer">Contactanos</p>
                  <ChevronRight />
                </div>
              </a>
            }
            <a
                href={`https://wa.me/521${raffle.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-[400px] max-w-full items-center space-x-3 p-4 bg-green-600 text-white rounded-lg">
              <div className='w-6 h-6 flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                </div>
              <div className='grow justify-between flex items-center'>
                <p className="text-white-300 hover:text-primaryRaffle transition-colors cursor-pointer">Contactanos</p>
                <ChevronRight />
              </div>
            </a>
          </div>
        </motion.div>
    </div>
  );
};

export default Contact;
