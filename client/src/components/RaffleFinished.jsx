import { Link } from "react-router-dom";
import { useState } from "react";
import Spinner from "./spinner";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
const api = axios.create({
    baseURL: import.meta.env.VITE_CURRENT_HOST,
    withCredentials: true, // same as fetch's credentials: 'include'
  });

const RaffleFinished = ({setViewStatistics, raffle}) => {
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const deleteRaffle = async (raffle) => {
        const res = await api.post(`/api/raffle/delete/${raffle.id}`)
        if(res.data.status === 200){
        setUser(res.data.user)
        }
    }
    return (
    <div className="flex justify-center items-center flex-col gap-8 h-96 mt-8">
            <div className="shadow-lg rounded-2xl text-center flex flex-col items-center gap-6 bg-background py-8 px-8 w-[500px] max-w-[calc(100vw-24px)] border border-input">
                {loading ? <Spinner className="h-36 w-36" /> : (
                    <>
                    <h1 className="text-3xl">Rifa ha finalizado</h1>
                    <p className="text-base font-normal">Puedes ver las estadísticas de la rifa finalizada o eliminarla de forma permanente.</p>
                    <footer className="flex gap-3">
                        <button className="px-4 py-3 bg-primary rounded-lg text-primary-foreground text-sm font-medium" onClick={()=>{setViewStatistics(true)}}>
                            <span>Ver estadísticas</span>
                        </button>
                        <button className="px-4 py-3 bg-destructive rounded-lg text-destructive-foreground text-sm font-medium" onClick={()=>{deleteRaffle(raffle)}}>
                            <span>Eliminar Rifa</span>
                        </button>
                    </footer>
                    </>
                )}
            </div>
    </div>
    )
}

export default RaffleFinished;