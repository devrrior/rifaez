

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { methodSchema } from '../validation/raffleSchemaValidate';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { joiResolver } from '@hookform/resolvers/joi';
import bankLogos from '../seed/bankLogo';

const methods = {
    basic: 3,
    pro: 10,
    business: 15,
  }


const PaymentMethod = ({ setCurrentStep, mainPublishRaffle, formData, setFormData}) => {
  const { user } = useAuth()
  const {register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm({
    resolver: joiResolver(methodSchema)
  })
  const initialMethods = user.payment_methods?.map(method => ({...method, enabled: formData.paymentMethods.find(pMethod => pMethod._id === method._id) ? true : false, url: bankLogos[method.bank] || "/Banks/bank.svg"}))
  const [paymentMethods, setPaymentMethods] = useState(initialMethods);
  const [customBank, setCustomBank] = useState("")
  const [methodError, setMethodError] = useState(false)
  const [enableCheck, setEnableCheck] = useState(false)
  const [other, setOther] = useState(false)

  const togglePaymentMethod = (methodId) => {
    setPaymentMethods(prev => {
      for (const method of prev) {
        if(method._id === methodId){
          if(method.enabled){
            return prev.map(method => method._id === methodId ? {...method, enabled: false} : {...method})
          }
        }
       }
          const amountEnabled = prev.filter(method => method.enabled)
          const currAll = methods[user.currentPlan] || 3
          if(amountEnabled.length >= currAll){
            return prev.map(method => {
              if(method._id === amountEnabled[0]._id){
                return {...method, enabled: false}
              }
              if(method._id === methodId){
                return {...method, enabled: true}
              }
              return method
            } )
          } else {
            return prev.map(method => method._id === methodId ? {...method, enabled: true} : {...method})
          }
        } 
    );
    
  };

  useEffect(()=>{
    const filteredMethods = paymentMethods.filter(method => method.enabled)
    setFormData(prev => ({...prev, paymentMethods: filteredMethods.map(({ url, ...rest }) => rest)}))
    if(enableCheck){
        const enabledMethods = paymentMethods.filter(method => method.enabled)
        if(enabledMethods.length > 0 && enabledMethods.length <= (methods[user.currentPlan])){
           setMethodError(false)
        } else {
            setMethodError(true)
        }
    }
  }, [paymentMethods])

  const addPaymentMethod = (values) => {
    const id = Math.random().toString(36).substring(2, 10);
    setPaymentMethods(prev => [...prev, {...values, _id: id, enabled: false, url: bankLogos[values.bank] || "/Banks/bank.svg"}])
    document.getElementById("add-method").close()
  };

  const openMethodDialog = () => {
    document.getElementById("add-method").showModal()
  }

  const publishRaffle = () => {
    const enabledMethods = paymentMethods.filter(method => method.enabled)
    if(enabledMethods.length > 0 && enabledMethods.length <= (methods[user.currentPlan])){
        mainPublishRaffle()
    } else {
        setMethodError(true)
        setEnableCheck(true)
    }
  };

  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '').slice(0, 16);
  
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


  const handlePrevious = () => {
    setCurrentStep(2)
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
        <dialog id="add-method" className="w-screen h-screen bg-transparent">
            <div className="flex justify-center items-center w-full h-full">
            <form onSubmit={handleSubmit(addPaymentMethod)} className="text-foreground bg-background p-6 shadow-lg rounded-lg w-[500px] max-w-[calc(100vw-24px)] ">
                    <h3 className="text-lg font-medium mb-4">Agregar Metodo de Pago</h3>
                    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 mb-4">
                    <div className='space-y-2'>
                        <Label htmlFor="bank" error={errors.bank} className="">
                            Banco
                        </Label>
                        <Controller
                            name="bank"
                            control={control}
                            render={({ field }) => (
                              <div className='space-y-2'>
                                <Select
                                    value={other ? "otro" : field.value}
                                    onValueChange={(value) => {
                                      console.log(value)
                                      if(value === "otro"){
                                        field.onChange("")
                                        setOther(true)
                                      } else {
                                        setOther(false)
                                        field.onChange(value)
                                      }
                                    }}
                                  >
                                <SelectTrigger error={errors.bank} className="bg-background text-foreground">
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
                              {other && (
                              <div className="mt-3 space-y-2">
                                <label className="block text-sm font-medium">Nombre del banco</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e)=>{field.onChange(e.target.value)}}
                                    placeholder="Escribe el nombre"
                                    className="w-full rounded-md bg-transparent border border-input px-3 py-2 text-sm"
                                  />
                                </div>
                              </div>
                            )}
                              </div>
                            )}
                          />
                        

                            
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="person" error={errors.person} className="">
                            Beneficiario
                        </Label>
                        <Input
                            id="person"
                            type="text"
                            placeholder="Pedro Carreras"
                            className="bg-background text-foreground placeholder:text-gray-400"
                            {...register('person')}
                            error={errors.person}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="number" error={errors.number} className="">
                            Numero de Cuenta
                        </Label>
                        <Controller
                            name="number"
                            control={control}
                            render={({ field }) => (
                              <Input
                                  id="number"
                                  type="text"
                                  placeholder="1111 2222 3333 4444"
                                  className="bg-background text-foreground placeholder:text-gray-400"
                                  value={formatMethodNumber(field.value)}
                                  onChange={(e) => {
                                    const methodNumber = formatMethodNumber(e.target.value)
                                    const noSpaces = methodNumber.replace(/\s+/g, '');
                                    field.onChange(noSpaces);
                                  }}
                                  error={errors.number}
                              />
                            )}
                        />
                        
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="clabe" error={errors.clabe} className="">
                            Cuenta Clabe
                        </Label>
                        <Controller
                            name="clabe"
                            control={control}
                            render={({ field }) => (
                              <Input
                                  id="clabe"
                                  type="text"
                                  placeholder="002 180 00001183597 9"
                                  className="bg-background text-foreground placeholder:text-gray-400"
                                  value={formatCLABE(field.value)}
                                  onChange={(e) => {
                                    const CLABE = formatCLABE(e.target.value)
                                    const noSpaces = CLABE.replace(/\s+/g, '');
                                    field.onChange(noSpaces);
                                  }}
                                  error={errors.clabe}
                              />
                            )}
                        />
                    </div>
                    </div>
                    <div className="mb-4 space-y-2">
                        <Label htmlFor="instructions" error={errors.instructions} className="">
                            Nota (Opcional)
                        </Label>
                        <Textarea
                            id="instructions"
                            placeholder="Usar clabe"
                            className="bg-background text-foreground placeholder:text-gray-400"
                            {...register('instructions')}
                            error={errors.instructions}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("add-method").close()}
                        >
                        Cancelar
                        </Button>
                        <Button 
                            type="submit"
                        >
                        
                        Agregar
                        </Button>
                    </div>
            </form>
            </div>
        </dialog>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Crear Nueva Rifa</h1>
          <p className="text-foreground">Paso 3: Configura los métodos de pago</p>
          
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">1</div>
            <div className="w-24 h-1 bg-primary"></div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">2</div>
            <div className="w-24 h-1 bg-primary"></div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">3</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-8 border border-border shadow-lg"
        >
        <header className='mb-6 space-y-3'>
            <h2 className="text-2xl font-bold text-foreground">Método de Pagos</h2>
            <p className={`${methodError ? "text-red-500" : "text-muted-foreground"}`}>Deberas elegir un metodo de pago. Maximo ({methods[user.currentPlan] || 3})</p>
          </header>
          <div className="space-y-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-lg p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className='flex gap-2 items-center'>
                        <div className="w-12 overflow-hidden bg-white h-8 rounded flex items-center justify-center">
                        <img src={method.url} alt="" />
                        </div>
                        <span className=''>{method.bank}</span>
                    </div>
                    
                  </div>
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={() => togglePaymentMethod(method._id)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-3'>
                    {method.number && 
                    <div className='space-y-1'>
                        <p className="text-foreground font-medium">Número de tarjeta</p>
                        <p className="text-muted-foreground text-sm">{method.number}</p>
                    </div>
                    }
                    {method.clabe && 
                    <div className='space-y-1'>
                        <p className="text-foreground text-sm">Cuenta Clabe</p>
                        <p className="text-muted-foreground">{method.clabe}</p>
                    </div>
                    }
                  </div>
                  <div className="text-right flex md:items-end md:justify-end">
                    <p className="text-foreground font-medium">{method.person}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={openMethodDialog}
                variant="outline"
                className="w-full bg-background border-border text-foreground hover:bg-muted border-dashed py-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Método
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="bg-card border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={publishRaffle}
              className="bg-primary hover:bg-[#3573d9] text-primary-foreground px-8"
            >
              Publicar Rifa
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethod;