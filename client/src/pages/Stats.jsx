
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion";
import NoRaffle from "../components/NoRaffle";
import AdminPanel from "../components/TicketPanel/admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { 
  BarChart2, 
  Calendar,
  Eye,
  AlertTriangle,
  DollarSign,
  Search,
  Clock,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MessageSquare,
  Check,
  Phone,
  MapPin,
  User,
  Edit,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, 
});

const StatsPage = ({ selectedRaffle }) => {
  const { user, setUser, setAppError } = useAuth()
  const dateRef = useRef(null)
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notesOpen, setNotesOpen] = useState({})
  const [chartData, setChartData] = useState({
    labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    datasets: [
      {
        label: "Visitas",
        data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3200],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Ventas",
        data: [800, 1200, 1000, 1800, 1600, 2200, 2000, 2400],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  })
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(selectedRaffle?.currentParticipants);


  
  // Mock data for tickets
  
  const createDataChart = (hourArray, dayStat) => {
    const dataArray = [];
  
    const localTimeArray = dayStat.time?.map(visit => {
      const utcDateTime = new Date(`${dayStat.date}T${visit.hour}:00Z`);
      const localHour = utcDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).slice(0, 5); // e.g., "14:00"
      return { hour: localHour, count: visit.count };
    });
  
    for (let i = 0; i < hourArray.length; i++) {
      const found = localTimeArray.find(visit => visit.hour === hourArray[i]);
      dataArray.push(found ? found.count : 0);
    }
  
    return dataArray;
  };
  const getTodayVisitStat = (dailyStats, selectedDate) => {
    return dailyStats?.find(visit => {
      const utcDate = new Date(`${visit.date}T00:00:00Z`);
      const localDateStr = utcDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return localDateStr === selectedDate;
    });
  };

  useEffect(() => {
    if (!selectedRaffle) return;
  
    const now = new Date();
    const minutes = now.getMinutes();
    if (minutes >= 30) {
      now.setHours(now.getHours() + 1);
    }
    now.setMinutes(0, 0, 0);
  
    const nowHours = now.getHours();
    const hourArray = [];
  
    for (let i = 0; i < 5; i++) {
      const hour = (nowHours - 4 + i + 24) % 24;
      hourArray.push(hour.toString().padStart(2, '0') + ':00');
    }

    const selectedDateNew = new Date(selectedDate);
    const selectedDateLocal = selectedDateNew.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    const todayVisits = getTodayVisitStat(selectedRaffle.stats.dailyVisitStats, selectedDateLocal);
    const todaySales = getTodayVisitStat(selectedRaffle.stats.dailySales, selectedDateLocal);
  
    const dataViewArray = todayVisits ? createDataChart(hourArray, todayVisits) : Array(5).fill(0);
    const dataSaleArray = todaySales ? createDataChart(hourArray, todaySales) : Array(5).fill(0);
  
    setChartData({
      labels: hourArray,
      datasets: [
        {
          label: "Visitas",
          data: dataViewArray,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4
        },
        {
          label: "Ventas ($)",
          data: dataSaleArray,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4
        }
      ]
    });
  }, [selectedDate, selectedRaffle]);
  

  const toggleNotes = (id) => {
    setNotesOpen(prev => ({...prev, [id]: !prev[id] }));
  }

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
  

  const searchTicket = (e) => {
    const searchQ = e.target.value
    const searchLower = searchQ.toLowerCase();
    const newFilteredTickets = selectedRaffle?.currentParticipants?.filter(ticket => 
        ticket.phone.toString().includes(searchLower) ||
        ticket.name.toLowerCase().includes(searchLower) ||
        ticket.state.toLowerCase().includes(searchLower) ||
        ticket.amount.toString().includes(searchLower) ||
        ticket.transactionID.toLowerCase().includes(searchLower) ||
        ticket.status.toLowerCase().includes(searchLower) ||
        ticket.tickets.find(ticket_num => ticket_num.toString().includes(searchLower))
      );
    setSearchQuery(searchQ)
    setFilteredTickets(newFilteredTickets)
  }


  const handleMarkAsPaid = async (ticketId) => {
    const res = await api.post(`/api/raffle/${selectedRaffle._id}/${ticketId}/mark_paid`)
    if(res.data.status === 200){
      setFilteredTickets(prev => prev.map(ticket => {
          if(ticketId === ticket._id){
            ticket.status = "paid";
          }
          return ticket
      }))
    } else {
      setAppError(true)
    }
  };


  useEffect(()=>{
    setFilteredTickets(selectedRaffle?.currentParticipants)
  }, [selectedRaffle])
  



  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };


  return  (
    <div className="space-y-8">
        <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Estadísticas de {selectedRaffle.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2">
          Análisis detallado de la rifa
        </p>
      </motion.div>

      <div className="flex justify-end">
        <div
        onClick={() => dateRef.current?.showPicker?.()}
         className="relative">
              <Calendar className="absolute left-4 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                ref={dateRef}
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-4 sm:pl-10 pr-2 py-2 appearance-none text-sm w-[150px] rounded-md border border-input bg-background"
              />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          title="Visitas Totales"
          value={selectedRaffle.totalVisits}
          trend=""
          positive
        />
        <StatCard
          icon={<Ticket className="w-5 h-5" />}
          title="Boletos Vendidos"
          value={`${selectedRaffle?.currentParticipants?.reduce((acc, current) => acc + current?.tickets?.length, 0) || 0} / ${selectedRaffle.maxParticipants} `}
          trend=""
          positive
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          title="Pagos Pendientes"
          value={(selectedRaffle?.currentParticipants?.reduce((acc, participant) => acc + participant?.tickets?.length, 0) || 0 )  - selectedRaffle?.stats?.paidParticipants}
          trend=""
          positive={false}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Ingresos"
          value={selectedRaffle?.currentParticipants?.reduce((acc, current) => acc + current.amount, 0) || 0}
          trend=""
          positive
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Countdown selectedRaffle={selectedRaffle} />
        

        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Estado de Boletos
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total de Boletos</span>
              <span className="font-semibold">{selectedRaffle?.maxParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Boletos Pagados</span>
              <span className="font-semibold">{selectedRaffle?.stats?.paidParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Boletos Pendientes</span>
              <span className="font-semibold">{(selectedRaffle?.currentParticipants?.reduce((acc, participant) => acc + participant?.tickets?.length, 0) || 0 ) - selectedRaffle?.stats?.paidParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Boletos Disponibles</span>
              <span className="font-semibold">{selectedRaffle?.maxParticipants - (selectedRaffle?.currentParticipants?.reduce((acc, participant) => acc + participant?.tickets?.length, 0) || 0 )}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Visitas y Ventas</h2>
        <div className="h-[300px] max-h-fit">
          <Line options={chartOptions} data={chartData} />
        </div>
      </motion.div>


      <AdminPanel userTickets={selectedRaffle?.currentParticipants} selectedRaffle={selectedRaffle} />

     
      </>
  
      </div>
   )
  ;
};

const StatCard = ({ icon, title, value, trend, positive }) => (
  <div className="bg-card rounded-lg p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
    </div>
    <h3 className="text-lg font-semibold mt-4">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const TimeBlock = ({ label, value }) => (
  <div className="bg-primary/5 rounded-lg p-2">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const Countdown = ({selectedRaffle}) => {
  const getTimeLeft = (target)=>{
    const now = new Date();
    const end = new Date(target?.endDate);
    const diffMs = end - now;

    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(selectedRaffle))

  useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(getTimeLeft(selectedRaffle));
  }, 1000);

  return () => clearInterval(interval);
  }, [selectedRaffle]);

  return (
      <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Tiempo Restante
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <TimeBlock label="Días" value={timeLeft.days} />
                <TimeBlock label="Horas" value={timeLeft.hours} />
                <TimeBlock label="Minutos" value={timeLeft.minutes} />
                <TimeBlock label="Segundos" value={timeLeft.seconds} />
              </div>
      </div>
  )
}

export default StatsPage;
