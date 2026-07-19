import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Hash, Calendar, Info, CheckCircle, Clock, Ticket as TicketIcon } from 'lucide-react';
import { Button } from '../ui/button';
import TicketItem from '../admin/TicketItem';
import BuyerInfoDialog from '../admin/BuyerInfoDialog';
import { useToast } from '../ui/use-toast';

const TransactionGroup = ({ transactionID, transaction, onUpdateTicket, onDeleteTicket, onUpdateTransactionStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyerInfoOpen, setBuyerInfoOpen] = useState(false);
  const { first_name, tickets, date } = transaction;
  
  const { toast } = useToast();

  const handleMarkAllPaid = () => {
    onUpdateTransactionStatus(transaction._id, 'pagado');
    toast({
      title: "Transacción Actualizada",
      description: `Todos los boletos de la transacción ${transactionID} han sido marcados como pagados.`,
    });
  };

  const { paidCount, pendingCount, allPaid } = useMemo(() => {
    const paid = tickets.filter(t => t.status === 'pagado').length;
    return {
      paidCount: paid,
      pendingCount: tickets.length - paid,
      allPaid: paid === tickets.length,
    };
  }, [tickets]);

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
        <div className="w-full flex items-start sm:items-center justify-between p-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow cursor-pointer min-w-0" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${allPaid ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                {allPaid ? <CheckCircle className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-foreground truncate">
                <span className="text-primary">#{transactionID}</span> - {first_name}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><TicketIcon className="w-3 h-3" /> {tickets.length} Boleto{tickets.length !== 1 && 's'}</span>
                <span className={`flex items-center gap-1 font-medium ${paidCount > 0 ? 'text-green-600' : ''}`}><CheckCircle className="w-3 h-3" /> {paidCount} Pagado{paidCount !== 1 && 's'}</span>
                <span className={`flex items-center gap-1 font-medium ${pendingCount > 0 ? 'text-yellow-600' : ''}`}><Clock className="w-3 h-3" /> {pendingCount} Pendiente{pendingCount !== 1 && 's'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setBuyerInfoOpen(true); }} className="text-muted-foreground hover:text-primary">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-3 border-t">
                 {!allPaid && (
                  <div className="flex justify-end mb-2">
                    <Button size="sm" onClick={handleMarkAllPaid} className="bg-green-500 hover:bg-green-600 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar Todos Como Pagados
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  {tickets.map((ticket) => (
                    <TicketItem
                      key={ticket}
                      ticket={ticket}
                      transaction={transaction}
                      onUpdate={onUpdateTicket}
                      onDelete={onDeleteTicket}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BuyerInfoDialog
        isOpen={isBuyerInfoOpen}
        onOpenChange={setBuyerInfoOpen}
        transaction={transaction}
      />
    </>
  );
};

export default TransactionGroup;