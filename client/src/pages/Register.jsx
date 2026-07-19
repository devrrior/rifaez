
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Lock, Unlock, AlertCircle, X } from "lucide-react";
// import { errorMonitor } from "events";

const RegisterPage = () => {
  const { register} = useAuth();
  const [message, setMessage] = useState({message: null, status: null})
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLocked, setLock] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorData, setError] = useState({name: null, email: null, password: null, confirmPassword: null})

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function checkPassword(password){
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber;
  }
  const [wasBlurred, setBlur] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const fieldLabels = {
    name: "Nombre no debe estar vacío.",
    email: "Correo no debe estar vacío.",
    password: "Contraseña no debe estar vacío.",
    confirmPassword: "confirmPassword no debe estar vacío."
  };
  const disappear = () => {
    setMessage({message: null, status: null});
  }
  const toggleLock = () => {
    setLock(prev => !prev)
  }
  const isInputValid = (name, value) => {
    let isValidForm = true
    if(value == ""){
      setError(prev => ({ ...prev, [name]: fieldLabels[name] }))
      isValidForm = false
    } else if(name === "email" && !isValidEmail(value)) {
      setError(prev => ({...prev, email: "El correo es invalido."}));
      isValidForm = false
    } else if(name === "password" && !checkPassword(value)) {
      setError(prev => ({...prev, password: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número."}));
      isValidForm = false
    } else if(name === "confirmPassword" && value !== formData.password){
      setError(prev => ({...prev, confirmPassword: "Las contraseñas no coinciden."}));
      isValidForm = false
    }
    if(isValidForm) setError(prev => ({...prev, [name]: null}));
    return isValidForm
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(wasBlurred[name]){
      isInputValid(name, value)
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e) => {
    setBlur(prev => ({...prev, [e.target.name]: true}));
    const { name, value } = e.target;
    isInputValid(name, value)
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValidForm = true
    for (const name in formData) {
      const value = formData[name];
      if(!isInputValid(name, value)){
        isValidForm = false
      }
    }
    setBlur(prev =>
      Object.fromEntries(
        Object.keys(prev).map(key => [key, true])
      )
    );
   if(isValidForm){
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    if(res.status === 400){
      setErrorMessage(res.message)
    }
  }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg relative"
      >
      {message.status && (
  <div className={`absolute flex items-center justify-between top-[-40px] left-0 w-full py-2 px-3 ${message.status === 400 ? "bg-red-500" : "bg-green-500"} shadow-sm rounded text-white text-sm`}>
    <span>{message.message}</span>
    <X className="h-[20px] cursor-pointer" onClick={disappear} />
  </div>
)}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Crear Cuenta</h2>
          <p className="mt-2 text-muted-foreground">
            Regístrate para comenzar
          </p>
        </div>

        <form  noValidate onSubmit={handleSubmit} className="">
          <div className="min-h-[94px]">
            <label className="block text-sm font-medium mb-2">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 p-2 rounded-md border ${errorData.name ? "border-red-500" : "border-input"} bg-background`}
                placeholder="Tu nombre"
                onBlur={handleBlur}
              />
            </div>
            
            { errorData.name && 
            <div className="pt-2 pb-3 flex items-center text-xs font-regular text-red-600 gap-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{errorData.name}</span>
            </div>
            }
            
          </div>

          <div className="min-h-[94px]">
            <label className="block text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 p-2 rounded-md border ${errorData.email ? "border-red-500" : "border-input"} bg-background`}
                placeholder="correo@ejemplo.com"
                onBlur={handleBlur}
              />
            </div>
            { errorData.email && 
            <div className="pt-2 pb-3 flex items-center text-xs font-regular text-red-600 gap-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{errorData.email}</span>
            </div>
            }
          </div>

          <div className="min-h-[94px]">
            <label className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <div className="relative">
              {isLocked ? 
              <Lock onClick={toggleLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              : <Unlock onClick={toggleLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              }
              <input
                type={!isLocked ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 p-2 rounded-md border ${errorData.password ? "border-red-500" : "border-input"} bg-background`}
                placeholder="••••••••"
                onBlur={handleBlur}
              />
            </div>
            { errorData.password && 
            <div className="pt-2 pb-3 flex items-center text-xs font-regular text-red-600 gap-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{errorData.password}</span>
            </div>
            }
          </div>

          <div className="min-h-[94px]">
            <label className="block text-sm font-medium mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
            {isLocked ? 
              <Lock onClick={toggleLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              : <Unlock onClick={toggleLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              }
              <input
                type={!isLocked ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 p-2 rounded-md border ${errorData.confirmPassword ? "border-red-500" : "border-input"} bg-background`}
                placeholder="••••••••"
                onBlur={handleBlur}
              />
            </div>
            { errorData.confirmPassword && 
            <div className="pt-2 pb-3 flex items-center text-xs font-regular text-red-600 gap-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{errorData.confirmPassword}</span>
            </div>
            }
          </div>
          {errorMessage &&
            <div className="mb-3 flex items-center text-xs font-regular text-red-600 gap-2">
              <AlertCircle className="w-5 h-5"/>
              {errorMessage}
            </div>
          }

          <Button type="submit" className="w-full">
            Registrarse
          </Button>
        </form>

        <p className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
