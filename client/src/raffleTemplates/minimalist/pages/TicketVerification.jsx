
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOutletContext, useParams } from "react-router-dom";
import { Search, TriangleAlert, CheckCircle2Icon } from "lucide-react";
import TriDown from "../../components/TriDown";
import DefaultLogo from "../../components/ui/default-logo";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const TicketVerification = ({test}) => {
  const { id } = useParams();
  const [ticketNumber, setTicketNumber] = useState("");
  const [verifyType, setVerifyType] = useState("verify")
  const [verificationResponse, setVerificationResponse] = useState({
    type: null
  })
  const [generationResponse, setGenerationResponse] = useState({
    type: null
  })
  const raffle = useOutletContext();
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

  const handleVerification = async (e) => {
    e.preventDefault();
    if(test){
      return
    }
    const res = await api.post(`/api/raffle/${id}/verify`, { query: ticketNumber })
    console.log(res)
    if(res.data.status === 200){
      console.log(res.data.ticket)
      if(verifyType === "verify"){
        setVerificationResponse({type: 'success', ticket: res.data.ticket})
        setGenerationResponse({
          type: null
        })
      } else if (verifyType === "generate"){
        setGenerationResponse({type: 'success', ticket: res.data.ticket})
        setVerificationResponse({
          type: null
        })
      }
    } else {
        setVerificationResponse({type: 'unsuccessful'})
    }
  };

  return (
    <div className="max-w-screen py-8 mb-10">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          {raffle.logo?.url ?
                <div className={`h-36 ${raffle.logo_type === "on" && "border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} mb-6`}>
                <img alt="logo" className="h-36 object-cover mx-auto" src={raffle.logo.url}  />
            </div>
                : <DefaultLogo className="rounded-full w-32 h-32 mx-auto"/> }
          <h1 className="md:text-3xl text-xl font-semibold py-2 text-headerRaffle-foreground w-full bg-headerRaffle">
            VERIFICADOR DE BOLETOS
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-full w-[1000px] mx-auto flex flex-col items-center px-2"
        >
          
          <p className="text-colorRaffle gap-4 flex flex-col md:flex-row text-lg items-center font-semibold md:text-2xl text-center mb-8"> 
                <TriDown fill={raffle.colorPalette.accent} className="w-[30px] lg:w-[30px]" />
                <span>Introduce tu Número de Boleto o Celular y haz click en "Verificar"</span>
          </p>
          {generationResponse.ticket &&
              <div className="w-[350px] max-w-full relative px-12 py-1 bg-primaryRaffle mb-12">
                <aside className="absolute text-2xl text-primaryRaffle-foreground w-max -rotate-90 left-[24px] top-1/2 -translate-x-1/2 -translate-y-1/2">{raffle.title}</aside>
                  <div className="bg-backgroundRaffle font-medium mb-1">
                    <header className="flex items-center gap-2 justify-center py-4">
                      {raffle.logo?.url ?
                        <div className={`h-16 ${raffle.logo_type === "on" && "border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"}`}>
                          <img alt="logo" className="h-16 object-cover mx-auto" src={raffle.logo.url}  />
                      </div>
                          : <DefaultLogo className="rounded-full w-12 h-12 mx-auto"/> }
                        <span className="text-xl">{raffle.business_name}</span>
                    </header>
                    <div className="border-t-2 flex px-3 py-4 border-b-2 border-borderRaffle border-dashed">
                        <p>Boleto(s):</p>
                        <ul className="grow flex justify-center gap-4 flex-wrap">
                            {generationResponse.ticket.tickets.map(ticket => (
                              <span>{ticket}</span>
                            ))}
                        </ul>
                    </div>
                    <div className="px-3 flex gap-4 py-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>SORTEO:</div>
                          <div className="text-primaryRaffle uppercase">{raffle.title}</div>
                          <div>NOMBRE:</div>
                          <div className="text-primaryRaffle uppercase">{generationResponse.ticket.first_name}</div>
                          <div>APELLIDO:</div>
                          <div className="text-primaryRaffle uppercase">{generationResponse.ticket.last_name}</div>
                          <div>ESTADO:</div>
                          <div className="text-primaryRaffle uppercase">{generationResponse.ticket.state}</div>
                          <div>PAGADO:</div>
                          <div className="text-primaryRaffle uppercase">{generationResponse.ticket.status === "pending" ? "No pagado" : "Si pagado"}</div>
                          <div>COMPRA:</div>
                          <div className="text-primaryRaffle uppercase">{generationResponse.ticket.amount + "$"}</div>
                          </div>
                    </div>
                    
                  </div>
                  <div className="bg-backgroundRaffle mb-1">
                    <img className="max-h-[150px] object-cover" src={raffle.images[0].url} alt="" />
                  </div>
                  <div className="bg-backgroundRaffle text-center font-semibold">
                    <span className="text-primaryRaffle">¡MUCHA SUERTE!</span>
                  </div>
                <aside className="absolute w-max text-2xl text-primaryRaffle-foreground rotate-90 right-[24px] top-1/2 translate-x-1/2 -translate-y-1/2">{raffle.title}</aside>
              </div>
          }
          <form onSubmit={handleVerification} className="flex flex-col items-center w-[400px] max-w-full mb-10">
            <div className="relative w-full mb-4">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full bg-transparent px-4 py-2 rounded text-colorRaffle border-2 border-borderRaffle text-lg"
                placeholder="Escribe Boleto, Folio ó Celular"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={verifyType}
              className="border-2 border-borderRaffle mb-6 rounded-sm bg-transparent w-full max-w-full px-2 py-2"
              onChange={(e)=>{setVerifyType(e.target.value)}}
            >
              <option value="verify">Verificar</option>
              <option value="generate">Generar</option>
            </select>
            
            <button 
              type="submit" 
              className="max-w-full rounded-lg font-medium border-2 border-borderRaffle bg-primaryRaffle text-primaryRaffle-foreground hover:bg-primaryRaffle-400 text-lg px-5 py-2"
            >
              {verifyType === "verify" ? "Verificar" : "Generar"}
            </button>
          </form>
          {verificationResponse.type === "success" &&
            <div className="fixed w-[500px] max-w-[calc(100vw-24px)]  text-center left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-backgroundRaffle px-10 py-8 rounded-lg border border-lightTint shadow-lg">
            <div className="flex flex-col items-center">
              <CheckCircle2Icon className="text-primaryRaffle h-20 w-20 mb-6"/>
              <h1 className="text-primaryRaffle text-xl mb-5">¡Verificación Exitosa!</h1>
              <p className="mb-2">{verificationResponse.ticket?.name}</p>
              <p className="text-colorRaffle mb-6">La verificación de tus boletos se ha realizado con éxito. ¡Gracias por participar!</p>
              <button onClick={()=>{setVerificationResponse(prev => ({...prev, type: undefined}))}} className="bg-primaryRaffle rounded-sm text-primaryRaffle-foreground px-4 py-2">Ver Boleto</button>
            </div>
            </div>
          }

        {generationResponse.type === "success" &&
            <div className="fixed w-[500px] max-w-[calc(100vw-24px)]  text-center left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-backgroundRaffle px-10 py-8 rounded-lg border border-lightTint shadow-lg">
            <div className="flex flex-col items-center">
              <CheckCircle2Icon className="text-primaryRaffle h-20 w-20 mb-6"/>
              <h1 className="text-primaryRaffle text-xl mb-5">¡Boleto Generado!</h1>
              <p className="mb-2">{verificationResponse.ticket?.name}</p>
              <p className="text-colorRaffle mb-6">Tu boleto se ha generado con éxito.¡Gracias por participar!</p>
              <button onClick={()=>{setGenerationResponse(prev => ({...prev, type: undefined}))}} className="bg-primaryRaffle rounded-sm text-primaryRaffle-foreground px-4 py-2">Ver Boleto</button>
            </div>
            </div>
          }

          
          {verificationResponse.type === "unsuccessful" &&
          <div className="fixed w-[500px] max-w-[calc(100vw-24px)] text-center left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-backgroundRaffle px-10 py-8 rounded-lg border border-lightTint shadow-lg">
            <div className="flex flex-col items-center">
              <TriangleAlert className="text-primaryRaffle h-20 w-20 mb-6"/>
              <h1 className="text-colorRaffle text-xl mb-3">¡No hay datos!</h1>
              <p className="text-colorRaffle mb-6">El boleto verificado aún no ha sido vendido..</p>
              <button onClick={()=>{setVerificationResponse(prev => ({...prev, type: undefined}))}} className="bg-primaryRaffle rounded-sm text-primaryRaffle-foreground px-4 py-2">Entendido</button>
            </div>
            </div>
          }

          {verificationResponse.ticket &&
            <div className="max-w-[100vw] px-2 overflow-x-scroll">
              <div className="grid w-max grid-cols-5 border border-borderRaffle">
                <div className="bg-headerRaffle text-headerRaffle-foreground p-3 text-center">
                  Número
                </div>
                <div className="bg-headerRaffle text-headerRaffle-foreground p-3 text-center">
                  Nombre
                </div>
                <div className="bg-headerRaffle text-headerRaffle-foreground p-3 text-center">
                  Apellido
                </div>
                <div className="bg-headerRaffle text-headerRaffle-foreground p-3 text-center">
                  Estado
                </div>
                <div className="bg-headerRaffle text-headerRaffle-foreground p-3 text-center"> 
                  Pagado
                </div>
                <div className="p-3 text-center">
                {verificationResponse.ticket?.tickets?.map(ticket => (
                    <span key={ticket}>{ticket},</span>
                  ))}
                </div>
                <div className="p-3 text-center">
                  {verificationResponse.ticket?.first_name}
                </div>
                <div className="p-3 text-center">
                  {verificationResponse.ticket?.last_name}
                </div>
                <div className="p-3 text-center">
                {verificationResponse.ticket?.state}
                </div>
                <div className="p-3 text-center"> 
                  {verificationResponse.ticket?.status === "pending" ? "No" : "Si"}
                </div>
              </div>
            </div>
          }


        </motion.div>

      </div>
    </div>
  );
};

export default TicketVerification;
