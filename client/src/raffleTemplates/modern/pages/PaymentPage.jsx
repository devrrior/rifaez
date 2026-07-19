import {useState, useEffect, useRef} from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Smartphone, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const PaymentMethodCard = ({ method, onCopy }) => {

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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
        <CardHeader>
          <CardTitle className="flex items-center text-xl sm:text-2xl text-primaryRaffle">
            {method.bank}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
            <div  className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-colorRaffle">Beneficiario: </span>
              <div className='flex gap-2 items-center justify-between'>
              <span className="text-colorRaffle-300 break-all">{method.person}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 px-2 py-1 h-auto text-primaryRaffle hover:bg-blue-100 hover:text-primaryRaffle"
                  onClick={() => onCopy(method.person)}
                >
                  <Copy className="h-4 w-4 mr-1" /> <span className='hidden sm:block'>Copiar</span>
                </Button>
                </div>
            </div>
            {method.number &&
              <div  className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-colorRaffle">Numero de Tarjeta: </span>
                <div className='flex gap-2 items-center justify-between'>
                  <span className="text-colorRaffle-300 break-all">{formatMethodNumber(method.number)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 px-2 py-1 h-auto text-primaryRaffle hover:bg-blue-100 hover:text-primaryRaffle"
                      onClick={() => onCopy(method.number)}
                    >
                      <Copy className="h-4 w-4 mr-1" /> <span className='hidden sm:block'>Copiar</span>
                    </Button>
                </div>
              </div>
            }
            {method.clabe &&
              <div  className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-colorRaffle">CLABE: </span>
                <div className='flex gap-2 items-center justify-between'>
                  <span className="text-colorRaffle-300 break-all">{formatCLABE(method.clabe)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 px-2 py-1 h-auto text-primaryRaffle hover:bg-blue-100 hover:text-primaryRaffle"
                      onClick={() => onCopy(method.clabe)}
                    >
                      <Copy className="h-4 w-4 mr-1" /> <span className='hidden sm:block'>Copiar</span>
                    </Button>
                  </div>
              </div>
            }
            {method.instructions &&
            <div  className="text-sm sm:text-base">
              <span className="font-semibold text-colorRaffle">Nota: </span>
              <span className="text-colorRaffle-300 break-all">{method.instructions}</span>
            </div>
            }
        </CardContent>
    </Card>
  );
};

const PaymentPage = ({ setAvailableTickets }) => {
  const { toast } = useToast();
  const WHATSAPP_NUMBER = "5212323232323"; 
  const location = useLocation();
  const WHATSAPP_MESSAGE = "Hola, he realizado el pago de mis boletos. Adjunto mi comprobante.";
  const navigate = useNavigate();
  const [noTickets, setNoTickets] = useState(true);
  const raffle = useOutletContext();
  const topRef = useRef(null);

  useEffect(() => {
    const unParsedTickets = localStorage.getItem('selectedTickets')
    const unParsedUser = localStorage.getItem('userInfo')
    localStorage.removeItem('selectedTickets')
    localStorage.removeItem('userInfo')
    let tickets
    let user
    if(unParsedTickets && unParsedUser){
      localStorage.setItem('pendingSelectedTickets', unParsedTickets)
      localStorage.setItem('pendingUserInfo', unParsedUser)
      tickets = JSON.parse(unParsedTickets || '[]');
      user = JSON.parse(unParsedUser || '{}');
    } else {
      tickets = JSON.parse(localStorage.getItem('pendingSelectedTickets') || '[]');
      user = JSON.parse(localStorage.getItem('pendingUserInfo') || '{}');
    }
    
    if (!tickets.length || Object.keys(user).length === 0) {
      return;
    }
    setNoTickets(false)
    
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);



  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado al portapapeles",
        description: `(${text}) copiado exitosamente.`,
        action: <CheckCircle className="text-green-500"/>,
      });
    }).catch(err => {
      toast({
        title: "Error al copiar",
        description: `No se pudo copiar. Por favor, inténtalo manualmente.`,
        variant: "destructive",
      });
    });
  };
  
  const paymentMethods = raffle.paymentMethods;
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
  const goToParent = () => {
    const segments = location.pathname.split("/").filter(Boolean); 
    const parentPath = "/" + segments.slice(0, -1).join("/"); 
    navigate(parentPath);
  };

  if(noTickets) return (
    <div className="text-colorRaffle box-border mx-auto max-w-2xl w-full min-h-[calc(100vh-280px)] py-4 px-2">
      <div className="h-[500px] flex-col justify-center text-center space-y-6 flex items-center">
        <div className="text-2xl md:text-3xl">No haz seleccionado un boleto de la rifa</div>
        <p className="text-sm md:text-base text-colorRaffle-300">Debes seleccionar al menos un boleto de la rifa y llenar tu informacion para poder accesar los metodos de pago</p>
        <button onClick={goToParent} className="text-colorRaffle-foreground rounded-[50px] text-sm sm:text-base w-fit ml-auto mr-auto bg-primaryRaffle flex justify-center items-center px-6 py-3">Regresar a pagina de rifa</button>
        </div>
      </div>
  );
  return (
    <motion.div
      className="space-y-8 max-w-3xl mx-auto py-6 sm:py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <section className="text-center px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primaryRaffle mb-3">Realiza tu Pago</h1>
        <p className="text-md sm:text-lg text-colorRaffle-300">
          Selecciona tu método de pago preferido y sigue las instrucciones.
        </p>
      </section>

      <div className="grid md:grid-cols-1 gap-6 px-2 sm:px-4">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PaymentMethodCard 
             method={method}
             onCopy={handleCopyToClipboard}
            />
          </motion.div>
        ))}
      </div>

      <section className="text-left sm:text-center mt-10 px-2 sm:px-4">
        <Card className="bg-cardRaffle border-borderRaffle shadow-xl px-4 py-6 sm:p-8">
          <CardContent className="px-3 space-y-5 sm:px-6 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primaryRaffle">
              ¡Importante! Envía tu Comprobante
            </h2>
            <p className="text-base sm:text-lg text-colorRaffle">
              Una vez realizado el depósito o transferencia, por favor envía tu comprobante de pago al siguiente número de WhatsApp para confirmar tu participación:
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <a
                href={`https://wa.me/521${raffle.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className=""
                >
                <Button className="flex-col gap-2 xs:flex-row min-h-5 items-start text-left sm:items-center sm:text-center h-auto py-2  bg-green-500 hover:bg-green-600 text-colorRaffle-foreground">
                  <Smartphone className=" min-h-5 min-w-5 h-5 w-5 sm:h-6 sm:w-6" /> <span className='text-base xs:text-lg sm:text-xl'>Enviar Comprobante por WhatsApp</span>
                </Button>
              </a>
            </a>
            <p className="text-base text-colorRaffle-300 flex flex-col sm:justify-center gap-2 sm:flex-row mt-2">
              Número de contacto: <span className="font-semibold text-primaryRaffle">{setPhoneFormat(raffle.phone)}</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className='flex px-2 text-center sm:px-4 items-center justify-center text-colorRaffle'>
          Tus boletos ya quedaron apartados tienes {raffle.timeLimitPay} dias(s) para realizar el pago.
      </section>
      
      <section className="text-center px-2 sm:px-4 pt-6">
          <p className="text-xs text-colorRaffle-300">
            Si tienes alguna duda, contáctanos a través de la sección de "Contacto". Tus boletos serán confirmados una vez validado el pago.
          </p>
      </section>

    </motion.div>
  );
};

export default PaymentPage;