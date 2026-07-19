import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Edit, Trash2, Copy, Check, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import EditNoteDialog from '../admin/EditNoteDialog';
import DeleteConfirmationDialog from '../admin/DeleteConfirmationDialog';

const TicketItem = ({ ticket, onUpdate, transaction, onDelete }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleCopy = () => {
    const ticketInfo = `Boleto #${ticket.number}\nCliente: ${transaction.first_name + transaction.last_name}\nTel: ${transaction.phone.number}\nEstado: ${ticket.status}`;
    navigator.clipboard.writeText(ticketInfo);
    setIsCopied(true);
    toast({ title: "Información copiada", description: "Los detalles del boleto se han copiado." });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTogglePaid = () => {
    const newStatus = ticket.status === 'pagado' ? 'pendiente' : 'pagado';
    onUpdate(ticket.number, { status: newStatus });
    toast({
      title: "Estado actualizado",
      description: `El boleto #${ticket.number} ahora está ${newStatus}.`,
    });
  };

  const handleSaveNote = (notes) => {
    onUpdate(ticket.number, { notes });
    toast({ title: "Nota guardada", description: "La nota del boleto ha sido actualizada." });
    setNoteDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(ticket.number);
    toast({ title: "Boleto eliminado", description: `El boleto #${ticket.number} ha sido eliminado.` });
    setDeleteDialogOpen(false);
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

  const currentStatus = statusStyles[ticket.status] || statusStyles.pendiente;

  return (
    <>
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
          <Button variant="outline" className="text-xs xxs:text-sm" size="sm" onClick={handleTogglePaid}>
            Marcar {currentStatus.buttonText}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setNoteDialogOpen(true)} className="text-gray-500 hover:text-primary">
            <Edit className="w-4 h-4" />
            {ticket.notes && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="text-gray-500 hover:text-primary">
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)} className="text-red-500 hover:bg-red-100">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <EditNoteDialog
        isOpen={isNoteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        ticket={ticket}
        onSave={handleSaveNote}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        ticketNumber={ticket.number}
      />
    </>
  );
};

export default TicketItem;