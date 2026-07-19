import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BasicInfo = ({ register, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">Información Básica</h2>
      <div className="space-y-4">
        <div className='space-y-2'>
          <Label htmlFor="title" error={errors.title} className="text-card-foreground">Título de la Rifa</Label>
          <Input
            id="title"
            placeholder="Ej: iPhone 15 Pro"
            className="bg-background text-foreground placeholder:text-gray-400"
            {...register('title')}
            error={errors.title}
          />
        </div>
        
        <div className='space-y-2'>
          <Label error={errors.description} htmlFor="description" className="text-card-foreground">Descripción (Opcional)</Label>
          <Textarea
            id="description"
            placeholder="Describe el premio..."
            className="bg-background text-foreground placeholder:text-gray-400 min-h-[100px]"
            {...register('description')}
            error={errors.description}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BasicInfo;