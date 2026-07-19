import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, // same as fetch's credentials: 'include'
});
export default function Notifications({setSelectedRaffle}){
    const { user, setUser, setAppError } = useAuth()
    const [notifications, setNotifications] = useState([]);
    const [contactMessage, setContactMessage] = useState({})



    useEffect(() => {
      async function viewNotifications(params) {
        try {
        if (user?.raffles) {
          const all = [];
          for (const raffle of user.raffles) {
            if (raffle.notifications && raffle.notifications.length > 0) {
              const modifiedNotifications = raffle.notifications.filter(n => !n.read).map(n => ({...n, fromId: raffle.id, fromName: raffle.title }));
              setUser(prev => ({...prev, raffles: prev.raffles.map(raffle => ({...raffle, notifications: raffle.notifications.map(notify => ({...notify, read: true}))}))}))
              all.push(...modifiedNotifications);
            }
          }
          setNotifications(all);
          for (const raffle of user.raffles) {
            if (raffle.notifications && raffle.notifications.length > 0) {
              for (const notification of raffle.notifications) {
                  await api.post(`/api/raffle/${raffle.id}/${notification.id}/view_notify`);
              }
            }
          }
        }
        } catch (error) {
            setAppError(error)
        }
      }
    viewNotifications()
    }, []);

    const openContactModal = (contact) => {
        setContactMessage(contact)
        document.getElementById("contact-message").showModal();
    }

    const calcTimeAgo = (notifyDate) => {
      const getToday = new Date();
      const notificationDate = new Date(notifyDate);
      const diffInMs = getToday - notificationDate;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
  
      if (diffInDays > 0) {
          return `Hace ${diffInDays} días`;
      } else if (diffInHours > 0) {
          return `Hace ${diffInHours} horas`;
      } else if (diffInMinutes > 0) {
          return `Hace ${diffInMinutes} minutos`;
      } else if (diffInSeconds > 0) {
          return `Hace ${diffInSeconds} segundos`;
      } else {
          return "Justo ahora";
      }
  };

    return (
        <div className="space-y-10 px-8">
        <h1 className="text-2xl text-center">Notificaciones</h1>
        <div className="max-w-[700px] mx-auto flex flex-col gap-5 items-center">
        <dialog id="contact-message" className="bg-transparent focus-visible:outline-none focus-visible:ring-0">
            <div className="p-6 rounded-lg shadow-lg w-[300px] max-w-[calc(100vw-24px)] bg-card text-card-foreground space-y-4">
                <header className="text-xl font-medium">
                    Contacto
                </header>
                <div className="space-y-2">
                    <span>Nombre</span>
                    <p>{contactMessage.name}</p>
                </div>
                <div className="space-y-2">
                    <span>Correo</span>
                    <p>{contactMessage.email}</p>
                </div>
                <div className="space-y-2">
                    <span>Mensaje</span>
                    <p>{contactMessage.message}</p>
                </div>
                <div className="space-y-2">
                    <span>Fecha</span>
                    <p>{contactMessage.date}</p>
                </div>
                <footer>
                <Button
                        variant="outline"
                        className="focus-visible:outline-none focus-visible:ring-0"
                        onClick={()=>{document.getElementById("contact-message").close()}}
                      >Cancelar</Button>
                </footer>
            </div>
        </dialog>
            {notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`rounded-lg w-full overflow-hidden ${
                    notification.category === "pending"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-muted/50 border border-gray-200"
                  }`}
                  onClick={notification.category === "contact" ? ()=>{openContactModal(notification.contact)} : null}
                >
                    <div className="flex items-center justify-between p-4">
                        <span className="text-base">{notification.fromName}</span>
                        <span className="text-base">{notification.fromId}</span>
                    </div>

                  <div className="flex items-center justify-between p-4 bg-background ">
                    <span className="text-base">
                      {notification.message}
                      {notification.category === "pending" && (
                        <span className="ml-2 text-yellow-600">
                          (Pendiente - {notification.amount})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{calcTimeAgo(notification.time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No tienes ninguna notificación.</div>
            )}
        </div>
        </div>
    )
}