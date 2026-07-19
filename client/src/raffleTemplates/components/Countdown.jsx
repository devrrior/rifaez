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
        <section className="flex justify-center rounded-xl py-2 max-w-full ">
            <div className="w-[1100px] max-w-full py-6 px-2 sm:px-4 text-colorRaffle">
                <div className="w-full flex">
                    <div className="flex flex-col-reverse sm:gap-5 items-center relative">
                        <div className="text-colorRaffle-600 text-xs sm:text-xl">Dias</div>
                        <div className=" h-[60px] w-[60px] rounded-lg flex items-center justify-center text-2xl font-semibold sm:text-4xl">{timeLeft.days}</div>
                        
                    </div>
                    <div className="flex flex-col-reverse sm:gap-5 items-center">
                        <div className="text-colorRaffle-600 text-xs sm:text-xl">Horas</div>
                        <div className=" h-[60px] w-[60px] rounded-lg flex items-center justify-center text-2xl font-semibold sm:text-4xl">{timeLeft.hours}</div>
                    </div>
                    <div className="flex flex-col-reverse sm:gap-5 items-center">
                        <div className="text-colorRaffle-600 text-xs sm:text-xl">Minutos</div>
                        <div className=" h-[60px] w-[60px] rounded-lg flex items-center justify-center text-2xl font-semibold sm:text-4xl">{timeLeft.minutes}</div>
                    </div>
                    <div className="flex flex-col-reverse sm:gap-5 items-center">
                        <div className="text-colorRaffle-600 text-xs sm:text-xl">Segundos</div>
                        <div className=" h-[60px] w-[60px] rounded-lg flex items-center justify-center text-2xl font-semibold sm:text-4xl">{timeLeft.seconds}</div>
                    </div>
                </div>
            </div>
        </section>
    )

}