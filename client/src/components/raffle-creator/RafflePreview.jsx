import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import PreviewLayout from '../../raffleTemplates/minimalist/pages/PreviewLayout';

const RafflePreview = ({ previews, hookFormData, verified, phone, logo }) => {
  const getLogoSizeClass = (size) => {
    switch (size) {
      case 'S':
        return 'w-16 h-16';
      case 'M':
        return 'w-24 h-24';
      case 'L':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const getLogoPositionClass = (position) => {
    switch (position) {
      case 'top':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'bottom':
        return 'items-end';
      default:
        return 'items-center';
    }
  };

  const cornerStyle = {
    square: 'rounded-none',
    rounded: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg sm:rounded-2xl shadow-inner w-full h-full flex flex-col overflow-hidden"
    >
      <PreviewLayout previews={previews} logo={logo} verified={verified} phone={phone} raffle={hookFormData} />
    </motion.div>
  );
};

export default RafflePreview;