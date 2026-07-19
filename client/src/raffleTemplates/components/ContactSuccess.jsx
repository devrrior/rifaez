import { MailCheck } from "lucide-react"
export default function ContactSuccess(){
    return (
        <div className="text-colorRaffle text-center flex flex-col items-center space-y-3">
            <MailCheck size={45}/>
            <h1 className="text-3xl">Mensaje Enviado</h1>
            <p className="text-base text-colorRaffle-300">
              Tu mensaje ha sido enviado exitosamente.
            </p>
        </div>
    )
}