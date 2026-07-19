import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import { Ticket, Search, Shuffle } from 'lucide-react';
import { cn } from '../lib/utils';
import { VirtuosoGrid } from 'react-virtuoso';

const TicketItem = ({ ticket, onClick, isSelected}) => {
  const ticketClasses = cn(
    "p-2 border rounded-md text-center font-medium transition-all duration-200 transform text-xs sm:text-sm",
    {
      "bg-lightTint border-borderRaffle text-colorRaffle-600 line-through cursor-not-allowed": ticket.status === 'purchased',
      "bg-primaryRaffle border-0 text-primaryRaffle-foreground shadow-md scale-105": ticket.status === 'available' && isSelected,
      "bg-backgroundRaffle text-primaryRaffle border-primaryRaffle hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground cursor-pointer": ticket.status === 'available' && !isSelected,
    }
  );

  return (
    <div className='p-0.5'>
      <motion.div
        onClick={ticket.status === 'available' ? () => onClick(ticket) : undefined}
        className={ticketClasses}
        whileHover={ticket.status === 'available' ? { scale: 1.1 } : {}}
        whileTap={ticket.status === 'available' ? { scale: 0.95 } : {}}
        layout
      >
        {ticket.number}
      </motion.div>
    </div>
  );
};




const TicketSelection = ({ tickets, selectedTickets, onTicketClick, searchTerm, onSearchTermChange, onSelectRandomTicket }) => {
  return (
    <section className="px-2">
      <h2 className="text-2xl sm:text-3xl font-semibold text-primaryRaffle mb-6 text-center flex items-center justify-center">
        <Ticket className="h-7 w-7 sm:h-8 sm:w-8 mr-3" />
        Selecciona tus Boletos
      </h2>
     <Card className="shadow-xl bg-backgroundRaffle">
        <CardHeader className="border-b border-borderRaffle pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar boleto (ej: 007)"
                className="pl-10 w-full h-10 sm:h-11 text-sm bg-transparent"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
              />
            </div>
            <Button 
              onClick={onSelectRandomTicket} 
              variant="outline" 
              className="w-full sm:w-auto border-primaryRaffle text-primaryRaffle hover:bg-primaryRaffle hover:text-primaryRaffle-foreground h-10 sm:h-11 text-sm"
            >
              <Shuffle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Elegir al Azar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {tickets.length > 0 ? (
              <VirtuosoGrid
              totalCount={tickets.length}
              itemContent={(index) => (
                <TicketItem 
                  key={tickets[index].id}
                  ticket={tickets[index]}
                  onClick={onTicketClick}
                  isSelected={selectedTickets.some(st => st.id === tickets[index].id)}
                />
              )}
              listClassName="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-0.5 sm:gap-1"
              style={{ height: 500 }}
            />
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
              No se encontraron boletos con el número "{searchTerm}". Intenta con otro número o revisa los disponibles.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default TicketSelection;
