import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import NotFoundPage from "../AppNotFound";
import Spinner from "../components/spinner";
import { Lock, Unlock, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { passwordSchema } from "../validation/userSchema";
const api = axios.create({
    baseURL: import.meta.env.VITE_CURRENT_HOST,
    withCredentials: true, // same as fetch's credentials: 'include'
  });

export default function RecoverPass(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [seeForm, setSeeForm] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { setAppError, setUser } = useAuth()
    const [isLocked, setIsLocked] = useState(true)
    const [token, setToken] = useState(null)
    const [errorData, setErrors] = useState({})
    const [wasBlurred, setBlur] = useState({
        password: false,
        confirmPassword: false
      });
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const toggleLock = () => {
        setIsLocked(prev => !prev)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleBlur = (e) => {
        setBlur(prev => ({...prev, [e.target.name]: true}));
    }

    const validateForm = () => {
        let newObj = {}
        if(wasBlurred.confirmPassword){
            if(formData.confirmPassword !== formData.password){
                newObj.confirmPassword =  "Las contraseñas no coinciden."
            } 
        } 
        if(wasBlurred.password) {
            const {error} = passwordSchema.validate(formData.password)
            if(error){
                newObj.password =  error.message
            }
        }
        setErrors(newObj)
        return !(Object.keys(newObj).length > 0);
    }

    const submitChangePassword = async () => {
        const isValid = validateForm();
        if(isValid){
            if(token){
                try {
                    setLoading(true)
                    const res = await api.post("/auth/reset-password", {token, password: formData.password})
                    if(res.data.status === 200){
                        setLoading(false)
                        setUser(res.data.user)
                        navigate("/raffle-admin")
                    } else {
                        setAppError(truw)
                    }
                } catch (error) {
                    setAppError(error)
                }
            }
        }
    }

    useEffect(()=>{
        validateForm()
    }, [formData, wasBlurred])

      

    useEffect(()=>{
        const token = searchParams.get('token'); 
        if(token){
            setLoading(true)
            const verifyToken = async () => {
                try {
                    const res = await api.get(`/auth/verify-token?token=${token}`)
                    if(res.data.status == 200){
                        setToken(token)
                        setSeeForm(true)
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    setAppError(error)
                }
            }
            verifyToken()
        } 
    }, [])
    
    if(loading) return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Spinner className="w-40 h-40"/>
        </div>
    );
    if(!seeForm) return <NotFoundPage/>;
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="shadow-lg bg-card rounded-lg p-5 w-[400px] max-w-[calc(100vw-24px)]">
                <h1 className="text-xl mb-5">Cambiar Contraseña</h1>
                
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
        <button onClick={submitChangePassword} className="bg-primary text-primary-foreground text-sm rounded-md px-3 py-2">
            Cambiar Contraseña
        </button>
            </div>
        </div>
    )
}