import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const EditNoteDialog = ({ isOpen, onOpenChange, ticket, onSave }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (ticket) {
      setNotes(ticket.notes || '');
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSave = () => {
    onSave(notes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notas para el Boleto #{ticket.number}</DialogTitle>
          <DialogDescription>
            Agrega o edita notas para este boleto. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right col-span-4 text-left mb-2">
              Nota
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-4"
              placeholder="Escribe tus notas aquí..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">Guardar Nota</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;