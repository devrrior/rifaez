
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { raffleValidationSchema } from "../validation/raffleSchemaValidate";
import { saveImagesToIndexedDB } from "../lib/indexedDBHelpers";
import SpinnerLogo from "../components/spinner"
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, // same as fetch's credentials: 'include'
});
import { 
  Copy,
  Facebook,
  Check,
  Share2,
  AlertCircle,
} from "lucide-react";
import TextEditor from "../components/TextEditor";
import RaffleCreator from "../components/RaffleCreator";
import PaymentMethod from "../components/PaymentMethod";

const CreateRafflePage = ({userJustCreated, setUserJustCreated}) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRaffleId, setNewRaffleId] = useState(null);
  const [searchParams] = useSearchParams();
  const [formError, setFormError] = useState(null)
  const [spinner, setSpinner] = useState(false)
  const [filesArray, setFiles] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    maxParticipants: "",
    font: "",
    logo_display_name: true,
    logo_type: '',
    border_corner: '',
    purchasedTicketDisplay: '',
    logo_size: "sm",
    logo_position: "",
    countdown: "off",
    colorPalette: {
      header: "",
      background: "",
      accent: "",
      borders: "",
      color: "",
    },
    endDate: "",
    extraInfo: "",
    fileCounter: 0,
    timeLimitPay: "",
    paymentMethods: [],
    additionalPrizes: [],
    textHtml: {
      title: "Preguntas Frecuentes",
      html: '<p><strong class="ql-size-large" style="color: rgb(255, 0, 0);">¿CÓMO SE ELIGE A LOS GANADORES?</strong></p><p><br></p><p>Todos nuestros sorteos se realizan en base a la<a href="https://rifaez.com" rel="noopener noreferrer" target="_blank">&nbsp;</a><a href="https://rifaez.com" rel="noopener noreferrer" target="_blank" style="color: rgb(61, 155, 233);"><u>Lotería Nacional para la Asistencia Pública</u></a>&nbsp;mexicana.​</p><p>El ganador de&nbsp;Rifas {tu nombre}&nbsp;será el participante cuyo número de boleto coincida con las últimas cifras del primer premio ganador de la Lotería Nacional (las fechas serán publicadas en nuestra página oficial).</p><p><br></p><p><strong class="ql-size-large" style="color: rgb(255, 0, 0);">¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?</strong></p><p><br></p><p>Se elige un nuevo ganador realizando la misma dinámica en otra fecha cercana (se anunciará la nueva fecha).</p><p>Esto significa que, </p><p><br></p><p>¡Tendrías el doble de oportunidades de ganar con tu mismo boleto!</p><p><br></p><p><strong class="ql-size-large" style="color: rgb(255, 0, 0);">¿DÓNDE SE PUBLICA A LOS GANADORES?</strong></p><p><br></p><p>En nuestra página oficial de&nbsp;Facebook&nbsp;<u style="color: rgb(61, 155, 233);">Rifas {tu nombre}</u>&nbsp;puedes encontrar todos y cada uno de nuestros sorteos anteriores, así como las transmisiones en vivo con Lotería Nacional y las entregas de premios a los ganadores!</p>',
    },
  });



  
  useEffect(()=>{
    if(userJustCreated){
      const link = searchParams.get("link");
      setNewRaffleId(link)
      setShowSuccess(true);
      setUserJustCreated(false)
    }
  }, [])

  


  
  const handleSubmit = async () => {
    setSpinner(true)
    const {error, value} = raffleValidationSchema.validate(formData)
    if(error){
      setFormError(error)
      setSpinner(false)
    } else {
      const newRaffleData = new FormData();
      const formObject = {};
      Object.entries(value).forEach(([key, value]) => {
        if (key === "additionalPrizes" || key === "paymentMethods") {
          const serialized = JSON.stringify(
            key === "paymentMethods"
              ? value.map(v => ({
                  bank: v.bank,
                  person: v.person,
                  number: v.number,
                  clabe: v.clabe,
                  instructions: v.instructions,
                }))
              : value
          );
          newRaffleData.append(key, serialized);
          formObject[key] = serialized;
        } else if (key === "colorPalette" || key === "textHtml"){
          const serialized = JSON.stringify(value)
          newRaffleData.append(key, serialized);
          formObject[key] = serialized;
        } else if (key !== "fileCounter") {
          newRaffleData.append(key, value);
          formObject[key] = value;
        }
      });
      filesArray.forEach(image => newRaffleData.append('images', image));
      try {
        const res = await api.post("/api/raffle/create", newRaffleData)
        if(res.data.status === 200){
          setNewRaffleId(res.data.link)
          setSpinner(false)
          setShowSuccess(true);
          setUser(res.data.user)
        } else if (res.data.status === 808){
          sessionStorage.setItem("pendingRaffleForm", JSON.stringify(formObject));
          await saveImagesToIndexedDB(filesArray);
          navigate("/pricing-plan");
        } else {
          setFormError(res.data.message)
          setSpinner(false)
        }
      } catch (error) {
        console.log(error)
        setFormError(error.message)
        setSpinner(false)
      }
    }
  };


  const handleCopyLink = () => {
    const raffleUrl = `${window.location.origin}/raffle/${newRaffleId}`;
    navigator.clipboard.writeText(raffleUrl);
  };

  const handleShareFacebook = () => {
    const raffleUrl = `${window.location.origin}/raffle/${newRaffleId}`;
    window.FB.ui({
      method: 'share',
      href: raffleUrl,
    });
  };

  


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RaffleCreator formData={formData} setFormData={setFormData} setFiles={setFiles} setCurrentStep={setCurrentStep}></RaffleCreator>
        );

      case 2:
        return (
          <TextEditor formData={formData} setFormData={setFormData} setCurrentStep={setCurrentStep}></TextEditor>
        );

      case 3:
        return (
          <PaymentMethod setCurrentStep={setCurrentStep} formData={formData} setFormData={setFormData} mainPublishRaffle={handleSubmit}></PaymentMethod>
        );

      default:
        return null;
    }
  };
  if(spinner){
    return (
      <div className="max-w-3xl mx-auto ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card flex items-center justify-center rounded-lg p-8 	min-h-[420px] shadow-lg text-center space-y-6"
        >
          <SpinnerLogo className="w-32 h-32" />
        </motion.div>
      </div>
    )
  }
  if(formError){
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold">Error creando rifa</h2>
          <p className="text-muted-foreground">
            Hubo un error al crear tu rifa asegurese de que haya ingresado la informacion correcta.
          </p>

        </motion.div>
      </div>
    );
  }
  if (showSuccess) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold">¡Rifa Creada con Éxito!</h2>
          <p className="text-muted-foreground">
            Tu rifa ha sido publicada y está lista para compartir
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Enlace</span>
            </Button>

            <Button
              className="flex items-center justify-center space-x-2"
              onClick={handleShareFacebook}
            >
              <Facebook className="w-4 h-4" />
              <span>Compartir en Facebook</span>
            </Button>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/raffle/${newRaffleId}`)}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Ver Rifa</span>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {renderStep()}
    </>
  );
};

export default CreateRafflePage;
