
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronDown, SearchIcon, Shuffle, ArrowRight, ArrowLeft, CircleX } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ticketInfoValidationSchema} from "../../../validation/ticketInfoSchemaValidate"
import Countdown from "../../components/MinCountdown";
import { Button } from "../../components/ui/button";
import mexicanStates from "../../lib/mexicanStates";
import TriDown from "../../components/TriDown";
import { cn } from '../../lib/utils';
import { VirtuosoGrid } from 'react-virtuoso';
import "../../noRadius.css";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const updateTailwindVariables = (raffle) => {
    const root = document.documentElement;

    const colorsPrev = {
        background: raffle.colorPalette.background || "white",
        header: raffle.colorPalette.header || "black",
        borders: raffle.colorPalette.borders || "black",
        color: raffle.colorPalette.color || "black",
        accent: raffle.colorPalette.accent || "black",

    }

    console.log(colorsPrev)

    // Tailwind-style shades (manually defined or imported from tailwind/colors)
    const colorShades = {
        blue: ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#F8F9FA',],
        red: ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c' , '#F8F9FA',],
        green: ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d' , '#F8F9FA',],
        yellow: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706' , '#1E1E1E',],
        purple: ['#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#F8F9FA',],
        white: [
            '#FFFFFF', 
            '#F8F9FA',
            '#F1F3F5', 
            '#E9ECEF', 
            '#DEE2E6',
            '#1E1E1E',
          ],
        black: [
            '#000000', 
            '#121212',
            '#1E1E1E', 
            '#2C2F33',
            '#343A40',
            '#F8F9FA',
          ]
          
        // add more if needed
    };

    function generateColorShades(hex, numberOfShades = 5) {
        function hexToRgb(hex) {
          hex = hex.replace(/^#/, '');
          if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
          }
          const bigint = parseInt(hex, 16);
          return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
          };
        }
      
        function rgbToHex(r, g, b) {
          return (
            '#' +
            [r, g, b]
              .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
              })
              .join('')
          );
        }
      
        function adjustBrightness({ r, g, b }, factor) {
          return {
            r: Math.min(255, Math.max(0, Math.round(r * factor))),
            g: Math.min(255, Math.max(0, Math.round(g * factor))),
            b: Math.min(255, Math.max(0, Math.round(b * factor))),
          };
        }
        function getContrastText({ r, g, b }) {
            // Relative luminance formula
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? 'black' : 'white';
          }
        
          const rgb = hexToRgb(hex);
          const factors = [1.3, 1.15, 1, 0.95, 0.8];
          const shades = factors.map(f => rgbToHex(...Object.values(adjustBrightness(rgb, f))));
          const foreground = getContrastText(rgb);
            if(foreground === "white"){
                shades.reverse();
            } 
          return [...shades, foreground];
      }

    const background = Object.keys(colorShades).includes(colorsPrev.background) ? colorShades[colorsPrev.background] : generateColorShades(colorsPrev.background);
    const headerCheck = colorsPrev.header;
    const header = Object.keys(colorShades).includes(headerCheck) ? colorShades[headerCheck] : generateColorShades(headerCheck);
    const borders = Object.keys(colorShades).includes(colorsPrev.borders) ? colorShades[colorsPrev.borders] : generateColorShades(colorsPrev.borders);
    const color = Object.keys(colorShades).includes(colorsPrev.color) ? colorShades[colorsPrev.color] : generateColorShades(colorsPrev.color);
    const primary = Object.keys(colorShades).includes(colorsPrev.accent) ? colorShades[colorsPrev.accent] : generateColorShades(colorsPrev.accent);
    // Default palette
    console.log(raffle.font)
    const settings = {
        '--light-tint': background[3],
        '--light-color-tint': background[1],
        '--background-raffle': background[2],
        '--font-raffle': raffle.font ,
        '--header-raffle': header[2] ,
        '--header-raffle-foreground': header[5] ,
        '--primary-raffle': primary[2], // 500
        '--primary-raffle-foreground': primary[5], // 500
        '--primary-raffle-300': primary[0],
        '--primary-raffle-400': primary[1],
        '--primary-raffle-500': primary[2],
        '--primary-raffle-600': primary[3],
        '--primary-raffle-700': primary[4],
        '--card-raffle': background[3],
        '--color-raffle': color[2],
        '--color-raffle-foreground': "#fff",
        '--color-raffle-300': color[0],
        '--color-raffle-400': color[1],
        '--color-raffle-500': color[2],
        '--color-raffle-600': color[3],
        '--color-raffle-700': color[4],
        '--border-raffle': borders[1],
    };

    // Set each CSS variable on :root
    Object.entries(settings).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

const HomePreview = ({raffle, previews }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [searchTicket, setSearchTicket] = useState("")
  const ticketSectionRef = useRef(null);
  const [direction, setDirection] = useState("left");
  
  const prizeImages = previews && previews?.length > 0 ? previews.map((value, index) => {
    return { url: value, description: "", alt: `Imagen ${index}` }
  }) : [{url: '', description: '', alt: ''}]


  useEffect(() => {
    updateTailwindVariables(raffle)
  }, [raffle])
 
  useEffect(() => {
    const timer = setInterval(() => {
      const intDir = direction === "left" ? 1 : -1;
      setCurrentImageIndex((prev) => (prev + intDir + prizeImages.length) % prizeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [direction, prizeImages]);


  useEffect(() => {
    const TOTAL_TICKETS = raffle.maxParticipants || 20;
    const pad = TOTAL_TICKETS.toString().length < 5 ? TOTAL_TICKETS.toString().length : 5
    const initialTickets = Array.from({ length: TOTAL_TICKETS }, (_, i) => {
      const number = i + 1;
      let status = "available"
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
  }, [raffle.maxParticipants]);

  const [availableToggle, setAvailableToggle] = useState(true)

  const showAvailableTickets = () => {
    setAvailableToggle(prev => !prev)
  }

  const filteredTickets = useMemo(() => {
    let avToggle = availableToggle ? availableToggle : availableToggle === undefined ? true : false
    if (!searchTicket) return allTickets.filter(ticket => avToggle ? ticket : ticket.status === "available");
  
    return allTickets.filter(ticket => ticket.number.includes(searchTicket) &&( avToggle ? ticket : ticket.status === "available" ));
  }, [allTickets, searchTicket, availableToggle]);




  function formatSpanishDate(isoDateStr) {
    if(isoDateStr){
    const date = new Date(isoDateStr);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
    } else {
        return null
    }
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
 
  


 

  const scrollToTicketSection = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


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
    <div className={`${raffle.border_corner === "square" && "no-radius"}text-colorRaffle font-fontRaffle items-center bg-backgroundRaffle`}>
      <div className="flex flex-col bg-headerRaffle text-center items-center font-medium w-full px-3 py-3 text-headerRaffle-foreground ">
      <h1 className="text-3xl uppercase text-center leading-[25px] mb-2 tracking-[-2.5px]">
       {raffle?.title}
       </h1>
        {raffle.description && <p className="mb-3 text-lg">{raffle.description}</p> }
        <p className="text-[22px] uppercase tracking-[-1.5px] mb-1">{formatSpanishDate(raffle?.endDate)}</p>
        {raffle.countdown === "on" &&
        <div className="w-[350px] max-w-full">
        <Countdown targetDate={raffle.endDate}/>
        </div>
      }
      </div>
      <div className=" w-full max-w-[100%] mx-auto pb-3 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          {/* Prize Amount */}
          <div className="flex flex-col items-center gap-1">
          <div className="text-center flex w-full flex-col items-center">
           
            <button onClick={scrollToTicketSection} className="flex w-full py-2 text-colorRaffle justify-evenly items-center gap-2 text-xl font-semibold">
              <TriDown fill={raffle.colorPalette.accent} className="w-[30px]"/>
              <span className="uppercase text-2xl tracking-[-2px]">Lista De Boletos Abajo</span>
              <TriDown fill={raffle.colorPalette.accent} className="w-[30px]"/>
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
                      key={index}
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
      <div className="uppercase w-full text-center flex flex-col gap-1 py-[5px] tracking-[-1px] px-3 bg-headerRaffle text-headerRaffle-foreground mb-8 text-base ">
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
          <div className=" p-4 text-[19px] tracking-[-1px] leading-[16px] text-colorRaffle">{raffle.extraInfo}</div>
        </section>
      }

      <section className="bg-headerRaffle text-center w-full text-headerRaffle-foreground flex flex-col items-center gap-5 px-5 py-[10px]">
        <div className="flex mx-auto items-center justify-center gap-5">
          <TriDown fill="var(--header-raffle-foreground)" className="hidden w-[80px] h-[80px]"/>
          <span className="text-[29px] tracking-[-1.5px] font-medium max-w-[510px] leading-[30px]">HAZ CLICK ABAJO EN TU NÚMERO DE LA SUERTE</span>
          <TriDown fill="var(--header-raffle-foreground)" className="hidden w-[80px] h-[80px]"/>
        </div>
        
      </section>
      {(selectedTickets && selectedTickets.length > 0) && 
        <div className="space-y-4 flex w-full flex-col bg-headerRaffle py-6 items-center sticky z-[100] top-[65px] left-0">
        <button className="px-6 max-w-full w-fit py-2  rounded-md bg-primaryRaffle text-primaryRaffle-foreground flex justify-center items-center gap-3">
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
           <p className="text-lg text-headerRaffle-foreground">
           Total: ${selectedTickets.length * raffle?.price} MXN
         </p>
         </div>
        }

      {/* Available Tickets Section */}
      <div id="ticketsSection" className="w-full bg-backgroundRaffle py-10">
        <div className="w-full max-w-[100%] mx-auto px-4 text-center">
          
        
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

       
        </div>
      </div>
    </div>
  );
};


const TicketItem = ({ ticket, onClick, isSelected }) => {
  const ticketClasses = cn(
    "flex items-center justify-center border rounded-[2px] h-[30px] m-[1px] text-center font-semibold transition-all duration-200 transform text-xs",
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

export default HomePreview;
