import {Link} from 'react-router-dom';
import {Plus} from 'lucide-react';
const NoRaffle = () => {
    return (
    <div className="flex justify-center items-center flex-col gap-8 h-96 mt-8">
            <span className="text-8xl text-gray-600">0</span>
            <span className="text-2xl font-normal">Rifas activas</span>
            <Link to="/raffle-admin/create" className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground">
                <span>Crear nueva rifa</span>
                <Plus stroke="currentColor" />
            </Link>
    </div>
    )
}

export default NoRaffle