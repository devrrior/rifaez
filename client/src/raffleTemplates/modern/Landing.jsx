
import { Route, Routes } from "react-router-dom";
import HomeRaffle from "./pages/HomePage";
import ContactRaffle from "./pages/ContactPage";
import PaymentRaffle from "./pages/PaymentPage";
import TicketVerificationRaffle from "./pages/AvailableTicketsPage";
import TicketRaffle from "./pages/TicketsPage";
import Layout from "./Layout"
import RaffleNotFound from "../RaffleNotFound"
import { useEffect, useState } from "react";

function Landing({raffle, test}) {
  const [availableTickets, setAvailableTickets] = useState(raffle.availableTickets || [])

  return (
    <>
       <Routes>
        <Route path="/" element={<Layout raffle={raffle} />}>
          <Route index  element={<TicketVerificationRaffle availableTickets={availableTickets} setAvailableTickets={setAvailableTickets} test={test}/>} />
          <Route path="contacto"  element={<ContactRaffle />} />
          <Route path="verificar"  element={<TicketRaffle test={test} />} />
          <Route path="pago"  element={<PaymentRaffle  />} />
          <Route path="*" element={<RaffleNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default Landing;