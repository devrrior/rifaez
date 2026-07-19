
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CircleX, } from "lucide-react";
import { useForm } from "react-hook-form";
import { joiResolver } from '@hookform/resolvers/joi';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ticketInfoValidationSchema} from "../../../validation/ticketInfoSchemaValidate"
import Countdown from "../../components/MinCountdown";
import { Button } from "../../components/ui/button";
import mexicanStates from "../../lib/mexicanStates";
import TriDown from "../../components/TriDown";
import { cn } from '../../lib/utils';
import { VirtuosoGrid } from 'react-virtuoso';
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const Home = ({availableTickets, setAvailableTickets, test}) => {
  const newMexicanStates = mexicanStates.filter(state => state !== "Extranjero")
  const navigate = useNavigate();
  const raffle = useOutletContext();
  const {id} = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [formError, setFormError] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [searchTicket, setSearchTicket] = useState("")
  const purchaseFormRef = useRef(null);
  const ticketSectionRef = useRef(null);
  const [direction, setDirection] = useState("left");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [isInputLocked, lockInputs] = useState(true)
  const {register, handleSubmit, control, trigger, setValue, watch, formState: { errors }} = useForm({
    resolver: joiResolver(ticketInfoValidationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: {
        number: "",
        country: "mexico"
      },
      state: ""
    }
  })

  const prizeImages = raffle.images && raffle.images?.length > 0 ? raffle.images.map((value, index) => {
    return { url: value.url, description: "", alt: `Imagen ${index}` }
  }) : [{url: '', description: '', alt: ''}]
 
  useEffect(() => {
    const timer = setInterval(() => {
      const intDir = direction === "left" ? 1 : -1;
      setCurrentImageIndex((prev) => (prev + intDir + prizeImages.length) % prizeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [direction]);


  useEffect(() => {
    const TOTAL_TICKETS = raffle.maxParticipants;
    const pad = TOTAL_TICKETS.toString().length < 5 ? TOTAL_TICKETS.toString().length : 5;
    const initialTickets = Array.from({ length: TOTAL_TICKETS }, (_, i) => {
      const number = i + 1;
      let status = "purchased"
      if(availableTickets.includes(number)) status = "available"
      return {
        id: number,
        number: String(number).padStart(pad, '0'),
        status,
      };
    });
    if(raffle.purchasedTicketDisplay === "hide") {
      setAllTickets(initialTickets.filter(ticket => ticket.status === "available"));
    } else {
      setAllTickets(initialTickets);
    }

    const storedSelectedTickets = JSON.parse(localStorage.getItem('selectedTickets')) || [];
    setSelectedTickets(storedSelectedTickets.map(id => initialTickets.find(t => t.id === id)).filter(Boolean));
  }, [availableTickets]);

  const [availableToggle, setAvailableToggle] = useState(true)

  const showAvailableTickets = () => {
    setAvailableToggle(prev => !prev)
  }

  const filteredTickets = useMemo(() => {
    let avToggle = availableToggle ? availableToggle : availableToggle === undefined ? true : false
    if (!searchTicket) return allTickets.filter(ticket => avToggle ? ticket : ticket.status === "available");
  
    return allTickets.filter(ticket => ticket.number.includes(searchTicket) &&( avToggle ? ticket : ticket.status === "available" ));
  }, [allTickets, searchTicket, availableToggle]);

  const phoneNumber = watch("phone.number")

  useEffect(()=>{
    const execute = async () => {
      await trigger("phone.number");
      if(!errors.phone){
        lockInputs(false)
      } else {
        lockInputs(true)
      }
    }

    execute()
    
  }, [phoneNumber, errors.phone])


  function formatSpanishDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }



  const handleSelectRandomTicket = () => {

    const availableTickets = allTickets.filter(
      ticket => ticket.status === 'available' && !selectedTickets.find(st => st.id === ticket.id)
    );
    if (availableTickets.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableTickets.length);
    const randomTicket = availableTickets[randomIndex];
    setSelectedTickets(prevSelected => [...prevSelected, randomTicket]);
  };

  const handleTicketClick = (ticket) => {
    if (ticket.status === 'purchased') {
      return;
    }

    setSelectedTickets(prevSelected => {
      const isSelected = prevSelected.find(st => st.id === ticket.id);
      if (isSelected) {
        return prevSelected.filter(st => st.id !== ticket.id);
      } else {
        return [...prevSelected, ticket];
      }
    });
  };

  const removeTicket = (ticket) =>{
    setSelectedTickets(prev => prev.filter(t => t.id !== ticket.id))
  }



  const handlePurchase = async (value) => {
    if (selectedTickets.length === 0) {
      alert("Por favor selecciona al menos un boleto");
      return;
    }
    const newSelectedTickets = selectedTickets.map(ticket => ticket.id)
    if(test){
      setAvailableTickets(prev => prev.filter(p => !newSelectedTickets.includes(p)))
      setSelectedTickets([])
      setPurchaseSuccess(true)
      return
    }
      const res = await api.post(`/api/raffle/${id}/payment`, {...value, tickets: [...newSelectedTickets]})
      if(res.data.status === 200){
        setAvailableTickets(prev => prev.filter(p => !newSelectedTickets.includes(p)))
        navigate("../payment")
        setSelectedTickets([])
        setPurchaseSuccess(true)
        lockInputs(true)
      } else {
        console.log(res)
        setFormError(true)
        const el = purchaseFormRef.current;
        if (el) {
          el.classList.add("hidden");
          el.classList.remove("fixed");
        }
      }
  };

  const redirectWhats = () => {
    window.open('https://wa.me/5216711132200', '_blank')
  }

  const closeForm = () => {
      if(purchaseSuccess){
        setPurchaseSuccess(false)
      }
      const el = purchaseFormRef.current;
      if (el) {
        el.classList.add("hidden");
        el.classList.remove("fixed");
      }
  }

  const scrollToTicketSection = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



function goToNext() {
  setDirection(1);
  setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
}

function goToPrev() {
  setDirection(-1);
  setCurrentImageIndex((prev) =>
    prev === 0 ? prizeImages.length - 1 : prev - 1
  );
}

const touchStartX = useRef(0);
const touchStartY = useRef(0);

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  touchStartX.current = touch.clientX;
  touchStartY.current = touch.clientY;
};

const handleTouchEnd = (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX.current;
  const deltaY = touch.clientY - touchStartY.current;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0) {
      setDirection("left")
      setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
    } else {
      setDirection("right")
      setCurrentImageIndex((prev) => (prev - 1 + prizeImages.length) % prizeImages.length);  
    }
  }
};



  return (
    <div className="flex flex-col items-center min-h-screen bg-backgroundRaffle">
      <div className="flex flex-col bg-headerRaffle items-center font-medium w-full px-3 py-3 text-headerRaffle-foreground ">
      <h1 className="text-3xl uppercase text-center leading-[25px] lg:text-6xl mb-2 tracking-[-2.5px]">
       {raffle?.title}
       </h1>
        {raffle.description && <p className="mb-3 text-lg">{raffle.description}</p> }
        <p className="text-[22px] uppercase md:text-2xl lg:text-3xl tracking-[-1.5px] mb-1 md:mb-3">{formatSpanishDate(raffle?.endDate)}</p>
        {raffle.countdown === "on" &&
        <div className="w-[350px] max-w-full">
        <Countdown targetDate={raffle.endDate}/>
        </div>
      }
      </div>
      <div className=" w-[1400px] max-w-[100vw] mx-auto pb-3 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          {/* Prize Amount */}
          <div className="flex flex-col items-center gap-1">
          <div className="text-center flex w-full flex-col items-center">
           
            <button onClick={scrollToTicketSection} className="flex w-full py-2 text-colorRaffle justify-evenly lg:justify-center items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold">
              <TriDown fill={raffle.colorPalette.accent} className="w-[30px] lg:w-[45px]"/>
              <span className="uppercase text-2xl lg:text-[35px] tracking-[-2px]">Lista De Boletos Abajo</span>
              <TriDown fill={raffle.colorPalette.accent} className="w-[30px] lg:w-[45px]"/>
            </button>
          </div>

          {/* Image Carousel */}

          <div className="flex gap-5 flex-col px-[15px] w-[620px] max-w-full">
              <div 
                className="relative aspect-[620/400] w-full rounded-md overflow-hidden bg-lightTint border-4 border-borderRaffle"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {prizeImages.map((img, index) => {
                    const isCurrent = index === currentImageIndex;
                    const intDir = direction === "left" ? 1 : -1;
                    const isPrevious =
                      index === (currentImageIndex - intDir + prizeImages.length) % prizeImages.length;



                    return (
                      <div 
                      key={img.url}
                        className="absolute top-0 -left-[100%] w-full h-full "
                        style={{
                          animation: isCurrent
                          ? (direction === "left"
                              ? 'slideInFromLeft 0.5s ease-in-out forwards'
                              : 'slideInFromRight 0.5s ease-in-out forwards')
                          : (isPrevious
                              ? (direction === "left"
                                  ? 'slideOutLeft 0.5s ease-in-out forwards'
                                  : 'slideOutRight 0.5s ease-in-out forwards')
                              : undefined)
                        }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    );
                  })}

              </div>


              {/* Prize Places */}
              {(raffle?.additionalPrizes && raffle.additionalPrizes.length > 0) &&
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {raffle?.additionalPrizes.map((prize, index) => (
                  <motion.div
                  key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-cardRaffle p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-bold text-primaryRaffle">{prize.place}do Lugar</h3>
                    <p>{prize.prize}</p>
                  </motion.div>
                  ))}
                </div>
                }
              </div>
          </div>
        </motion.div>
      </div>
      <div className="uppercase w-full text-center flex flex-col gap-1 py-[5px] tracking-[-1px] px-3 bg-headerRaffle text-headerRaffle-foreground mb-8 text-base lg:text-xl">
        <span>1 Boleto por ${raffle.price * 1}</span>
        <span>2 Boleto por ${raffle.price * 2}</span>
        <span>3 Boleto por ${raffle.price * 3}</span>
        <span>4 Boleto por ${raffle.price * 4}</span>
        <span>5 Boleto por ${raffle.price * 5}</span>
        <span>10 Boleto por ${raffle.price * 10}</span>
        <span>25 Boleto por ${raffle.price * 25}</span>
        <span>30 Boleto por ${raffle.price * 30}</span>
        <span>50 Boleto por ${raffle.price * 50}</span>
        <span>100 Boleto por ${raffle.price * 100}</span>
      </div>
      {raffle.extraInfo &&
        <section className="w-full text-center px-4 mb-4 space-y-3 whitespace-pre-line">
          <div className=" p-4 text-[19px] lg:text-[28px] lg:leading-[30px] tracking-[-1px] leading-[16px] text-colorRaffle">{raffle.extraInfo}</div>
        </section>
      }

     

      <section className="bg-headerRaffle text-center w-full text-headerRaffle-foreground flex flex-col items-center gap-5 px-5 py-[10px]">
        <div className="flex mx-auto items-center justify-center gap-5">
          <TriDown fill="var(--header-raffle-foreground)" className="hidden lg:block w-[80px] h-[80px]"/>
          <span className="text-[29px] tracking-[-1.5px] font-medium max-w-[510px] lg:max-w-[550px] lg:max-w-auto leading-[30px] lg:text-5xl">HAZ CLICK ABAJO EN TU NÚMERO DE LA SUERTE</span>
          <TriDown fill="var(--header-raffle-foreground)" className="hidden lg:block w-[80px] h-[80px]"/>
        </div>
        
      </section>
      {(selectedTickets && selectedTickets.length > 0) && 
        <div className="space-y-4 flex w-full flex-col bg-headerRaffle py-6 items-center sticky z-[100] top-[65px] lg:top-[110px] left-0">
        <button onClick={() => {
              const el = purchaseFormRef.current;
              if (el) {
                el.classList.remove("hidden");
                el.classList.add("fixed");
              }
            }} className="px-6 max-w-full w-fit py-2  rounded-md bg-primaryRaffle text-primaryRaffle-foreground flex justify-center items-center gap-3">
          <ArrowRight/>
          <span className="text-lg">Apartar</span>
          <ArrowLeft/>
        </button>
        <div className="flex flex-wrap gap-2 justify-center">
              {selectedTickets.map(ticket => (
                <span key={ticket.id} onClick={()=>{removeTicket(ticket)}} className="border border-primaryRaffle text-headerRaffle-foreground px-3 py-1 rounded-sm cursor-pointer">
                  #{ticket.number}
                </span>
              ))}
          </div>
          <p className="text-yellow-400 text-center">{selectedTickets.length} BOLETOS SELECCIONADOS PARA ELIMINAR HAZ CLICK EN EL BOLETO</p>
           <p className="text-lg">
           Total: ${selectedTickets.length * raffle?.price} MXN
         </p>
         </div>
        }

      {/* Available Tickets Section */}
      <div id="ticketsSection" className="w-full bg-backgroundRaffle py-10">
        <div className="w-[1600px] max-w-[100vw] mx-auto px-4 text-center">
          
        
          {/* Selected Tickets Display */}
          <div ref={ticketSectionRef} className="mb-6 py-3 rounded-lg text-left">
            <div className="flex gap-6 flex-col justify-between items-center">
              <div className="relative w-full flex justify-center">
              <input placeholder="BUSCAR" type="number" value={searchTicket} onChange={(e)=>{setSearchTicket(e.target.value)}} className="border-2 text-center max-w-full bg-backgroundRaffle uppercase font-bold w-[300px] rounded-sm px-4 py-2 border-primaryRaffle text-lg" />
              </div>
              <div className="flex gap-2 max-w-full w-[300px] px-3 py-2 bg-cardRaffle border-2 border-primaryRaffle rounded-sm cursor-pointer justify-center" onClick={handleSelectRandomTicket}>
                <span className="uppercase text-lg font-semibold">Maquinita de la suerte</span>
              </div>
              {raffle.purchasedTicketDisplay === "cross" &&
              <>
              <div className="flex flex-wrap justify-between gap-2 w-[320px] max-w-full items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-colorRaffle border-borderRaffle text-colorRaffle rounded-sm w-[55px] h-[30px] border line-through cursor-not-allowed flex items-center justify-center">000</div>
                  <span className="uppercase font-medium">Pagados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-backgroundRaffle rounded-sm w-[55px] h-[30px] border text-primaryRaffle border-primaryRaffle cursor-pointer"></div>
                  <span className="uppercase font-medium">Disponibles</span>
                </div>
              </div>
             
              <div className="flex gap-2 px-3 py-1 bg-cardRaffle border-2 border-primaryRaffle text-center rounded-sm cursor-pointer justify-center" onClick={showAvailableTickets}>
                <span className="uppercase font-semibold">{availableToggle ? "Mostrar Solo Disponibles" : "VER LISTA COMPLETA"}</span>
              </div>
              </>
              }
            </div>
          
          </div>

          {/* Ticket Grid */}
          {filteredTickets.length > 0 ? (
            <div className="py-4 rounded-lg">
              <VirtuosoGrid
              totalCount={filteredTickets.length}
              itemContent={(index) => (
                <TicketItem 
                  key={filteredTickets[index].id}
                  ticket={filteredTickets[index]}
                  onClick={() => handleTicketClick(filteredTickets[index])}
                  isSelected={selectedTickets.some(st => st.id === filteredTickets[index].id)}
                />
              )}
              listClassName="grid [grid-template-columns:repeat(auto-fit,minmax(57px,1fr))]"
              style={{ height: 500 }}
            />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
              No se encontraron boletos con el número "{searchTicket}". Intenta con otro número o revisa los disponibles.
            </p>
          )}
          {/* <div className="grid grid-cols-5 p-4 border border-borderRaffle rounded-lg md:grid-cols-10 gap-2">
            {filteredTickets?.map( i => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTicketSelection(i)}
                className={`p-2 text-sm rounded transition-colors ${
                  selectedTickets.includes(i)
                    ? "bg-primaryRaffle text-colorRaffle-foreground"
                    : "border border-borderRaffle hover:border-0 hover:text-colorRaffle-foreground"
                }`}
              >
                {i}
              </motion.button>
            ))}
          </div> */}

       
          {/* Purchase Form */}
            <div ref={purchaseFormRef} id="purchase-form" className="bg-[rgba(0,0,0,0.6)] z-[1000] hidden left-0 top-0 w-screen h-screen">
              <div className="flex w-full h-full items-center justify-center px-3">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 mx-auto bg-backgroundRaffle text-center max-w-full w-[500px] relative rounded-lg px-8 py-4"
                  onSubmit={handleSubmit(handlePurchase)}
                  noValidate
                >
                   <div onClick={closeForm} className="w-8 h-8 cursor-pointer text-lg font-semibold rounded-tr-lg bg-primaryRaffle text-primaryRaffle-foreground flex justify-center items-center absolute right-0 top-0">
                    X
                   </div>
                  <header className="mb-4 space-y-3 mt-[40px] flex items-center justify-center flex-col">
                  <h1 className="text-xl md:text-[22px] font-medium leading-[24px] max-w-[240px]">{purchaseSuccess ? "¡GRACIAS POR PARTICIPAR!" : "LLENA TUS DATOS Y DA CLICK EN APARTAR"}</h1>
                  <h2 className="text-primaryRaffle font-medium text-lg max-w-[280px] uppercase">{purchaseSuccess ? "Mucha Suerte" : `${selectedTickets.length} BOLETOS SELECCIONADOS`}</h2>
                  </header>
                  <div className="space-y-4">
                    
                    <div className={`w-full flex p-3 gap-3 rounded border ${purchaseSuccess ? "bg-gray-200 cursor-not-allowed" : "bg-transparent"} ${errors.phone ? "border-red-400" : "border-borderRaffle"}`}>
                      <select name="country" disabled={purchaseSuccess} className="appearance-none focus:outline-none focus:border-transparent bg-transparent" id="country" {...register('phone.country')}>
                        <option value="mexico">🇲🇽</option>
                        <option value="usa">🇺🇸</option>
                      </select>
                      <input
                        disabled={purchaseSuccess}
                        type="tel"
                        placeholder="Whatsapp(10 digitos)"
                        className="focus:outline-none focus:border-transparent bg-transparent"
                        {...register('phone.number')}
                        required
                      />
                    </div>
                    <input
                        type="text"
                        placeholder="Nombre"
                        disabled={isInputLocked}
                        className={`w-full p-3 rounded border ${
                          errors.first_name ? "border-red-400" : "border-borderRaffle"
                        } ${isInputLocked ? "bg-gray-200 cursor-not-allowed" : "bg-transparent"}`}
                        {...register("first_name")}
                        required
                      />

                      <input
                        type="text"
                        placeholder="Apellido"
                        disabled={isInputLocked}
                        className={`w-full p-3 rounded border ${
                          errors.last_name ? "border-red-400" : "border-borderRaffle"
                        } ${isInputLocked ? "bg-gray-200 cursor-not-allowed" : "bg-transparent"}`}
                        {...register("last_name")}
                        required
                      />
                    

                    <div className="relative">
                    <select
                        disabled={isInputLocked}
                        className={`w-full p-3 appearance-none rounded border ${
                          errors.state ? "border-red-400" : "border-borderRaffle"
                        } ${isInputLocked ? "bg-gray-200 cursor-not-allowed" : "bg-transparent"}`}
                        {...register("state")}
                        required
                      >
                        <option value="">SELECCIONAR ESTADO</option>
                         {mexicanStates.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                         ))}
                      </select>
                    </div>
                    <div className="max-w-[360px] mx-auto space-y-2">
                    {!purchaseSuccess ?
                    <>
                    <p style={{
                      lineHeight: "1.3",
                      letterSpacing: "-1px",
                    }} className="text-green-800 font-semibold">¡AL FINALIZAR SERÁS REDIRIGIDO A METODOS DE PAGO PARA ENVIAR LA INFORMACIÓN DE TU BOLETO!                    </p>
                    <p className="text-primaryRaffle font-semibold">{`TU BOLETO SÓLO DURA ${raffle.timeLimitPay * 24} HORAS APARTADO`}</p>

                    </> : 
                    <>
                    <p style={{
                      lineHeight: "1.3",
                      letterSpacing: "-1px",
                    }} className="text-primaryRaffle font-semibold">¡YA QUEDARON APARTADOS TUS BOLETOS!  </p>
                  
                    <p className="text-primaryRaffle font-semibold">TE ESTAMOS REDIRIGIENDO A WHATSAPP SI NO TE REDIRIGE HAZ CLICK EN EL BOTÓN
</p>
                    
                    </>
                  }

                   
                    </div>
                    {!purchaseSuccess ? 
                    <Button
                      type="submit"
                      size="lg"
                      className=" bg-primaryRaffle border-2 border-borderRaffle text-primaryRaffle-foreground hover:bg-primaryRaffle py-4 px-8 sm:px-[80px] rounded-sm text-lg text-center"
                    >
                      Apartar
                    </Button>
                    : 
                    <Button
                      type="button"
                      size="lg"
                      onClick={redirectWhats}
                      className="uppercase bg-primaryRaffle border-2 border-borderRaffle text-primaryRaffle-foreground hover:bg-primaryRaffle py-4 px-8 sm:px-[80px] rounded-sm text-lg text-center"
                    >
                      Redirigir a whatsapp
                    </Button>
                    }
                  </div>
                </motion.form>
              </div>
            </div>
            {formError &&
              <div className="bg-[rgba(0,0,0,0.6)] z-[1000] fixed left-0 top-0 w-screen h-screen">
              <div className="flex w-full h-full items-center justify-center px-3">
                <div className="mt-8 text-red-500 mx-auto flex flex-col items-center gap-3 bg-backgroundRaffle text-center max-w-full w-[400px] relative rounded-lg px-12 py-8">
                    <CircleX className="w-[60px] h-[60px]" />
                    <p className="text-2xl">Ocurrio un error</p>
                    <p className="text-base">Asegurese de haber ingresado los datos bien.</p>
                </div>
              </div>
            </div>
            }
        </div>
      </div>
    </div>
  );
};

const TicketItem = ({ ticket, onClick, isSelected }) => {
  const ticketClasses = cn(
    "flex items-center justify-center border rounded-[2px] h-[30px] m-[1px] text-center font-semibold transition-all duration-200 transform text-xs sm:text-sm",
    {
      "bg-colorRaffle border-borderRaffle text-colorRaffle cursor-not-allowed": ticket.status === 'purchased',
      "bg-backgroundRaffle text-backgroundRaffle border-backgroundRaffle": ticket.status === 'available' && isSelected,
      "bg-backgroundRaffle text-colorRaffle border-primaryRaffle cursor-pointer": ticket.status === 'available' && !isSelected,
    }
  );

  return (
    <div className="">
    <motion.div
      onClick={ticket.status === 'available' ? () => onClick(ticket) : undefined}
      className={ticketClasses}
      layout
    >
      {ticket.number}
    </motion.div>
    </div>
  );
};

export default Home;
