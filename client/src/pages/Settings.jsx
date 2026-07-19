
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveSchema, workerSchema, passwordSchema, methodSchema } from "../validation/userSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from "../components/spinner"
import DefaultLogo from "../raffleTemplates/components/ui/default-logo";
import { 
  User, 
  CreditCard, 
  Palette, 
  Globe, 
  Building2, 
  Upload, 
  Moon, 
  Sun, 
  Plus, 
  Link as LinkIcon, 
  LogOut, 
  Check, 
  X, 
  CreditCard as PaymentIcon, 
  Wallet as Bank,
  Users,
  Facebook,
  Phone,
  Save,
  CircleX,
  CircleAlert,
  CirclePlus,
  Trash2,
  CircleCheck,
  CheckCircle,
} from 'lucide-react';


import axios from "axios";
import Logo from "../Logo";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});



const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout, deleteUser, user, setUser, save, setAppError, setPopError, connectDomain, verifyCNAME, domainDisconnect } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [theme, setTheme] = useState(user.theme ? user.theme : "system");
  const [language, setLanguage] = useState("es");
  const [wasSubmitted, setWasSubmitted] = useState({})
  const [newWorker, setNewWorker] = useState({});
  const [newMethod, setNewMethod] = useState({bank: '', person: '', number: "", instructions: ""})
  const [spinner, setSpinner] = useState(null)
  const [domainV, setDomainV] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState(null)
  const [fileState, setFileState] = useState(null)
  const [changedPassword, setChangedPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successDomain, setSuccessDomain] = useState(false)
  const [errors, setErrors] = useState({});
  const [customBank, setCustomBank] = useState("")
  const [methods, setMethods] = useState(user.payment_methods || [])
  const [domainError, setDomainError] = useState(null)
  const [loadingCertificate, setLoadingCertificate] = useState(null)
  const [spinnerDomain, setSpinnerDomain] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [workers, setWorkers] = useState(user.workers || [])
  const [successMessage, setSuccessMessage] = useState("")
  const [passwordObj, setPasswordObj] = useState({})
  const methodDialogRef = useRef(null)
  const customSelectItemRef = useRef(null)
  const [formData, setFormData] = useState({
    name: user.name || "Juan Pérez",
    email: user.username || "juan@example.com",
    companyName: user.companyName,
    logo: user.logo || undefined,
    facebookUrl: user.facebookUrl || "",
    phone: user.phone,
    domain: user.domain ,
  });

  const handleLogout = () => {
    logout(); // This will handle both state cleanup and navigation
  };
  const handleDelete = () => {
    deleteUser();
  }

  useEffect(()=>{
    if(user){
      setFormData({
        name: user.name || "Juan Pérez",
        email: user.username || "juan@example.com",
        companyName: user.companyName,
        logo: user.logo || undefined,
        facebookUrl: user.facebookUrl || "",
        phone: user.phone,
        domain: user.domain,
      });
      setMethods(user.payment_methods || [])
      setWorkers(user.workers || []);
    }
  }, [user])

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: {url: URL.createObjectURL(file)} }));
      setFileState(file)
    }
  };
  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '');
  
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  function formatCLABE(clabe) {
    if (!clabe) return "";
  
    const digits = clabe.replace(/\D/g, '').slice(0, 18);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,11})(\d{0,1})$/);
  
    if (!match) return digits;
  
    // Destructure the match array and ignore the full match at index 0
    const [, bank, branch, account, control] = match;
  
    return [bank, branch, account, control].filter(Boolean).join(' ');
  }
  
  
  

  const addPaymentMethod = async () => {
    setWasSubmitted(prev => ({...prev, method: true}))
    const methodTemp = {...newMethod}
    if(newMethod.bank === "otro"){
      methodTemp.bank = customBank;
    }
    const {error, value} = methodSchema.validate(methodTemp, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(error => {
        newObj[error.context.key] = error.message
      })
      
    }
    setErrors(prev => ({...prev, method: newObj}))

    if(error){
      return;
    }
    
    const res = await api.post("/auth/save_settings/add_method", value)
    if(res.data.status === 200){
      setUser(res.data.user)
      setMethods(prev => [...prev, {...value, _id: res.data.id}])
      setWasSubmitted(prev => ({...prev, method: undefined}))
      setErrors(prev => ({...prev, method: undefined}))
      setNewMethod({bank: '', person: '', number: "", instructions: ""})
    } else {
      setAppError({message: "error creating method"})
    }
  };

const removeMethod = async (methodInp) => {
  const methodNew = methodInp
  const res = await api.post("/auth/save_settings/remove_method", {id: methodNew._id})
  if(res.data.status === 200){
    setUser(res.data.user)
    setMethods(prev => prev.filter(method => method._id !== methodNew._id) || [])
  } else {
    setErrors(prev => ({...prev, removeWorker: "Invalid"}))
  }
  
}
  const handleAddWorker = async () => {
    setWasSubmitted(prev => ({...prev, worker: true}))
    const {password, email} = newWorker

    
    const {error, value} = workerSchema.validate({email}, {abortEarly: false});
    let newObj = {}
    if(error){
      newObj[error.details[0].context.key] = error.details[0].message
    }
    setErrors(prev => ({...prev, worker: newObj}))

    if(error){
      return;
    }
    if(password && email){
      const res = await api.post("/auth/save_settings/add_worker", {email, password})

      if(res.data.status === 200){
        setWorkers(prev => [...prev, {...value, isActive: true}])
        setWasSubmitted(prev => ({...prev, worker: undefined}))
        setErrors(prev => ({...prev, addWorker: undefined, passwordIncorrect: undefined}))
        setNewWorker({email: '', password: ''})
      } else if (res.data.status === 808){
        setPopError({message: res.data.message, status: 808})
      } else if (res.data.status === 401) {
        setPopError({message: res.data.message, status: 401})
      } else {
        setErrors(prev => ({...prev, passwordIncorrect: "Invalid"}))
      }
    } else {
      setErrors(prev => ({...prev, passwordIncorrect: "Invalid"}))
    }

    
  };

  const handleRemoveWorker = async (email) => {
    const res = await api.post("/auth/save_settings/remove_worker", {email})

    if(res.data.status === 200){
      setWorkers(prev => prev.filter(worker => worker.email !== email) || [])
    } else {
      setErrors(prev => ({...prev, removeWorker: "Invalid"}))
    }
  };

  useEffect(()=>{
    if(wasSubmitted.form){
      formValidate();
    }
  }, [formData])

  const formValidate = () => {
    const {error, value} = saveSchema.validate(formData, {abortEarly: false, stripUnknown: true})
    let newObj = {}
    if(error){
      error?.details.forEach(detail => {
        newObj[detail.context.key] =  detail.message
      })
    }
    setErrors(newObj)
    return {error, value}
  }

 
  const handlePhoneChange = () => {
    setWasSubmitted(prev => ({...prev, phone: true}))
    const {error, value} = saveSchema.extract('phone').validate(newPhoneNumber);
    if(error){
      setErrors(prev => ({...prev, phone: error}))
      return;
    } else {
      setErrors(prev => ({...prev, phone: undefined}))
    }
    setFormData(prev => ({...prev, phone: value}))
    document.getElementById("change-phone").close()
    setNewPhoneNumber(null);
  }
  const handleDomainChange = (e) => {
    setDomainV(e.target.value)
  }

  



  const connectDomainFunc = async (type) => {
    if(type === "create"){
      setSpinnerDomain(true)
      const res = await connectDomain(domainV);
      if(res.status ===  200){
        setUser(prev => ({...prev, domain: res.domain }))
        setDomainError(null)
      } else {
        setDomainError(res.error)
      }
      setSpinnerDomain(false)
      return;
    } 
    if(type === "verify"){
      setVerifyLoading(true)
      const res = await verifyCNAME(formData.domain?.domain);
      const newErr = {}
      if(res.verificationStatus ===  "verified"){
        setUser(prev => ({...prev, domain: res.domain }))
        newErr.domain_verification = false
      } else {
        newErr.domain_verification = true
      }
      setVerifyLoading(false)
      setErrors(prev => ({...prev, ...newErr}))
    }
  }

  const handleDomainDisconnect = async () => {
    try {
      await domainDisconnect(user.domain)
      setUser(prev => ({...prev, domain: undefined }))
      document.getElementById("confirm-d").close()
    } catch (error) {
      setAppError(error)
    }
  }

  const handleChange = (e) => {
    let {name, value} = e.target;
    if(name === "phone"){
      value = value.replace(/\D/g, '');
      if(value.length > 10){
        value = value.slice(0, 10); 
      }
      setNewPhoneNumber(value);
      return;
    }
    if(name === "worker_email" || name === "worker_password"){
      setNewWorker(prev => ({...prev, [name.slice(7)]: value}));
      return;
    }
    if(name === "method_person" || name === "method_number" || name === "method_bank" || name === "method_instructions" || name === "method_clabe"){
      if(name === "method_number"){
        let digits = value.replace(/\D/g, '');
        if (digits.length > 16) {
          digits = digits.slice(0, 16);
        }
        value = digits
      }
      if(name === "method_clabe"){
        let digits = value.replace(/\D/g, '');
        if (digits.length > 18) {
          digits = digits.slice(0, 18);
        }
        value = digits
      }
      
      setNewMethod(prev => ({...prev, [name.slice(7)]: value}));
      return;
    }
    setFormData(prev => ({...prev, [name]: value}));
  }


  useEffect(() => {
    if(!wasSubmitted.phone) return;
    const {error} = saveSchema.extract('phone').validate(newPhoneNumber);
    if(error){
      setErrors(prev => ({...prev, phone: error}))
      return;
    } else {
      setErrors(prev => ({...prev, phone: undefined}))
    }
  }, [newPhoneNumber])
  useEffect(() => {
    if(!wasSubmitted.worker) return;
    const {email} = newWorker
    const {error} = workerSchema.validate(email, {abortEarly: false});
    let newObj = {}
    if(error){
      newObj[error.details[0].context.key] = error.details[0].message
    }
    setErrors(prev => ({...prev, worker: newObj}))
  }, [newWorker])
  useEffect(() => {
    if(!wasSubmitted.method) return;
    const methodTemp = {...newMethod}
    if(newMethod.bank === "otro"){
      methodTemp.bank = customBank;
    }
   
    const {error} = methodSchema.validate(methodTemp, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(error => {
        newObj[error.context.key] = error.message
      })
      
    }
    setErrors(prev => ({...prev, method: newObj}))
  }, [newMethod, customBank])

  const setPhoneFormat = (phone) => {
    if (typeof phone !== 'string') {
      phone = String(phone); 
    }

    const digits = phone?.replace(/\D/g, ''); 
    const parts = [];

    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    if (digits?.length >= 4) {
      parts[0] += ') ';
      parts.push(digits.substring(3, Math.min(6, digits.length)));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10));
    }

    return parts.join('');
  }

  const handlePasswordChange = (e) => {
    const {name, value} = e.target
    setPasswordObj(prev => ({...prev, [name]: value}));
  }

  const passwordChange = async () => {
    setWasSubmitted(prev => ({...prev, password: true}));
    if(!passwordObj.password){
      setErrors(prev => ({...prev, password: "llena contraseña"}))
      return;
    }
    const res = await api.post("/auth/check_password", {password: passwordObj.password})
    if(res.data.status === 200){
      setErrors(prev => ({...prev, password: undefined}))
      const {error, value} = passwordSchema.validate(passwordObj.password_new)
      if(error){
        setErrors(prev => ({...prev, password_new: "contraseña no cumple los requisitos"}));
        return;
      } else if (passwordObj.password_new === passwordObj.password_new_confirm){
        const res = await api.post("/auth/change_password", {password: passwordObj.password, password_new: value})
        if(res.data.status === 200){
          setWasSubmitted(prev => ({...prev, password: undefined}));
          setPasswordObj({
            password: "",
            password_new: "",
            password_new_confirm: "",
          });
          setChangedPassword(true)
          setErrors(prev => ({...prev, password: undefined, password_new: undefined, password_new_confirm: undefined,}))
        }
      } else {
        setErrors(prev => ({...prev, password_new_confirm: "contraseñas deben ser iguales"}));
      }
    } else {
      setErrors(prev => ({...prev, password: "contraseña es incorrecta"}))
    }
    
  }

  useEffect(() => {
    if (wasSubmitted.password) {
      const {error} = passwordSchema.validate(passwordObj.password_new)
      if(error){
        setErrors(prev => ({...prev, password_new: "contraseña no cumple los requisitos"}));
      } else if (passwordObj.password_new !== passwordObj.password_new_confirm){
        setErrors(prev => ({...prev, password_new_confirm: "contraseñas deben ser iguales"}));
      } else {
        setErrors(prev => ({...prev, password: undefined, password_new: undefined, password_new_confirm: undefined,}))
      }
    }
  }, [passwordObj])

  useEffect(() => {
    let timer;
    if (changedPassword) {
      timer = setTimeout(() => {
        setChangedPassword(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [changedPassword])
  const saveSettings = async () => {
    setLoading(true);
    setWasSubmitted({form: true});
    const {error, value} = formValidate();
    console.log(error, value)
    if(error){
      setLoading(false);
      return;
    }
    try {
      const newRaffleData = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        if(key !== "logo"){
          newRaffleData.append(key, value);
        }
      });
      if(fileState){
        newRaffleData.append("logo", fileState);
      }
      const res = await save(newRaffleData)
      console.log(res)
      if(res.status === 200){
        setEmailExists(false)
        setLoading(false);
        setSuccessMessage('Usuario guardado exitosamente.');
      } else if (res.status === 401){
        setEmailExists(true)
      } else {
        console.log('Error saving user');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const element = document.documentElement;
    switch (theme) {
      case "dark":
        element.classList.add("dark")
        localStorage.setItem("theme", "dark")
        break;
      case "light":
          element.classList.remove("dark")
          localStorage.setItem("theme", "light")
      break;
    }
  }, [theme]);
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSubscribe = (priceId) => {
      navigate(`/checkout?price_id=${priceId}`);
  }

  const handleSubscribeChange = async (priceId) => {
    setSpinner(true)
    try {
      const res = await api.post("/stripe/update-plan", {newPriceId: priceId});
      console.log(res)
      if(res.data){
        setSpinner(false)
        setUser(res.data)
      }
    } catch (error) {
      setSpinner(false)
      setAppError(error)
    }
  }
  const handleCancelSubscription = async (priceId) => {
    try {
      const res = await api.post("/stripe/cancel-subscription");
      if(res.data){
        setUser(res.data)
      }
    } catch (error) {
      setAppError(error)
    }
  }

  const plans = [
    {
      id: "basic",
      name: "Plan Básico",
      price_id: import.meta.env.VITE_PRICE_ID_BASIC, 
      price: "$125",
      features: [
        "1 Rifa Activa",
        "1 Plantilla Disponible",
        "2 Trabajadores",
        "Dominio personalizado",
      ]
    },
    {
      id: "pro",
      name: "Plan Pro",
      price_id: import.meta.env.VITE_PRICE_ID_PRO,
      price: "$250",
      features: [
        "3 Rifas Activas",
        "2 Plantilla Disponible",
        "5 Trabajadores",
        "Dominio personalizado",
      ]
    },
    {
      id: "business",
      name: "Plan Empresarial",
      price_id: import.meta.env.VITE_PRICE_ID_BUSINESS,
      price: "$500",
      features: [
        "Rifas Ilimitadas",
        "3 Plantilla Disponible",
        "10 Trabajadores",
        "Dominio personalizado",
      ]
    }
  ];

 

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Perfil</h2>
              <Button 
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.name && "text-red-500"}`}>
                  Nombre
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.name ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.email && "text-red-500"}`}>
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.email ? "border-red-500" : "border-input"} bg-background`}
                />
                {emailExists &&
                  <p className="mt-2 block text-destructive">Este correo ya esta asociada a otra cuenta or trabajador.</p>
                }
              </div>
            {user.facebookId ? (
              <div className="w-full px-4 py-4 rounded-md border border-input bg-background text-muted-foreground flex gap-3">
                <Facebook/>
                <span>Cuenta fue creado con Facebook</span>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
              
                <div className="space-y-2 mb-4 " onClick={()=>{document.getElementById("change-password").showModal()}}>
                <input type="password" readOnly className="w-full p-2 rounded-md border border-input bg-background cursor-pointer
                    caret-transparent
                    outline-none
                    select-none
                    focus:outline-none
                    focus:ring-0" value="secret123" />
                </div>
                <dialog id="change-password" className='w-screen h-screen bg-transparent'>
              <div className="flex justify-center items-center w-full h-full px-8">
                <div className="bg-background text-foreground px-7 py-7 rounded-lg max-w-full w-[500px]">
                <div className="mb-6 space-y-4">
                  <label className="block text-lg font-medium">
                    Cambiar Contraseña
                  </label>
                
                  <div className="space-y-3">
                    <input
                      type="password"
                      name="password"
                      placeholder="Contraseña actual"
                      onChange={handlePasswordChange}
                      value={passwordObj.password}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    />
                    {errors.password &&
                      <p className="text-red-500 mb-2 text-sm">
                        Contraseña actual es incorrecta.
                      </p>
                    }
                    <input
                      type="password"
                      name="password_new"
                      placeholder="Nueva contraseña"
                      onChange={handlePasswordChange}
                      value={passwordObj.password_new}

                      className="w-full p-2 rounded-md border border-input bg-background"
                    />
                    <input
                      type="password"
                      name="password_new_confirm"
                      placeholder="Confirmar nueva contraseña"
                      onChange={handlePasswordChange}
                      value={passwordObj.password_new_confirm}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  {(errors.password_new || errors.password_new_confirm)  &&
                      <p className="text-red-500 text-sm">
                        {errors.password_new ? "La contraseña debe tener al menos 8 caracteres, e incluir como mínimo una letra mayúscula, una letra minúscula y un número." : "Contraseñas deben coincidir" }
                      </p>
                    }
                </div>
                <div className="flex gap-3 items-center">
                {changedPassword ?
                    <button className="text-sm px-5 py-2 rounded-md text-primary-foreground bg-primary ">
                      Contraseña cambiado
                    </button>
                    :
                    <button onClick={passwordChange} className="text-sm px-5 py-2 rounded-md text-primary-foreground bg-primary ">
                      Cambiar
                    </button>
                  }
                  <Button
                        variant="outline"
                        onClick={()=>{document.getElementById("change-password").close()}}
                      >Cancelar</Button>
                  </div>
                  </div>
                  </div>
                </dialog>
              </div>)}
            
              
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Empresa</h2>
            
            <div className="space-y-4">
            <div>
                <label className={`block text-sm font-medium mb-2 ${errors.companyName && "text-red-500"}`}>
                  Nombre de la Empresa
                </label>
                <input
                  name="companyName"
                  type="email"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.companyName ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo de la Empresa
                </label>
                <div className="flex items-center space-x-4">
                  {formData.logo ? (
                    <img
                      src={formData.logo.url}
                      alt="Logo"
                      className="border-2 border-input h-10 w-10 rounded-full"
                    />
                  ): <DefaultLogo className="border-2 border-input h-10 w-10 rounded-full" />}
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload").click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Cargar Logo</span>
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLogo}
                    className="hidden"
                  />
                </div>
              </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rifaez Verificar
                    </label>
                    {user.verified ? (
                      <Button variant="default" className="w-full flex justify-between px-4 py-6 rounded-md border border-input bg-background text-muted-foreground gap-3 hover">
                        <span className="text-primary">Cuenta Verificada</span>
                        <CheckCircle className="text-primary"/>
                    </Button>
                    ) : (
                      <Button variant="outline" onClick={()=>{handleSubscribe(import.meta.env.VITE_PRICE_ID_VERIFY)}} className="w-full flex justify-start px-4 py-6 rounded-md border border-input bg-background text-muted-foreground gap-3 hover">
                        <Logo />
                        <span>Verificar Cuenta</span>
                      </Button>
                    )}
                    
                  </div>
              

              <div>
                <label className="block text-sm font-medium mb-2">
                  Redes Sociales
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <Facebook className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.facebookUrl ? "text-red-500" : "text-muted-foreground"} w-5 h-5`} />
                    <input
                      type="text"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                      className={`w-full pl-10 p-2 rounded-md border ${errors.facebookUrl ? "border-red-500" : "border-input"} bg-background`}
                      placeholder="URL de Facebook"
                    />
                  </div>
                  <div className="relative cursor-pointer" onClick={() => document.getElementById("change-phone").showModal()} >
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <div
                      className="w-full pl-10 p-2 rounded-md border border-input bg-background text-muted-foreground"
                      placeholder="Número de Teléfono"
                    >{ setPhoneFormat(formData.phone) }</div>
                  </div>
                </div>
                <dialog id="change-phone" className="p-6 rounded-lg shadow-lg bg-background text-foreground">
                  <h3 className="text-lg font-medium mb-4">Cambiar telefono</h3>
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${errors.phone && "text-red-500"}`}>
                        Numero de Telefono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={setPhoneFormat(newPhoneNumber)}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.phone ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="(654) 328-4545"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("change-phone").close()}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handlePhoneChange}>
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </dialog>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Trabajadores</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={() => document.getElementById("add-worker").showModal()}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Trabajador</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {workers.map((worker, index) => (
                    <div
                      key={index}
                      className={`flex items-center max-w-full ${!worker.isActive && "bg-muted text-muted-foreground"} justify-between p-4 rounded-lg border`}
                    >
                      <div className="flex min-w-1 items-center space-x-3 ">
                        <Users className="min-w-5 min-h-5 text-muted-foreground" />
                        <span className="block max-w-full min-w-1 overflow-x-auto whitespace-nowrap">
                          {worker.email}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveWorker(worker.email)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Worker Dialog */}
                <dialog id="add-worker" className="z-[100] p-6 rounded-lg shadow-lg bg-card text-card-foreground">
                  <h3 className="text-lg font-medium mb-4">Agregar Trabajador</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${errors.worker?.email && "text-red-500"}`}>
                        Correo del Trabajador
                      </label>
                      <input
                        name="worker_email"
                        type="email"
                        value={newWorker.email}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.worker?.email ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="relative">
                      <div className={`flex items-center gap-3 mb-2 ${errors.worker?.password && "text-red-500"}`}>
                        <label className="block text-sm font-medium">
                          Tu Contraseña
                        </label> 
                       
                      </div>
                      <input
                        type="password"
                        name="worker_password"
                        value={newWorker.password}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.worker?.password ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="Ingresa tu contraseña para confirmar"
                      />
                    </div>
                    {errors.passwordIncorrect &&
                    <div className="text-red-500 flex gap-2 items-center">
                      <CircleAlert className="h-4 w-4"/>
                      <p className="text-sm">La contraseña es incorrecta</p>
                    </div>
                    }
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("add-worker").close()}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddWorker}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        );

      case "subscription":
        if(spinner) {
          return (
          <div className="flex items-center justify-center p-10 ">
            <Spinner className="w-40 h-40"/>
          </div>
        )
      }
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Suscripción</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border 
                    ${plan.id === user.currentPlan ?
                     "border-primary bg-primary/5" : 
                     "border-input"}  h-[350px] flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-3xl font-bold mt-2">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">por mes</p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {user.currentPlan ? (
                    <Button
                      onClick={user.currentPlan === plan.id ? undefined : () => handleSubscribeChange(plan.price_id)}
                      className="w-full mt-auto"
                      variant={user.currentPlan === plan.id ? "outline" : "default"}
                      disabled={user.currentPlan === plan.id} // Optional for UX
                    >
                      {user.currentPlan === plan.id ? "Plan Actual" : "Cambiar Plan"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.price_id)}
                      className="w-full mt-auto"
                      variant="default"
                    >
                      Suscribir
                    </Button>
                  )}

                
                </div>
              ))}
            </div>

            {user.currentPlan && <div className="mt-8">
              { user.planStatus === "canceled" ? (
                  <div>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <span>Suscripción cancelada. El plan terminará al final del mes pagado.</span>
                    </Button>
                  </div>
              ) : (
                <Button
                  variant="destructive"
                  className="flex items-center space-x-2"
                  onClick={()=>{handleCancelSubscription()}}
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar Suscripción</span>
                </Button>

              )}
              
            </div> }
          </div>
        );

      case "gateways":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Metodos de Pago</h2>
            
            <div className="space-y-4">
              <button onClick={()=>{document.getElementById("add-method").showModal()}} className="flex justify-center items-center gap-4 py-3 w-full border rounded-lg border-input hover:bg-accent hovertext-foreground">
                <span>Agregar Metodo</span>
                <CirclePlus strokeWidth={1.5} className="w-5 h-5"/>
                </button>
                {methods && methods.map((method) => (
                  <div key={method._id} className="bg-background border border-input rounded-lg w-full">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted px-4 py-3">
                      <div className="">{method.bank}</div>
                      <div onClick={()=>{removeMethod(method)}} className="bg-red-500 rounded-sm p-2"><Trash2 className="h-4 w-4 text-white"/></div>
                    </div>
                    <div className="flex flex-col gap-5 xs:flex-row justify-between px-4 py-4">
                    {(method.number || method.clabe) && (
                    <div className="flex flex-col gap-3">
                      {method.number &&
                      <div className="flex flex-col gap-1 xs:gap-3 xs:flex-row xs:items-center">
                          <span className="text-muted-foreground">Numero de tarjeta</span>
                          <span>{formatMethodNumber(method.number)}</span>
                        </div>
                      }
                      {method.clabe &&
                        <div className="flex flex-col gap-1 xs:gap-3 xs:flex-row xs:items-center">
                          <span className="text-muted-foreground">Cuenta Clabe</span>
                          <span>{formatCLABE(method.clabe)}</span>
                        </div>
                        }
                      </div>
                     ) }
                      <div className="flex flex-col xs:flex-row xs:items-end justify-between">
                        
                        <div>{method.person}</div>
                      </div>
                    </div>
                  </div>

                ))}
            </div>
            <dialog id="add-method" ref={methodDialogRef} className="w-screen h-screen bg-transparent">
              <div className="flex justify-center items-center w-full h-full">
              <div className="text-foreground bg-background p-6 shadow-lg rounded-lg w-[500px] max-w-[calc(100vw-24px)] ">
                      <h3 className="text-lg font-medium mb-4">Agregar Metodo de Pago</h3>
                      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 mb-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.bank && "text-red-500"}`}>
                            Banco
                          </label>
                          <Select
                              value={newMethod.bank}
                              name="method_bank"
                              onValueChange={(value) => {
                                setNewMethod(prev => ({ ...prev, bank: value }));
                              }}
                            >
                              <SelectTrigger error={errors.method?.bank} className="bg-background text-foreground">
                                <SelectValue placeholder="Selecciona un banco" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="Afirme">Afirme</SelectItem>
                                <SelectItem value="Banco Azteca">Banco Azteca</SelectItem>
                                <SelectItem value="Banco del Bajío">Banco del Bajío</SelectItem>
                                <SelectItem value="BanCoppel">BanCoppel</SelectItem>
                                <SelectItem value="Banorte">Banorte</SelectItem>
                                <SelectItem value="Banregio">Banregio</SelectItem>
                                <SelectItem value="Banca Mifel">Banca Mifel</SelectItem>
                                <SelectItem value="Bansi">Bansi</SelectItem>
                                <SelectItem value="BBVA">BBVA</SelectItem>
                                <SelectItem value="CI Banco">CI Banco</SelectItem>
                                <SelectItem value="Citibanamex">Citibanamex</SelectItem>
                                <SelectItem value="Compartamos Banco">Compartamos Banco</SelectItem>
                                <SelectItem value="Hey Banco">Hey Banco</SelectItem>
                                <SelectItem value="HSBC">HSBC</SelectItem>
                                <SelectItem value="Inbursa">Inbursa</SelectItem>
                                <SelectItem value="Klar">Klar</SelectItem>
                                <SelectItem value="Multiva">Multiva</SelectItem>
                                <SelectItem value="Nu México">Nu México</SelectItem>
                                <SelectItem value="Santander">Santander</SelectItem>
                                <SelectItem value="Scotiabank">Scotiabank</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>

                            {newMethod.bank === 'otro' && (
                              <div className="mt-3 space-y-2">
                                <label className="block text-sm font-medium">Nombre del banco</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={customBank}
                                    onChange={e => setCustomBank(e.target.value)}
                                    placeholder="Escribe el nombre"
                                    className="w-full rounded-md bg-transparent border border-input px-3 py-2 text-sm"
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.person && "text-red-500"}`}>
                            Beneficiario
                          </label>
                          <input
                            name="method_person"
                            type="text"
                            value={newMethod.person}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.person ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="Pedro Carreras"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.number && "text-red-500"}`}>
                            Numero de Cuenta
                          </label>
                          <input
                            name="method_number"
                            type="text"
                            value={formatMethodNumber(newMethod.number)}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.number ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="1111 2222 3333 4444"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.clabe && "text-red-500"}`}>
                            Cuenta Clabe
                          </label>
                          <input
                            name="method_clabe"
                            type="text"
                            value={formatCLABE(newMethod.clabe)}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.clabe ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="002 180 00001183597 9"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                      <label htmlFor="instructions" className={`block text-sm font-medium mb-2 ${errors.method?.instructions && "text-red-500"}`}>
                            Nota (Opcional)
                          </label>
                        <textarea  
                          onChange={handleChange} 
                          name="method_instructions" 
                          value={newMethod.instructions}
                          id="instructions"
                          className={`w-full p-2 rounded-md border ${errors.method?.instructions ? "border-red-500" : "border-input"} bg-background`}
                          ></textarea>
                      </div>
                      <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("add-method").close()}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={addPaymentMethod}>
                            Agregar
                          </Button>
                      </div>
                </div>
              </div>
            </dialog>
          </div>
        );

      case "domains":
        return (
          <div className="space-y-6">
             <dialog id="confirm-d" className="bg-background px-5 py-5 space-y-5 rounded-lg w-[400px] max-w-[calc(100vw-18px)] text-foreground">
                  <div className="text-base">
                      ¿Deseas desconectar tu dominio?
                  </div> 
                    <footer className="flex gap-3">
                    <Button
                            variant="outline"
                            onClick={()=>{document.getElementById("confirm-d").close()}}
                          >Cancelar</Button>
                      <Button
                        variant="destructive"
                        onClick={handleDomainDisconnect}
                        className="flex items-center"
                      >Desconectar</Button>
                    </footer>
                </dialog>
            <h2 className="text-2xl font-semibold">Dominios</h2>
            
            <div className="space-y-4">
              {formData.domain ? (
                <>
                 {formData.domain.status === "verified" ? (
                 <div className="p-6 rounded-lg border border-input">
                  <header className="flex justify-between mb-4">
                    <h3 className="font-medium">Dominio Conectado</h3>
                    <button onClick={()=>{document.getElementById("confirm-d").showModal()}} className="bg-destructive rounded-lg p-1"><X className="w-4 h-4"/></button>
                  </header>
                    <div className="mb-4 text-sm text-muted-foreground">Certificado Activo, ya puedes usar tu dominio.</div>
                  <div className="space-y-4">
                    <div className="relative">
                    <div
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >{formData.domain.domain}</div>
                      <CircleCheck className="w-5 h-5 text-green-500 absolute right-5 top-1/2 -translate-y-1/2"/>
                    </div>
                     <Button onClick={()=>{setFormData(prev => ({...prev, domain: false}))}} className="w-full">Cambiar Dominio</Button> 
                  </div>
                </div>) : (
                  <>
                   <div className="p-6 rounded-lg border border-input">
                        <header className="flex flex-col xxs:flex-row xxs:items-center justify-between gap-3 mb-4 items-left">
                          <h3 className="font-medium">Conectar Dominio</h3>
                          <p onClick={()=>{setFormData(prev => ({...prev, domain: false}))}} className="hover:underline text-sm cursor-pointer xxs:px-3">Cambiar</p>
                        </header>
                        <div className="space-y-4">
                          <div className="relative">
                          <input
                            disabled
                            type="text"
                            value={formData.domain.domain}
                            className="w-full p-2 rounded-md border border-input bg-background"
                          />
                          {errors.domain_verification && <CircleX className="w-5 h-5 text-red-500 absolute right-5 top-1/2 -translate-y-1/2"/>}
                          {successDomain && <CircleCheck className="w-5 h-5 text-green-500 absolute right-5 top-1/2 -translate-y-1/2"/>}
                          </div>
                          <Button onClick={()=>{connectDomainFunc("verify")}} className="w-full">{verifyLoading ? "Verificando..." : "Verificar DNS"}</Button>
      
                        </div>
                    </div>

                  {formData.domain.domainType === "apex" &&
                    <div className="p-4 bg-background border rounded mt-6">
                        <h2 className="text-base font-medium mb-2">Configura tu DNS:</h2>
                        <div className="space-y-1 text-sm">
                          <p><strong>ANAME o ALIAS</strong> </p>
                        <p> Agrega un registro ANAME o ALIAS apuntando a <code className="bg-muted p-0.5">rifaez.onrender.com</code></p>
                        </div>
                        <div className="space-y-1 mt-4 text-sm">
                          <p><strong>A</strong> </p>
                        <p> Agrega un registro A apuntando a <code className="bg-muted p-0.5">216.24.57.1</code></p>
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground">
                          Agrega este registro en el panel DNS de tu proveedor (como GoDaddy, Namecheap o Cloudflare).
                          Esto permitirá que tu dominio apunte correctamente a nuestra plataforma. Si ya lo hiciste, puedes proceder con la verificación.
                        </p>
                  </div>
                  }
                  {formData.domain.domainType === "subdomain" &&
                     <div className="p-4 bg-background border rounded mt-6">
                        <h2 className="text-base font-medium mb-2">Configura tu DNS:</h2>
                        <div className="space-y-1 text-sm">
                          <p><strong>CNAME</strong> </p>
                        <p> Agrega un registro CNAME apuntando a <code className="bg-muted p-0.5">rifaez.onrender.com</code></p>
                        </div>
    
                        <p className="mt-4 text-sm text-muted-foreground">
                          Agrega este registro en el panel DNS de tu proveedor (como GoDaddy, Namecheap o Cloudflare).
                          Esto permitirá que tu dominio apunte correctamente a nuestra plataforma. Si ya lo hiciste, puedes proceder con la verificación.
                        </p>
                   </div>
                  }
                  </>
                )}
                </>
              ) : (
               
                  <div className="p-6 rounded-lg border border-input">
                  {spinnerDomain ? (
                        <Spinner className="w-20 h-20 mx-auto" />
                    ) : (
                      <>
                        <h3 className="font-medium mb-4">Conectar Dominio</h3>
                        <div className="space-y-4">
                          <div className="relative">
                          <input
                            type="text"
                            value={domainV}
                            onChange={handleDomainChange}
                            placeholder="ejemplo.com"
                            className="w-full p-2 rounded-md border border-input bg-background"
                          />
                          </div>
                          <Button onClick={()=>{connectDomainFunc("create")}} className="w-full">Conectar Dominio</Button> 
                          {domainError && 
                              <div className="text-destructive">{domainError}</div>
                          }
      
                        </div>
                        </>
                      )}
                     </div>
              
            )}
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Apariencia</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-lg border ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Sun className="w-6 h-6 mb-2" />
                    <span>Claro</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-lg border ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>


            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const menuItems = [
    { id: "account", icon: <User />, label: "Cuenta" },
    { id: "company", icon: <Building2 />, label: "Empresa" },
    { id: "subscription", icon: <CreditCard />, label: "Suscripción" },
    { id: "gateways", icon: <PaymentIcon />, label: "Metodos de Pago" },
    { id: "domains", icon: <Globe />, label: "Dominios" },
    { id: "appearance", icon: <Palette />, label: "Apariencia" }
  ];

  useEffect(() => {
    if (user?.asWorker) {
      setActiveSection("appearance");
    }
  }, [user?.asWorker]);

  if(user.asWorker){
    return (
      <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground">Configuración</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Administra tu cuenta y preferencias
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="gap-2 flex flex-col"
        >
            <button
              key="appearance"
              onClick={() => setActiveSection("appearance")}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                activeSection === "appearance"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette />
              <span>Apariencia</span>
            </button>
           
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
           <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Apariencia</h2>
              <Button 
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Button>
            </header>

            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-lg border ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Sun className="w-6 h-6 mb-2" />
                    <span>Claro</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-lg border ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>


            </div>
          </div>
        </motion.div>
      </div>
    </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Configuración</h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2">
          Administra tu cuenta y preferencias
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="gap-2 flex flex-col"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
           
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          {renderContent()}
          <footer className="flex flex-col xs:items-center gap-3 mt-10 justify-between xs:flex-row-reverse">
            
          <button
              key="save"
              onClick={saveSettings}
              className=" flex w-fit items-center px-4 py-2 space-x-2 text-base rounded-lg transition-colors bg-primary text-primary-foreground "
            >
            { loading || successMessage ? (<span>{successMessage || "Loading..."}</span>) : 
              (
                <>
                  <Save stroke="currentColor" className="h-5 w-5" />
                  <span>Guardar</span>
                </>
              )
            }
            </button>
            {activeSection === "account" &&
            <>
                <button
                  key="delete"
                  onClick={()=>{document.getElementById("confirm-deletion").showModal()}}
                  className="flex w-fit items-center px-4 py-2 space-x-2 text-base rounded-lg transition-colors bg-destructive text-destructive-foreground "
                >
                      <X stroke="currentColor" className="h-5 w-5" />
                      <span>Borrar Cuenta</span>
                </button>
                <dialog id="confirm-deletion" className="bg-background px-5 py-5 space-y-7 rounded-lg w-[400px] max-w-[calc(100vw-18px)] text-foreground">
                  <div className="text-base">
                      ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
                  </div> 
                    <footer className="flex gap-3  justify-end">
                    <Button
                            variant="outline"
                            onClick={()=>{document.getElementById("confirm-deletion").close()}}
                          >Cancelar</Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="flex items-center"
                      >Borrar</Button>
                    </footer>
                </dialog>
                </>
            }
            </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
