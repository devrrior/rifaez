
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Facebook, Mail, Lock, Unlock, AlertCircle, CircleX, Check } from "lucide-react";
import Spinner from "../components/spinner";
import { emailSchema } from "../validation/userSchema";
// import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {

  const { login, setUser, setAppError, linkAccount, sendRecoveryEmail } = useAuth();
  const navigate = useNavigate()
  
  const [loginError, setLoginError] = useState(null)
  const [linkAccountData, setLinkAccountData] = useState({})
  const [recoveryForm, setRecoveryForm] = useState(null)
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [isLocked, setLock] = useState(true)
  const [errors, setErrors] = useState({})
  const [spinner, setSpinner] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we would validate credentials with backend
    const data = await login({
      username: formData.email,
      password: formData.password
    });
    if(data){
      setLoginError(data.message)
    }
  };

  const funcLinkAccount = () => {
    linkAccount(linkAccountData.email, linkAccountData.facebookId)
  }
  const handleRecChange = (e) => {
    setRecoveryEmail(e.target.value)
  }
  const sendEmailRecovery = async () => {
    setWasSubmitted(true)
    const {error, value} = emailSchema.validate(recoveryEmail);
    if(error){
      return setErrors(prev => ({...prev, recovery_email: error.message}))
    }
    setSpinner(true)
    const res = await sendRecoveryEmail(value)
    if(res.data.status === 200){
      setRecoveryForm({response: "success"})
      setSpinner(false)
    } else {
      setRecoveryForm({response: "unsuccessful"})
      setSpinner(false)
    }
  }

  useEffect(()=>{
    if(wasSubmitted){
      const {error} = emailSchema.validate(recoveryEmail);
      if(error){
        setErrors(prev => ({...prev, recovery_email: error.message}))
      } else {
        setErrors(prev => ({...prev, recovery_email: undefined}))
      }
    }
  }, [recoveryEmail])

  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log('Facebook login response:', response);

          window.FB.api('/me', { fields: 'name,email' }, function(userInfo) {

            // Send to server
            fetch(`${import.meta.env.VITE_CURRENT_HOST}/auth/facebook/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID,
                name: userInfo.name,
                email: userInfo.email
              })
            })
              .then(res => res.json())
              .then(data => {
                console.log('Server response:', data);
                if(data.status === 200){
                  setUser(data.user)
                  return navigate("/raffle-admin")
                } else if (data.status === 409){
                  document.getElementById("link-account").showModal();
                  setLinkAccountData({
                    email: data.email,
                    facebookId: data.facebookId,
                  })
                } else {
                  setAppError(true)
                }
              });
          });
        } else {
          console.warn('User cancelled login or did not authorize');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg"
      > 
      {recoveryForm ? (
        <div className="space-y-8">
          {spinner ? (
            <div className="w-full h-40 flex justify-center items-center">
              <Spinner className="w-24 h-24"/>
            </div>
          ) : (
          <>
          {recoveryForm.response ? (
            <>
            {recoveryForm.response === "success" && (
              <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>   
                  <h1 className="text-lg">Correo enviado al: {recoveryEmail}</h1>  
                  <p className="text-muted-foreground">Ingrese a su correo dale click al enlace y siga los pasos desde ahi.</p>                       
              </div>
            )}
            {recoveryForm.response === "unsuccessful" && (
              <div className="flex flex-col items-center gap-6">
                <div className="bg-red-200 h-14 w-14 rounded-full flex items-center justify-center">
                  <CircleX className="h-10 w-10 text-red-500"/>
                </div>
                <h1 className="text-center text-xl">Error el correo que proporcionaste no esta relacionada a una cuenta.</h1>
                <button onClick={()=>{setRecoveryForm(true)}} className="bg-red-500 rounded-lg px-4 py-2 text-primary-foreground">Regresar</button>
              </div>
            )}
            </>
          ) :(
          <div className="space-y-6">
          <div>
            <h1 className="text-center text-2xl font-medium">Recuperar Contraseña</h1>
          </div>
          <div className="space-y-3">
            <label htmlFor="email_recovery" className={`text-sm font-medium ${errors.recovery_email && "text-red-500"}`}>Correo Electronico</label>
            <input onChange={handleRecChange} value={recoveryEmail} type="text" id="email_recovery" className={`w-full text-base px-4 py-2 rounded-xl bg-background border ${errors.recovery_email ? "border-red-500" : "border-input"}`} />
          </div>
          <button onClick={sendEmailRecovery} className="w-full bg-primary py-3 text-base rounded-lg text-center text-primary-foreground" >Recuperar</button>
          </div>
          )}
          </>)}
        </div> ) : (
        <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
              <p className="mt-2 text-muted-foreground">
                Accede a tu cuenta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
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
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <label className="block  font-medium mb-2">
                    Contraseña
                  </label>
                  <span onClick={()=>{setRecoveryForm(true)}} className="text-primary cursor-pointer hover:decoration-solid hover:underline">
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <div className="relative">
                  { isLocked ?
                  <Lock onClick={()=> setLock(prev => !prev)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" /> :
                  <Unlock onClick={()=> setLock(prev => !prev)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  }
                  <input
                    type={isLocked ? "password" : "text"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              { !loginError ? '' :
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle stroke="red" className="h-4 w-4"/>
                <span>El correo electrónico o la contraseña son incorrectos.</span>
              </div>
              }
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <dialog id="link-account" className="w-screen h-screen bg-transparent">
              <div className="h-full w-full flex items-center justify-center px-8">
                <div className="max-w-full w-[400px] bg-background p-6 space-y-6 rounded-lg">
                  <div className="space-y-4">
                    <h1 className="text-lg">Tienes una cuenta registrada a este correo desea vincular?</h1>
                    <div className="flex flex-col">
                    <span className="text-muted-foreground">Correo Electronico: {linkAccountData.email}</span>
                    </div>
                  </div>
                  <footer className="flex gap-3 items-center">
                    <Button
                      variant="outline"
                      onClick={()=>{document.getElementById("link-account").close()}}
                    >Cancelar</Button>
                    <Button onClick={funcLinkAccount}>
                      Vincular
                    </Button>
                  </footer>
                  </div>
              </div>
            </dialog>
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center space-x-2"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </Button>

              {/* <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  toast({
                    title: "Error",
                    description: "Error al iniciar sesión con Google",
                    variant: "destructive"
                  });
                }}
              /> */}
            </div>

            <p className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>

            
        </div> )}
        
      </motion.div>
    </div>
  );
};

export default LoginPage;
