import { useEffect, useState } from 'react';

export default function Countdown({targetDate}){

    const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearInterval(timer);
      }, [targetDate]);

    return  (
                <div className="w-full flex justify-center gap-[10px] text-headerRaffle-foreground">
                    <div className="flex border-box w-[50px] h-[50px] p-[8px] flex-col-reverse items-center relative">
                        <div className="text-[9px] md:text-[12px]">Dias</div>
                        <div className="rounded-lg flex items-center justify-center text-[16px] md:text-[20px] font-semibold">{timeLeft.days}</div>
                        
                    </div>
                    <div className="flex border-box w-[50px] h-[50px] p-[8px] flex-col-reverse items-center">
                        <div className="text-[9px] md:text-[12px]">Horas</div>
                        <div className="rounded-lg flex items-center justify-center text-[16px] md:text-[20px] font-semibold">{timeLeft.hours}</div>
                    </div>
                    <div className="flex border-box w-[50px] h-[50px] p-[8px] flex-col-reverse items-center">
                        <div className="text-[9px] md:text-[12px]">Minutos</div>
                        <div className="rounded-lg flex items-center justify-center text-[16px] md:text-[20px] font-semibold">{timeLeft.minutes}</div>
                    </div>
                    <div className="flex border-box w-[50px] h-[50px] p-[8px] flex-col-reverse items-center">
                        <div className="text-[9px] md:text-[12px]">Segundos</div>
                        <div className="rounded-lg flex items-center justify-center text-[16px] md:text-[20px] font-semibold">{timeLeft.seconds}</div>
                    </div>
                </div>
    )

}