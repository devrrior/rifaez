import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from "react-hook-form"
import { firstStepValidationSchema } from '../validation/raffleSchemaValidate';
import BasicInfo from '@/components/raffle-creator/BasicInfo';
import RaffleDetails from '@/components/raffle-creator/RaffleDetails';
import PageDesign from '@/components/raffle-creator/PageDesign';
import RaffleConfig from '@/components/raffle-creator/RaffleConfig';
import RafflePreview from '@/components/raffle-creator/RafflePreview';
import { useAuth } from '../contexts/AuthContext';

const RaffleCreator = ({ setCurrentStep, formData, setFormData, setFiles }) => {
  const { user} = useAuth()
  console.log(user)
    const { paymentMethods, textHtml, ...formDataWithoutPaymentMethods } = formData;
    const [previews, setPreviews] = useState([])
  const {register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm({
    resolver: joiResolver(firstStepValidationSchema),
    defaultValues: formDataWithoutPaymentMethods
  })
  const hookFormData = watch()

  
//   const [errors, setErrors] = useState({})


  const handleNext = (values) => {
    setFormData(prev => ({...prev, ...values}))
    setCurrentStep(2)
  };

  const onError = (errors) => {
    console.log("❌ Form errors:", errors);
  };



  return (
    <div className="min-h-screen bg-background py-6 px-2 text-gray-800">

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Crear Nueva Rifa</h1>
          <p className="text-muted-foreground">Paso 1: Configura los detalles de tu rifa</p>
          
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">1</div>
            <div className="w-24 h-1 bg-primary"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">2</div>
            <div className="w-24 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">3</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-lg h-full"
              onSubmit={handleSubmit(handleNext, onError)}
            >
              <div className="space-y-12">
                <BasicInfo register={register} errors={errors} />
                <RaffleDetails control={control} watch={watch} errors={errors} register={register}  />
                <PageDesign setValue={setValue} errors={errors} control={control} />
                <RaffleConfig setPreviews={setPreviews} errors={errors} register={register} setFiles={setFiles} control={control} />
              </div>

              <div className="flex mt-12 pt-8 border-t border-border">
                
                <Button
                  type="submit"
                  className="bg-primary hover:bg-[#3573d9] text-primary-foreground px-6"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-6 h-fit"
            >
                <div className="aspect-[9/16] max-h-[700px]">
                    <RafflePreview phone={user.phone} logo={user.logo} verified={user.verified} previews={previews} hookFormData={hookFormData} formData={formData} />
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RaffleCreator;