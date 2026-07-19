
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Bell } from "lucide-react";
import { Link } from "react-router-dom";
const RaffleSelector = ({ raffles, selectedRaffle, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if(selectedRaffle === "null"){
    return (
      <div className="relative w-full">
      <Link
        to="create"
        className="w-full flex items-center justify-between p-3 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
      >
        <div className="max-w-full overflow-x-auto flex items-center space-x-2">
          <span className="font-medium max-w-full whitespace-nowrap">Crear Rifa +</span>
        </div>
      </Link>
    </div>
    )
  }
  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
      >
        <div className="max-w-full overflow-x-auto flex items-center space-x-2">
          <span className="font-medium max-w-full whitespace-nowrap">{selectedRaffle?.title || "Seleccionar Rifa"}</span>
          {selectedRaffle.notifications.filter(n => !n.read).length > 0 && (
            <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {selectedRaffle.notifications.filter(n => !n.read).length > 9 ? '+9' : selectedRaffle.notifications.filter(n => !n.read).length}
            </div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-input rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {raffles.map((raffle) => (
            <button
              key={raffle.id}
              onClick={() => {
                onSelect(raffle);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 hover:bg-accent transition-colors ${
                selectedRaffle?.id === raffle.id ? "bg-primary/10" : ""
              }`}
            >
              <p className="font-medium">{raffle.title}</p>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RaffleSelector;
