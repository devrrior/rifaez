import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import PrizeSection from '../components/PrizeSection';
import TicketSelection from '../components/TicketSelection';
import Countdown from '../../components/Countdown';
import SelectedTicketsSummary from '../components/SelectedTicketsSummary';
import { ticketInfoValidationSchema } from '../../../validation/ticketInfoSchemaValidate';
import mexicanStates from '../../lib/mexicanStates';
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});


const AvailableTicketsPage = ({ availableTickets, setAvailableTickets, test }) => {
  const raffle = useOutletContext()
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const newMexicanStates = mexicanStates.filter(state => state !== "Extranjero");
  const [filteredStates, setFilteredStates] = useState([...newMexicanStates, "Extranjero"]);
  const [showSearch, setShowSearch] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    state: "",
  })
  const [wasSubmitted, setWasSubmitted] = useState(null)
  const [allTickets, setAllTickets] = useState([]);
  const [buyerPopUp, setBuyerPopUp] = useState(false)
  const [errors, setErrors] = useState([])
  const {id} = useParams()
  const [searchTerm, setSearchTerm] = useState('');

  const TICKET_PRICE = raffle.price;
  

  useEffect(() => {
    const TOTAL_TICKETS = raffle.maxParticipants;
    const initialTickets = Array.from({ length: TOTAL_TICKETS }, (_, i) => {
      const number = i + 1;
      let status = "purchased"
      if(availableTickets.includes(number)) status = "available"
      return {
        id: number,
        number: String(number).padStart(3, '0'),
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

  function formatSpanishDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  useEffect(() => {
    localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets.map(t => t.id)));
  }, [selectedTickets]);

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

  const handleRemoveSelectedTicket = (ticketId) => {
    setSelectedTickets(prevSelected => prevSelected.filter(st => st.id !== ticketId));
  };

  const totalPrice = selectedTickets.length * TICKET_PRICE;

  const filteredTickets = useMemo(() => {
    if (!searchTerm) return allTickets;
    return allTickets.filter(ticket => ticket.number.includes(searchTerm));
  }, [allTickets, searchTerm]);

  const handleSiguienteClick = () => {
    if (selectedTickets.length === 0) {
      toast({
        title: "No hay boletos seleccionados",
        description: "Por favor, selecciona al menos un boleto para continuar.",
        variant: "destructive",
      });
      return;
    }
    setBuyerPopUp(true)
    // navigate('../pago');
  };
  const validateBuyerInfo = () => {
    const errorObj = {}
    let isValid = true
    const {error, value} = ticketInfoValidationSchema.validate(buyerInfo, { abortEarly: false })
    if(error){
      isValid = false
      error.details.forEach(detail => errorObj[detail.context.key] = detail.message)
    }
    setErrors(errorObj)
    return [isValid, value]
  }
  useEffect(()=>{
    if(wasSubmitted){
      validateBuyerInfo()
    }
  }, [buyerInfo])
  const handleChange = (e) => {
    let {name, value} = e.target
    if(name === "state"){
      setShowSearch(true)
      const filteredStates = newMexicanStates.filter(state => {
        return state.toLowerCase().includes(value.toLowerCase())
      })
      setFilteredStates([...filteredStates, "Extranjero"])
    }
    if(name === "phone"){
      value = value.replace(/\D/g, '');
      if(value.length > 10){
        value = value.slice(0, 10); 
      }
    }
    setBuyerInfo(prev => ({...prev, [name]: value}))
  }
  const handleApartarClick = async () => {
    setWasSubmitted(true)
    const [isValid, value] = validateBuyerInfo();
    if (selectedTickets.length === 0) {
      alert("Por favor selecciona al menos un boleto");
      return;
    }
    const newSelectedTickets = selectedTickets.map(ticket => ticket.id)
    if(test){
      localStorage.setItem('selectedTickets', JSON.stringify(newSelectedTickets));
      localStorage.setItem('userInfo', JSON.stringify(value));
      setAvailableTickets(prev => prev.filter(p => !newSelectedTickets.includes(p)))
      setSelectedTickets([])
      navigate('../pago');
      return
    }
    if(isValid){
      const res = await api.post(`/api/raffle/${id}/payment`, {...value, tickets: newSelectedTickets})
      if(res.data.status === 200){
        localStorage.setItem('selectedTickets', JSON.stringify(newSelectedTickets));
        localStorage.setItem('userInfo', JSON.stringify(value));
        setAvailableTickets(prev => prev.filter(p => !newSelectedTickets.includes(p)))
        setSelectedTickets([])
        navigate('../pago');
      } else {
        console.log(res)
      }
    }
  };
  const selectState = (e) => {
    const value = e.target.textContent
    setShowSearch(false)
    setBuyerInfo(prev => ({...prev, state: value}))
  }

  return (
    <motion.div
      className="space-y-8 sm:space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* <section className="relative text-center py-10 sm:py-16 bg-gradient-to-r from-primaryRaffle to-primaryRaffle-600 rounded-xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-colorRaffle-foreground mb-2 sm:mb-3 px-2 z-10 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Sorteo Estelar: ¡Gana Fabulosos Premios!
        </motion.h1>
        <motion.p
          className="text-md sm:text-lg text-blue-100 max-w-2xl mx-auto px-4 z-10 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tu oportunidad de ganar está a un boleto de distancia.
        </motion.p>
        <motion.div 
          className="mt-4 text-xs sm:text-sm text-blue-200 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="inline-flex items-center mr-3"><CalendarDays className="h-4 w-4 mr-1"/>Sorteo: {formatSpanishDate(raffle.endDate)}</span>
          <span className="inline-flex items-center"><Info className="h-4 w-4 mr-1"/>¡Mucha suerte a todos!</span>
        </motion.div>
      </section> */}

      <PrizeSection raffle={raffle} />
      {raffle.extraInfo &&
        <section className="w-full text-center px-4 space-y-3 whitespace-pre-line">
          <div className=" p-4 text-colorRaffle">{raffle.extraInfo}</div>
        </section>
      }
      {raffle.countdown === "on" &&
        <Countdown targetDate={raffle.endDate}/>
      }

      
      <TicketSelection
        tickets={filteredTickets}
        selectedTickets={selectedTickets}
        onTicketClick={handleTicketClick}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSelectRandomTicket={handleSelectRandomTicket}
        ticketPrice={TICKET_PRICE}
      />

      <AnimatePresence>
        {selectedTickets.length > 0 && (
          <SelectedTicketsSummary
            selectedTickets={selectedTickets}
            totalPrice={totalPrice}
            onRemoveTicket={handleRemoveSelectedTicket}
            onSiguienteClick={handleSiguienteClick}
            onApartarClick={handleApartarClick}
            ticketPrice={TICKET_PRICE}
            buyerPopUp={buyerPopUp}
            errors={errors}
            handleChange={handleChange}
            filteredStates={filteredStates}
            buyerInfo={buyerInfo}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            selectState={selectState}
          />
        )}
      </AnimatePresence>
     
      
    </motion.div>
  );
};

export default AvailableTicketsPage;