import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFieldArray } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, CircleMinus } from 'lucide-react';

const RaffleDetails = ({ control, watch, register, errors }) => {
  const { toast } = useToast();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalPrizes",
  });
  const addPrize = () => {
    const prizes = watch("additionalPrizes");
    const nextPlace = prizes.length + 2;
    append({
      place: nextPlace,
      prize: "", // initially empty
    });
  };
  const removePrize = (indexOld) => {
    remove(indexOld)
  }


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 border-b pb-4">Detalles de la Rifa</h2>
      <div className="space-y-4">
        <div className='space-y-2'>
          <Label htmlFor="ticketPrice" error={errors.price} >Precio por Boleto</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="ticketPrice"
              type="number"
              placeholder="0.00"
              className="bg-background text-foreground placeholder:text-gray-400 pl-8"
              error={errors.price}
              {...register('price')}
            />
          </div>
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor="ticketCount" error={errors.maxParticipants} >Número de Boletos</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="ticketCount"
              type="number"
              placeholder="100"
              className="bg-background text-foreground placeholder:text-gray-400 pl-10"
              error={errors.maxParticipants}
              {...register('maxParticipants')}
            />
          </div>
        </div>
        
        <div className='space-y-2'>
          <Label >Premios Adicionales</Label>
          <Button
            onClick={addPrize}
            variant="outline"
            type="button"
            className="w-full bg-background text-card-foreground hover:bg-muted-foreground mt-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Premio
          </Button> 
        </div>
        {fields.map((field, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 relative text-card-foreground">
                    <Label error={errors.additionalPrizes?.[index]?.prize}>
                      {field.place}º Lugar
                    </Label>
                    <div className="relative grow">
                    <Input
                      type="text"
                      className={`flex-1 p-2 w-full rounded-md border bg-background ${errors[`additionalPrizes_${index}`] ? "border-red-500" : "border-input"}`}
                      placeholder="Describe el premio"
                      error={errors.additionalPrizes?.[index]?.prize}
                      {...register(`additionalPrizes.${index}.prize`)}
                    />
                    <CircleMinus onClick={()=>{removePrize(index)}} className="text-red-500 h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3"/>
                    </div>
                  </div>
                ))}
      </div>
    </motion.div>
  );
};

export default RaffleDetails;