import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, useRef } from 'react';
import { getImagesFromIndexedDB } from '../lib/indexedDBHelpers';
import Logo from '../Logo';
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/spinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const CheckoutForm = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState(null);
  const priceId = searchParams.get("price_id")
  const fetchClientSecret = useCallback(async () => {
    const res = await api.post('/stripe/create-checkout-session', {priceId, customerEmail: user.username}, { withCredentials: true });
    return res.data.clientSecret;
  }, [priceId]);

  const loadCheckout = useCallback(async () => {
    const secret = await fetchClientSecret();
    setClientSecret(secret);
  }, [fetchClientSecret]);

  useEffect(() => {
    if(priceId){
      loadCheckout();
    }
  }, [priceId, loadCheckout]);


  return (
    <div style={{ padding: '2rem' }}>
      <header className='mx-auto w-fit mb-10'>
        <Link to="/raffle-admin">
          <Logo className='w-10 h-10'/>
        </Link>
      </header>
      {clientSecret && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

export const Return = ({setUserJustCreated}) => {
  const navigate = useNavigate()
  const { setAppError, setUser } = useAuth()
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const redirectUrl = searchParams.get("redirect_url");
  const frontUrl = searchParams.get("front_url");
  const [spinner, setSpinner] = useState(null)
  const [checkoutStatus, setCheckoutStatus] = useState(null)
  const hasRun = useRef(false);
  useEffect(() => {
    if (!sessionId || hasRun.current) return;
    hasRun.current = true;
      const fetchStatus = async () => {
        try {
          
          const res = await api.get(`/stripe/session-status?session_id=${sessionId}`, { withCredentials: true });
          setSpinner(true)
          if(redirectUrl && (res.data.status === "complete")){
            const savedForm = sessionStorage.getItem("pendingRaffleForm");
            console.log("s", savedForm)
            if (savedForm) {
              const parsed = JSON.parse(savedForm);
              const savedImages = await getImagesFromIndexedDB();

              const restoredFormData = new FormData();
              Object.entries(parsed).forEach(([key, value]) => {
                restoredFormData.append(key, value);
              });
              savedImages.forEach((file) => restoredFormData.append("images", file));
              try {
                const res = await api.post(redirectUrl, restoredFormData, { withCredentials: true });
                setUserJustCreated(true)
                setUser(res.data.user)
                return navigate(`${frontUrl}?success=true&link=${res.data.link}`)
              } catch (error) {
                setAppError(error)
              } 
            }
        } 
        setSpinner(false)
        navigate('/raffle-admin')

        } catch (error) {
          setAppError(error)
        } 
      }
      fetchStatus();
    
  }, [sessionId]);

 
  if(spinner) return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <Spinner className="w-40 h-40"/>
    </div>
  );
  if(!checkoutStatus) return null;

  return(
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='bg-card shadow-lg px-5 py-5 flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
          <span className='w-16'>Email</span>
          <span>{checkoutStatus.customer_email}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='w-16'>Plan Name</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='w-16'>Status</span>
          <span>{checkoutStatus.status}</span>
        </div>
      </div>
    </div>
  )
}