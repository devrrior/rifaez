import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2 } from 'lucide-react';

const SelectedTicketsSummary = ({ selectedTickets, totalPrice, onRemoveTicket, onSiguienteClick, buyerPopUp, onApartarClick, selectState, buyerInfo, showSearch, setShowSearch, filteredStates, handleChange, errors, ticketPrice }) => {
  const setPhoneFormat = (phone) => {
    if(phone) {
      const digits = phone?.replace(/\D/g, ''); 

      const parts = [];

      if (digits.length > 0) {
        parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
      }
      if (digits.length >= 4) {
        parts[0] += ') ';
        parts.push(digits.substring(3, Math.min(6, digits.length)));
      }
      if (digits.length >= 7) {
        parts.push('-' + digits.substring(6, 10));
      }

      return parts.join('');
    }
    return phone
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky bottom-0 z-40 p-0 -mx-4 sm:mx-0 mt-8"
    >
      <Card className="shadow-2xl border-t-4 border-primaryRaffle rounded-t-lg sm:rounded-lg bg-backgroundRaffle">
        {buyerPopUp ? (
          <>
          <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl text-primaryRaffle flex items-center">
                <ShoppingCart className="inline mr-2 h-5 w-5 sm:h-6 sm:w-6" />Informacion del comprador
              </CardTitle>
              <span className="text-md sm:text-lg font-bold text-colorRaffle">Total: ${totalPrice.toFixed(2)}</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-3 min-h-48 sm:min-h-60 space-y-4">
            <div className='space-y-1'>
                <label htmlFor="name" className={`block text-sm font-medium ${errors.name ? "text-red-500" : "text-colorRaffle"} mb-1`}>Nombre Completo</label>
                <input type="text" name="name" placeholder='Nombre' value={buyerInfo.name} onChange={handleChange} id="name" className={`bg-transparent w-full px-3 py-2 border ${errors.name ? "border-red-400" : "border-lightTint"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`} />
              </div>
              <div className='space-y-1'>
                <label htmlFor="phone" className={`block text-sm font-medium ${errors.phone ? "text-red-500" : "text-colorRaffle"} mb-1`}>Numero de telefono</label>
                <input type="tel" id="phone" name="phone" placeholder='Telefono' value={setPhoneFormat(buyerInfo.phone)} onChange={handleChange}  className={`bg-transparent w-full px-3 py-2 border ${errors.phone ? "border-red-400" : "border-lightTint"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`} />
              </div>
              <div className='relative space-y-1'>
                <label htmlFor="state" className={`block text-sm font-medium ${errors.state ? "text-red-500" : "text-colorRaffle"} mb-1`}>Estado</label>
                <input id="state" rows="4" name="state" value={buyerInfo.state} placeholder='Estado' onChange={handleChange} className={`bg-transparent w-full px-3 py-2 border ${errors.state ? "border-red-400" : "border-lightTint"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`}/>
                {showSearch &&
                <div className='absolute top-[calc(100%+10px)] left-0 max-w-full w-[300px] max-h-[100px] overflow-scroll bg-backgroundRaffle rounded-lg border-2 border-lightTint'>
                  {filteredStates.map(state => (
                    <div key={state} onClick={selectState} className='cursor-pointer px-4 py-2 hover:bg-lightTint'>{state}</div>
                  ))}
                </div>
                }
              </div>
          </CardContent>
          </>
        ):(
            <>
          <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl text-primaryRaffle flex items-center">
                <ShoppingCart className="inline mr-2 h-5 w-5 sm:h-6 sm:w-6" />Boletos Seleccionados
              </CardTitle>
              <span className="text-md sm:text-lg font-bold text-colorRaffle">Total: ${totalPrice.toFixed(2)}</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-3 max-h-48 sm:max-h-60 overflow-y-auto">
            {selectedTickets.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">No has seleccionado ningún boleto.</p>
            ) : (
              <ul className="space-y-2">
                {selectedTickets.map(ticket => (
                  <li key={ticket.id} className="flex items-center justify-between px-4 py-2 bg-cardRaffle rounded-md text-sm">
                    <span className="font-medium text-colorRaffle">Boleto #{ticket.number}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-colorRaffle-300 mr-2 sm:mr-3">${ticketPrice.toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:bg-red-100" onClick={() => onRemoveTicket(ticket.id)}>
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          </>
        )}
        <CardFooter className="px-4 sm:px-6 py-4">
          <Button 
            size="lg" 
            className="w-full text-base sm:text-lg" 
            onClick={buyerPopUp ? onApartarClick : onSiguienteClick} 
            disabled={selectedTickets.length === 0}
          >
            Apartar Boletos (${totalPrice.toFixed(2)})
          </Button>
        </CardFooter>
      </Card>
    </motion.section>
  );
};

export default SelectedTicketsSummary;