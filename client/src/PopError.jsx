import { X } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function PopError({ message = "Ocurrio un error.", status = 400}) {
  useEffect(() => {
    document.getElementById("popError").showModal()
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
    const {setPopError} = useAuth();
    const navigate = useNavigate()
    const removeError = () => {
        setPopError(null)
    }
  return (
      <dialog id="popError" className="bg-background text-foreground w-[300px] max-w-screen p-6 rounded-lg">
        <header className="flex justify-between items-center mb-10">
            <h1 className="text-2xl">Error </h1>
            <button
                onClick={removeError}
                className="cursor-pointer p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-red-600 transition"
                >
                <X/>
            </button>
        </header>

        <p className="mb-10">{message}</p>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground" onClick={status === 808 ? ()=>{navigate("/pricing-plan")} : removeError}>{status === 808 ? "Actualizar" : "Cancelar"}</button>

      
    </dialog>
  );
}
