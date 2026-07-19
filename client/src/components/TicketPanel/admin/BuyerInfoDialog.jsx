import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-1">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const BuyerInfoDialog = ({ isOpen, onOpenChange, transaction }) => {
  if (!transaction) return null;
  const { first_name, phone, state, date } = transaction;

  const setPhoneFormat = (phone) => {
    if (typeof phone !== 'string') {
      phone = String(phone); 
    }

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


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Información del Comprador</DialogTitle>
          <DialogDescription>
            Detalles completos del cliente asociado a esta transacción.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <InfoRow icon={<User className="w-5 h-5" />} label="Nombre Completo" value={first_name} />
          <InfoRow icon={<Phone className="w-5 h-5" />} label="Teléfono de Contacto" value={setPhoneFormat(phone.number)} />
          <InfoRow icon={<MapPin className="w-5 h-5" />} label="Estado" value={state} />
          <InfoRow icon={<Calendar className="w-5 h-5" />} label="Fecha de Compra" value={new Date(date).toLocaleString()} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerInfoDialog;