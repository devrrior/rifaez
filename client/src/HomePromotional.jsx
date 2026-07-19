import Logo from "./Logo"
import React from "react";
import { Button } from "@/components/TicketPanel/ui/button"
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/home_components/ui/card';
import { motion, AnimatePresence } from "framer-motion";
import PromotionalLayout from "./PromotionalLayout";
import { ChevronRight, Shuffle, Rocket, CheckCircle, Zap, Edit, Copy, TicketIcon, Clock, Info, Award, BarChart, Users, Palette, Globe, MessageCircle, Search, Ticket, ChevronDown, Router, PanelsTopLeft, ChartBar, Server, User, Trash2, MapPin, Phone, Calendar, Grid3X3 } from "lucide-react"
import { Badge } from '@/components/TicketPanel/ui/badge';
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js";

const tickets = [
  {
    number: 101,
    status: "pendiente",
    notes: ""
  },
  {
    number: 102,
    status: "pendiente",
    notes: ""
  },
  {
    number: 103,
    status: "pagado",
    notes: "Paid via OXXO"
  }
];

export default function HomePromotional(){
    const navigate = useNavigate()
    const [domainAnimateText, setDomainAnimateText] = useState("")
    const pricing = useRef(null)
    const chartData = {
        labels: ["11:00", "12:00", "13:00", "14:00", "15:00"],
        datasets: [
          {
            label: "Visitas",
            data: [1200, 1900, 1500, 2500, 2200, 3000],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Ventas",
            data: [800, 1200, 1000, 1800, 1600, 2200],
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      }
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
      const plans = [
        {
          name: 'Plan Básico',
          price: '$150 USD',
          priceSuffix: '/ mes',
          features: [
            { text: '1 rifa activa', icon: <Award className="h-5 w-5 text-blue-500" /> },
            { text: '1 Plantilla de diseño', icon: <Palette className="h-5 w-5 text-blue-500" /> },
            { text: 'Hasta 2 trabajadores', icon: <Users className="h-5 w-5 text-blue-500" /> },
            { text: 'Servidor normal', icon: <Zap className="h-5 w-5 text-blue-500" /> },
            { text: '3 métodos de pago', icon: <CheckCircle className="h-5 w-5 text-blue-500" /> },
            { text: 'Soporte por WhatsApp', icon: <MessageCircle className="h-5 w-5 text-blue-500" /> },
            { text: 'Estadísticas básicas de visitas y pagos', icon: <BarChart className="h-5 w-5 text-blue-500" /> },
            { text: 'Dominio personalizado', icon: <Globe className="h-5 w-5 text-blue-500" /> },
            { text: 'Sin necesidad de programador', icon: <CheckCircle className="h-5 w-5 text-blue-500" /> },
          ],
          bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
          textColor: 'text-slate-700',
          buttonVariant: 'default',
        },
        {
          name: 'Plan Avanzado',
          price: '$250 USD',
          priceSuffix: '/ mes',
          features: [
            { text: 'Hasta 5 rifas activas', icon: <Award className="h-5 w-5 text-blue-600" /> },
            { text: '2 Plantillas de diseño', icon: <Palette className="h-5 w-5 text-blue-600" /> },
            { text: 'Hasta 5 trabajadores', icon: <Users className="h-5 w-5 text-blue-600" /> },
            { text: 'Servidor rápido', icon: <Rocket className="h-5 w-5 text-blue-600" /> },
            { text: '5 métodos de pago', icon: <CheckCircle className="h-5 w-5 text-blue-600" /> },
            { text: 'Dominio personalizado', icon: <Globe className="h-5 w-5 text-blue-600" /> },
            { text: 'Sin necesidad de programador', icon: <CheckCircle className="h-5 w-5 text-blue-600" /> },
          ],
          bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
          textColor: 'text-white',
          buttonVariant: 'secondary',
          popular: true,
        },
        {
          name: 'Plan Profesional',
          price: '$500 USD',
          priceSuffix: '/ mes',
          features: [
            { text: 'Rifas ilimitadas', icon: <Award className="h-5 w-5 text-blue-500" /> },
            { text: '3 Plantillas de diseño', icon: <Palette className="h-5 w-5 text-blue-500" /> },
            { text: 'Hasta 10 trabajadores', icon: <Users className="h-5 w-5 text-blue-500" /> },
            { text: 'Servidor ultra rápido', icon: <Rocket className="h-5 w-5 text-blue-500" /> },
            { text: '15 métodos de pago', icon: <CheckCircle className="h-5 w-5 text-blue-500" /> },
            { text: 'Soporte por WhatsApp', icon: <MessageCircle className="h-5 w-5 text-blue-500" /> },
            { text: 'Dominio personalizado', icon: <Globe className="h-5 w-5 text-blue-500" /> },
            { text: 'Sin conocimientos técnicos', icon: <CheckCircle className="h-5 w-5 text-blue-500" /> },
          ],
          bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
          textColor: 'text-slate-700',
          buttonVariant: 'default',
        },
      ];
      const [visibleTickets, setVisibleTickets] = useState(60);

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 640) {
            setVisibleTickets(30); // small screen
          } else {
            setVisibleTickets(60); // sm and up
          }
        };

        handleResize(); // check on load
        window.addEventListener('resize', handleResize); // watch window size
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      const domainText = "rifaez.com"
    
      
  
      const intervalRef = useRef(null); // keep track of interval

      const scrollPricing = () => {
        document.getElementById("pricing").scrollIntoView({ behavior: 'smooth' });
      }

      useEffect(() => {
        const startAnimation = () => {
          setDomainAnimateText(""); // reset
          intervalRef.current = setInterval(() => {
            setDomainAnimateText(prev => {
              const nextChar = domainText[prev.length];
              if (prev.length >= domainText.length) {
                domainTimeout()
                return prev;
              }
              return prev + nextChar;
            });
          }, 250);
        };

        const domainTimeout = () => {
          setTimeout(() => {
            clearInterval(intervalRef.current); 
            startAnimation();         // restart
          }, 2000);
        }
    
        startAnimation(); // Start on mount
    
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
      }, []);
      const style = {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '#3b82f6',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96.1%',
        '--secondary-foreground': '222.2 47.4% 11.2%',
        '--muted': '210 40% 96.1%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96.1%',
        '--accent-foreground': '222.2 47.4% 11.2%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '221.2 83.2% 53.3%',
        '--radius': '0.5rem',
        '--background-raffle': 'hsl(224.05 72% 4%)',
        '--primary-raffle': 'hsl(0 100% 50%)',
        '--card-raffle': 'hsl(224 4% 14%)',
        '--color-raffle': 'hsl(220 0% 94%)'
      };

      const statusStyles = {
          pagado: {
            icon: <CheckCircle className="w-5 h-5" />,
            bg: 'bg-green-100',
            text: 'text-green-600',
            badge: 'bg-green-500 hover:bg-green-600',
            buttonText: 'Pendiente'
          },
          pendiente: {
            icon: <Clock className="w-5 h-5" />,
            bg: 'bg-yellow-100',
            text: 'text-yellow-600',
            badge: 'bg-yellow-500 hover:bg-yellow-600',
            buttonText: 'Pagado'
          }
        };
      
        
      
    return (
        <PromotionalLayout>
            <section className="mx-auto mt-12 py-4 max-w-[100vw] sm:px-14 px-6 w-[1300px]">
                <div className="flex items-center flex-col gap-10">
                    <div className="p-4 rounded-lg shadow-md">
                        <Logo className="w-10 h-10"/> 
                    </div>
                    <div className="space-y-6 text-center max-w-[700px]">
                        <h1 className="sm:text-4xl text-2xl">Comparte tus rifas con Rifaez: tú las manejas, nosotros las alojamos.</h1>
                        <p className="sm:text-base text-sm">Con Rifaez crea, administra y controla todas tus rifas en páginas personalizadas alojadas por nosotros.</p>
                    </div>
                    <button onClick={()=>{navigate("/register")}} className="rounded-full px-5 py-2 shadow-md shadow-primary">Comienza Hoy</button>
                </div>
            </section>
            <section className="w-[700px] relative max-w-[100vw] sm:px-14 px-6 mt-12 mb-12 mx-auto">
                <div className="rounded-lg border border-gray-900 bg-white shadow-sm bg-white max-w-full">
                    <div className="space-y-1.5 py-3 px-5 border-b border-gray-900">
                    <div className="  flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                        <div className="relative flex-grow w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <div className="pl-10 w-full h-10 sm:h-11 bg-transparent flex h-10 w-full rounded-md border border-gray-900 px-3 py-2 text-sm">
                        
                        </div>
                        </div>
                        <Button 
                        onClick={null} 
                        variant="outline" 
                        className="w-full sm:w-auto border-gray-900 text-gray-900  h-10 sm:h-11 text-sm"
                        >
                        <Shuffle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Elegir al Azar
                        </Button>
                    </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                        {Array.from({ length: visibleTickets }, (_, i) => i + 1).map((ticket) => (
                            <div key={ticket} className="bg-white text-gray-900 border-gray-900 cursor-pointer p-2 border rounded-md text-center font-medium transform text-xs sm:text-sm">
                                {ticket}
                            </div>
                            
                        ))}
                        </div>
                    </div>
                </div>  
                <div>
                
                    
                </div>
            </section>
            <section className="mx-auto py-20 max-w-[100vw] w-[1400px] sm:px-14 px-8">
                  <div className="flex flex-col items-center max-w-full gap-16">
                  <h1 className="text-3xl text-center max-w-[550px]">Nuestra rifa en línea súper sencilla es tu boleto ganador.</h1>
                  <div className="w-full flex flex-col items-center gap-8 md:flex-row justify-evenly text-gray-600">
                    <div className="flex flex-col gap-5 items-center text-center max-w-[250px]">
                      <PanelsTopLeft className="w-12 h-12" />
                      <p><b>Administra</b> todas tus rifas desde un solo panel: crea, edita y elimina con facilidad.</p>
                    </div>  
                    <div className="flex flex-col items-center gap-5 max-w-[250px] text-center">
                      <ChartBar className="w-12 h-12" />
                      <p>Obtén un <b>análisis detallado</b> del rendimiento de tus rifas y el comportamiento de los participantes.</p>
                    </div>  
                    <div className="flex flex-col items-center gap-5 max-w-[250px] text-center">
                      <Server className="w-12 h-12" />
                      <p><b>Publica</b> tus rifas fácilmente en nuestra plataforma con alojamiento incluido y disponibilidad inmediata.</p>
                    </div>  
                  </div>
                  </div>
            </section>
            <section className="mx-auto py-20 max-w-[100vw] sm:px-14 px-8 w-[700px] customLg:w-[1400px]">
                <div className="flex flex-col customLg:flex-row h-full max-w-full justify-between customLg:items-center gap-10">
                    <div className="w-[500px] max-w-full">
                        <div className="flex items-center mb-10 justify-center w-24 h-24 shadow-lg rounded-full">
                                <User className="w-12 h-12 text-primary"/>
                        </div>
                    
                        <div className="max-w-[500px]">
                            <h1 className="max-w-[420px] sm:text-3xl text-2xl mb-6 sm:leading-[42px] leading-[35px] ">Gestiona a tus participantes con facilidad.</h1>
                            <p className="mb-8">Lleva un control completo de cada participante en tu rifa: visualiza registros, verifica pagos, asigna boletos y gestiona ganadores desde un solo lugar.</p>
                            <button className="py-1.5 px-4 rounded-full bg-primary sm:text-base text-sm text-white " onClick={()=>{navigate("/register")}}>Registrate</button>
                        </div>
                     
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                        <div className="w-full flex items-start sm:items-center justify-between p-3 text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow cursor-pointer min-w-0">
                            <div className="flex-shrink-0">
                              <div className='w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600'>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                <span className="text-primary">#002</span> - Carlos
                              </p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date("12-05-25").toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><TicketIcon className="w-3 h-3" /> {3} Boleto{3 !== 1 && 's'}</span>
                                <span className={`flex items-center gap-1 font-medium ${1 > 0 ? 'text-green-600' : ''}`}><CheckCircle className="w-3 h-3" /> {1} Pagado{1 !== 1 && 's'}</span>
                                <span className={`flex items-center gap-1 font-medium ${2 > 0 ? 'text-yellow-600' : ''}`}><Clock className="w-3 h-3" /> {2} Pendiente{2 !== 1 && 's'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Info className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ChevronDown
                                className='w-5 h-5 text-muted-foreground transition-transform'
                              />
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 border-t">
                                  <div className="flex justify-end mb-2">
                                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Marcar Todos Como Pagados
                                    </Button>
                                  </div>
                                <div className="space-y-2">
                                  {tickets.map((ticket) => {
                                    const currentStatus = statusStyles[ticket.status] || statusStyles.pendiente;
                                    return (
                                   <motion.div
                                      layout
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between p-2.5 bg-card rounded-md shadow-sm"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
                                          {currentStatus.icon}
                                        </div>
                                        <div>
                                          <p className="font-bold text-foreground">Boleto #{ticket.number}</p>
                                          <Badge variant={ticket.status === 'pagado' ? 'default' : 'secondary'} className={`${currentStatus.badge} capitalize`}>
                                            {ticket.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button variant="outline" className="text-xs xxs:text-sm" size="sm">
                                          Marcar {currentStatus.buttonText}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
                                          <Edit className="w-4 h-4" />
                                          {ticket.notes && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </motion.div>
                                    )
                                  })}
                                </div>
                              </div>
                            </motion.div>
                        </AnimatePresence>
                      </div>
              </div>
            </section> 
            <section className="mx-auto py-20 max-w-[100vw] sm:px-14 px-8 w-[700px] customLg:w-[1400px]">
                <div className="flex flex-col customLg:flex-row h-full max-w-full justify-between customLg:items-center gap-10">
                    <div className="grow flex flex-col justify-center items-center gap-5">
                    <div className="flex items-center justify-center w-20 h-20 shadow-lg rounded-full">
                                <Grid3X3 className="w-10 h-10 text-primary"/>
                        </div>
                        <h1 className="text-3xl">Plantilla</h1>
                        <p className="max-w-[400px] text-center">Ve la plantilla única que ofrece Rifaez para potenciar tus rifas al máximo.</p>
                    </div>
                    <div className="grow flex flex-col gap-8">
                      <Link to="/raffle/template_popular">
                        <div className="bg-white flex items-center justify-between shadow-lg hover:shadow-primary hover:text-primary w-full px-6 py-4 text-lg rounded-lg">
                          <span>Ejemplo</span>
                          <ChevronRight className="w-6 h-6"/>
                        </div>
                      </Link>
                    </div>
              </div>
            </section>  
            <section className="mx-auto py-20 max-w-[100vw] sm:px-14 px-8 w-[700px] customLg:w-[1400px]">
                <div className="flex flex-col customLg:flex-row-reverse h-full max-w-full justify-between customLg:items-center gap-10">
                    <div className="w-[500px] max-w-full">
                        <div className="flex items-center mb-10 justify-center w-24 h-24 shadow-lg rounded-full">
                                <Ticket className="w-12 h-12 text-primary"/>
                        </div>
                    
                        <div className="max-w-[500px]">
                            <h1 className="max-w-[420px] sm:text-3xl text-2xl mb-6 sm:leading-[42px] leading-[35px] ">Administra todos tus datos desde el panel administrativo de Rifaez.</h1>
                            <p className="mb-8">Usa el panel administrativo para crear, editar y borrar rifas, puedes manejar todos los pagos y tienes estadisticas para analizar tu rifa.</p>
                            <button className="py-1.5 px-4 rounded-full bg-primary sm:text-base text-sm text-white " onClick={scrollPricing}>Ver Planes</button>
                        </div>
                        <div className="flex justify-evenly">
                            
                        </div>
                    </div>
                      <div className="border max-w-full w-[640px] h-[320px] flex justify-center items-center p-5 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                      <Line className="" options={chartOptions} data={chartData} />
                      </div>
                </div>
            </section>  
            <section className="bg-white border-t border-b border-gray-200">
                    <div className="mx-auto py-20 max-w-[100vw] sm:px-14 px-6 w-[1300px] ">
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col gap-3 items-center mb-6">
                            <h1 className="sm:text-3xl text-2xl">Conecta tu dominio</h1>
                            <p className="text-gray-700">Rapido y Facil</p>
                          </div>
                          <div className="shadow-lg max-w-full flex gap-3 items-center border border-gray-100 rounded-xl bg-white p-4 mb-8">
                            <div className="h-[32px] w-[48px] flex items-center justify-center">
                              <Router className="text-primary h-[30px] w-[30px]"/>

                            </div>
                              <div className="w-[320px] text-base text-gray-800 rounded-xl bg-[#F2F3FA] py-2 px-4 h-[45px]">
                                {domainAnimateText}
                              </div>
                          </div>
                          <div className="bg-primary text-white text-sm rounded-xl px-5 py-2 relative">
                            Conectar
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-[70%] top-[50%]" width="89" height="86" viewBox="0 0 89 86" fill="none">
                              <g filter="url(#filter0_d_45_299)">
                                <circle cx="19" cy="15" r="15" fill="#F4F4F4"/>
                              </g>
                              <g filter="url(#filter1_d_45_299)">
                                <path d="M23.7605 17.4388C22.2167 16.8481 20.6634 18.2788 21.1255 19.8658L37.2572 75.2748C37.8196 77.2064 40.5611 77.1922 41.1034 75.2548L48.4668 48.9517C48.6827 48.1804 49.338 47.6123 50.1321 47.5079L81.1704 43.429C83.2282 43.1585 83.5629 40.3197 81.6245 39.5781L23.7605 17.4388Z" fill="white"/>
                                <path d="M23.7605 17.4388C22.2167 16.8481 20.6634 18.2788 21.1255 19.8658L37.2572 75.2748C37.8196 77.2064 40.5611 77.1922 41.1034 75.2548L48.4668 48.9517C48.6827 48.1804 49.338 47.6123 50.1321 47.5079L81.1704 43.429C83.2282 43.1585 83.5629 40.3197 81.6245 39.5781L23.7605 17.4388Z" stroke="#E0E0E0"/>
                              </g>
                              <defs>
                                <filter id="filter0_d_45_299" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                  <feOffset dy="4"/>
                                  <feGaussianBlur stdDeviation="2"/>
                                  <feComposite in2="hardAlpha" operator="out"/>
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_45_299"/>
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_45_299" result="shape"/>
                                </filter>
                                <filter id="filter1_d_45_299" x="16.5419" y="16.8019" width="70.8688" height="68.4138" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                  <feOffset dy="4"/>
                                  <feGaussianBlur stdDeviation="2"/>
                                  <feComposite in2="hardAlpha" operator="out"/>
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_45_299"/>
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_45_299" result="shape"/>
                                </filter>
                              </defs>
                            </svg>
                          </div>
                        </div>
                    </div>
            </section>  
            <section className="mx-auto my-20 max-w-[100vw] sm:px-14 px-6 w-[1400px] min-h-[500px]">
            <div className="space-y-6">
            <h2 className="text-2xl text-center md:text-4xl font-medium text-gray-800 mb-12">
                Planes de Suscripción
            </h2>
          
              <div id="pricing" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, boxShadow: "0px 20px 30px -10px rgba(59, 130, 246, 0.3)" }}
                    className="relative"
                  >
                    {plan.popular && (
                      <div className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-xs shadow-md transform rotate-2">
                        ¡MÁS POPULAR!
                      </div>
                    )}
                    <Card className={`flex flex-col h-full shadow-xl rounded-xl overflow-hidden ${plan.bgColor} ${plan.textColor} border-2 ${plan.popular ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-40' : 'border-gray-200'}`}>
                      <CardHeader className="p-6 md:p-8">
                        <CardTitle className={`text-2xl md:text-3xl font-bold mb-1.5 md:mb-2 ${plan.popular ? 'text-white' : 'text-blue-600'}`}>{plan.name}</CardTitle>
                        <CardDescription className={`text-md md:text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span className="text-3xl md:text-4xl font-extrabold">{plan.price}</span>
                          <span className="text-xs md:text-sm opacity-90">{plan.priceSuffix}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 md:p-8 flex-grow">
                        <ul className="space-y-3 md:space-y-3.5">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              {React.cloneElement(feature.icon, { className: `h-5 w-5 md:h-6 md:w-6 mr-2.5 md:mr-3 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-blue-500'}` })}
                              <span className="flex-1 text-sm md:text-base">{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="p-6 md:p-8 mt-auto bg-opacity-50">
                        <Button 
                          onClick={() => navigate("/login")}
                          variant={plan.buttonVariant} 
                          className={`w-full text-md md:text-lg py-3 md:py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${plan.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          Suscribirse
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            </section>
            
        </PromotionalLayout>
    )
}