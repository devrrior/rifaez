import { AlertTriangle } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AppError({ message = "Hubo un error", status = 500 }) {
    const {setAppError} = useAuth();
    const navigate = useNavigate()
    const removeError = () => {
        setAppError(null)
        navigate("/raffle-admin");
    }
  return (
    <div className="min-h-[500px] bg-background flex flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-2">Error {status}</h1>
      <p className="text-lg text-muted-foreground mb-6">{message}</p>
      <button
        onClick={removeError}
        className="cursor-pointer px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition"
      >
        Pagina de inicio
      </button>
    </div>
  );
}
