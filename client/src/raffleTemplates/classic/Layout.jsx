import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import WhatsWidget from "../components/WhatsWidget";
import VerifiedFooter from "../components/Verified";
import "../noRadius.css";
function Layout({raffle}) {
    
  return (
    <div className={`${raffle.border_corner === "square" && "no-radius"} flex flex-col min-h-screen bg-backgroundRaffle text-colorRaffle font-fontRaffle`}>
    <Navbar raffle={raffle} />
    <div className="pt-16">
      <Outlet context={raffle} />
    </div>
    <div className='fixed bottom-0 right-0'>
        <WhatsWidget number={raffle.phone}/>
    </div>
    <Footer raffle={raffle} />
    <div className='w-screen sticky bottom-0 right-0'>
        <WhatsWidget number={raffle.phone}/>
        {raffle.verified &&
          <VerifiedFooter />
        }
    </div>
    </div>
  );
}

export default Layout;