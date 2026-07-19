
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Check,
  ChevronLeft,
  AlertTriangle,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  Clock2,
  DollarSign
} from "lucide-react";
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, 
});

const TicketDetails = () => {
  const { user, setUser} = useAuth()
  const { raffleID, transactionID } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {setAppError} = useAuth()
  const [note, setNote] = useState("");
  const [notedAdded, setNoteAdded] = useState(false);
  const [notFound, setNotFound] = useState(false)
  // This would come from your database
  const [ticket, setTicket] = useState({});


  const setPhoneFormat = (phone) => {
    const digits = phone?.toString()?.replace(/\D/g, '');
  
    const parts = [];
  
    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, 3) + ')'); 
    }
    if (digits?.length >= 4) {
      parts.push(' ' + digits.substring(3, 6));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10)); 
    }
  
    return parts.join('');
  };

  useEffect(()=>{
    const raffle = user.raffles.find(raffle => raffle._id === raffleID)
    const newTicket = raffle.currentParticipants.find(transaction => transaction.transactionID === transactionID)
    if(raffle && newTicket){
      const [date, time] = newTicket.date.split('T');
      setTicket({
        _id: newTicket._id,
        id: newTicket.transactionID,
        status: newTicket.status,
        buyer: newTicket.name,
        date: date,
        amount: newTicket.amount,
        time: time.split('.')[0],
        state: newTicket.state,
        phone: setPhoneFormat(newTicket.phone),
        notes: []
      })
    } else {
      setNotFound(true)
    }
  }, [user])

  const handleMarkAsPaid = async () => {
    try {
      const res = await api.post(`/api/raffle/${raffleID}/${ticket._id}/mark_paid`)
      if(res.data.status === 200){
        setUser(res.data.user)
      } else {
        setAppError(error)
      }
    } catch (error) {
      setAppError(error)
    }
    
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      const res = await api.post(`/api/raffle/${raffleID}/${ticket._id}/add_note`, {note})
      if(res.data.status === 200){
        setUser(prev => ({
          ...prev,
          raffles: prev.raffles.map(raffle => {
            if (raffle.id === raffleID) {
              return {
                ...raffle,
                currentParticipants: raffle.currentParticipants.map(participant => {
                  if (participant.id === ticket._id) {
                    return {
                      ...participant,
                      notes: [...(participant.notes || []), note]
                    };
                  }
                  return participant;
                })
              };
            }
            return raffle;
          })
        }));
        setNoteAdded(true)
        setNote("");
      }
    }
  };

  useEffect(()=>{
    if(notedAdded){
      const timer = setTimeout(() => {
        setNoteAdded(false); 
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [notedAdded])

  if(notFound) return(
    <div className="flex flex-col items-center h-[500px] justify-center space-y-6">
      <h1 className="text-gray-600 text-3xl font-semibold">Transacción No Encontrada</h1>
      <p className="text-base text-center text-gray-500">La transacción que estás buscando no existe. Verifica que los datos ingresados sean correctos.</p>
      <button onClick={()=>{navigate("/raffle-admin")}} className="rounded-3xl px-5 py-2 bg-blue-600 text-primary-foreground hover:bg-blue-700 transition duration-200">Regresar a la Página de Inicio</button>
    </div>

  );
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/raffle-admin/stats")}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>
        <h1 className="text-2xl font-bold">Transaccion #{transactionID}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg p-6 shadow-lg space-y-6"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">Información del Comprador</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            ticket.status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {ticket.status === "paid" ? "Pagado" : "Pendiente"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User />} label="Nombre" value={ticket.buyer} />
          <InfoItem icon={<Mail />} label="State" value={ticket.state} />
          <InfoItem icon={<Phone />} label="Teléfono" value={ticket.phone} />
          <InfoItem icon={<Calendar />} label="Fecha" value={ticket.date} />
          <InfoItem icon={<DollarSign />} label="Monto" value={ticket.amount} />
          <InfoItem icon={<Clock2 />} label="Time" value={ticket.time} />
        </div>

        {ticket.status === "pending" && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Pago pendiente</span>
            </div>
            <Button onClick={handleMarkAsPaid}>
              <Check className="w-4 h-4 mr-2" />
              Marcar como Pagado
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg p-6 shadow-lg space-y-4"
      >
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Notas</h2>
        </div>

        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Agregar una nota..."
            className="w-full p-3 rounded-lg border border-input bg-background min-h-[100px]"
          />
          <Button onClick={handleAddNote} className="w-full">
            {notedAdded ? "Nota fue agregada" : "Agregar Nota"}
          </Button>
        </div>

        <div className="space-y-4 mt-6">
          {ticket.notes?.map((note, index) => (
            <div
              key={index}
              className="bg-muted p-4 rounded-lg"
            >
              <p className="text-sm">{note.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(note.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-primary/10 rounded-full text-primary">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default TicketDetails;
