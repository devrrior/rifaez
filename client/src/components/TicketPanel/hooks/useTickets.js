import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, // same as fetch's credentials: 'include'
});

export const useTickets = (userTickets, selectedRaffle) => {
  const [tickets, setTickets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { setUser } = useAuth()

  useEffect(()=>{
      setTickets(userTickets)
  }, [userTickets])

  useEffect(() => {
    setTransactions(tickets);
  }, [tickets]);

  const updateTicket = async (ticketNumber, updates) => {
    const res = await api.post(`/api/raffle/${selectedRaffle._id}/${ticketNumber}/update_ticket`, {updates})
    if(res.data.status === 200){
      setUser(res.data.user)
    }
  };
  

  const deleteTicket = async (ticketNumber) => {
    const res = await api.delete(`/api/raffle/${selectedRaffle._id}/${ticketNumber}`)
    if(res.data.status === 200){
      setUser(res.data.user)
    }
  };

  const updateTransactionStatus = async (ticketId) => {
    const res = await api.post(`/api/raffle/${selectedRaffle._id}/${ticketId}/update_tickets`)
    if(res.data.status === 200){
      setUser(res.data.user)
    }
  };

  return { tickets, transactions, updateTicket, deleteTicket, updateTransactionStatus };
};