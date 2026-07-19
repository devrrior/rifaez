import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useTickets } from '../hooks/useTickets';
import TransactionGroup from '../admin/TransactionGroup';

const AdminPanel = ({userTickets, selectedRaffle}) => {
  const { transactions, updateTicket, deleteTicket, updateTransactionStatus } = useTickets(userTickets, selectedRaffle);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) {
      return transactions;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = [];

    transactions.forEach((transaction) => {
      const { first_name, phone, state, transactionID, tickets } = transaction;

      if (
        first_name.toLowerCase().includes(lowercasedFilter) ||
        (first_name && phone.number.toLowerCase().includes(lowercasedFilter)) ||
        (state && state.toLowerCase().includes(lowercasedFilter)) ||
        transactionID.toLowerCase().includes(lowercasedFilter) ||
        tickets.some(ticket => ticket.number.toString().includes(lowercasedFilter))
      ) {
        filtered.push(transaction);
      }
    });

    return filtered;
  }, [searchTerm, transactions]);

  const transactionIds = filteredTransactions.map(trx => trx.transactionID);

  return (
    <div className="max-w-full mx-auto">

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="mb-3">Transacciones Recientes</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, boleto, teléfono..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionIds.length > 0 ? (
              transactionIds.map((txId) => (
                <TransactionGroup
                  key={txId}
                  transactionID={txId}
                  transaction={filteredTransactions.find(trx => trx.transactionID === txId)}
                  onUpdateTicket={updateTicket}
                  onDeleteTicket={deleteTicket}
                  onUpdateTransactionStatus={updateTransactionStatus}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">No se encontraron resultados</p>
                <p className="text-sm">Intenta con otro término de búsqueda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;