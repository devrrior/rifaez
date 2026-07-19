
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye, ChevronLeft, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, 
});

const EditRafflePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
 

  const handlePreview = (id) => {
    navigate(`/raffle/${id}`);
  };

  const handleEdit = (raffle) => {
    navigate(`/raffle-admin/edit/${raffle.id}`);
  };

  const handleDelete = async (raffle) => {
    const res = await api.post(`/api/raffle/delete/${raffle.id}`)
    if(res.data.status === 200){
      setUser(res.data.user)
    }
  };

  const handleDownloadExcel = async (raffle) => {
    downloadExcel(raffle.currentParticipants, `${raffle.title}_raffle_participants.xlsx`);
  };

  const downloadExcel = (data, fileName = 'data.xlsx') => {
    const refactoredData = []
    data.forEach(participant => {
      for (const ticket of participant.tickets) {
          const excelRow = {
            Boleto: ticket,
            Nombre: participant.name,
            Telefono: participant.phone,
            Estado: participant.state,
            Fecha: new Date(participant.date).toLocaleString('en-MX', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            Cantidad: participant.amount,
            Status: participant.status === "paid" ? "pagado" : "pendiente",
            Identificador: participant.transactionID,
            Notas: participant.notes ? participant.notes.join(', ') : "",
          }
          refactoredData.push(excelRow)
      }
    });

    const sortedData = Array.from(refactoredData).sort((a, b) => a.Boleto - b.Boleto);
    // const refactoredData = data.map(ticket => ({
    //     Nombre: ticket.name,
    //     Telefono: ticket.phone,
    //     Estado: ticket.state,
    //     Fecha: new Date(ticket.date).toLocaleString('en-MX', {
    //       dateStyle: 'medium',
    //       timeStyle: 'short',
    //     }),
    //     Boletos: ticket.tickets.join(', '),
    //     Cantidad: ticket.amount,
    //     Status: ticket.status === "paid" ? "pagado" : "pendiente",
    //     Identificador: ticket.transactionID,
    //     Notas: ticket.notes ? ticket.notes.join(', ') : "",
    // }))
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Write the workbook and convert it to a binary string
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
  
    // Create a Blob from the binary string
    const dataBlob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
  
    // Create a link and trigger the download
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/raffle-admin")}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Editar Rifas</h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2">
          Gestiona tus rifas activas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Fecha de Finalización
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
            {user.raffles && user.raffles.length > 0 ? (
                  user.raffles.map((raffle) => (
                    <tr key={raffle._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{raffle.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {raffle.readableEndDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {raffle.currentParticipants.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${raffle.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {raffle.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() => handlePreview(raffle.shortId)}
                          >
                            <Eye className="w-4 h-4" />
                            <span>Vista Previa</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() => handleEdit(raffle)}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex bg-green-900 items-center space-x-1 text-destructive-foreground"
                            onClick={() => handleDownloadExcel(raffle)}
                          >
                            <Download className="w-4 h-4" />
                            <span>Descargar Excel</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() => handleDelete(raffle)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No hay rifas disponibles.
                    </td>
                  </tr>
                )}

            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default EditRafflePage;
