import {useRef} from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Settings, Files } from 'lucide-react';
import { Controller } from 'react-hook-form';

const RaffleConfig = ({ errors, register, setFiles, control, setPreviews }) => {
  const dateRef = useRef(null)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 border-b pb-4">Configuración de Rifa</h2>
      <div className="space-y-4">
        <div className='space-y-2'>
          <Label htmlFor="endDate" error={errors.endDate}>Fecha de rifa</Label>
          <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <div
                  className="relative"
                  onClick={() => dateRef.current?.showPicker?.()}
                >
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    {...field}
                    id="endDate"
                    type="date"
                    ref={(el) => {
                      field.ref(el);
                      dateRef.current = el;
                    }}
                    error={errors.endDate}
                    className="bg-background text-foreground pl-10"
                  />
                </div>
              )}
            />
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor="paymentLimit" error={errors.timeLimitPay}>Tiempo límite para pago (días)</Label>
          <div className="relative">
            <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="paymentLimit"
              type="number"
              placeholder="1"
              error={errors.timeLimitPay}
              {...register("timeLimitPay")}
              className="bg-background text-foreground placeholder:text-gray-400 pl-10"
            />
          </div>
        </div>
        
        <div className='space-y-2 text-card-foreground'>
              <Label htmlFor="files" error={errors.fileCounter}>
                  Imagenes Max (10) 
                </Label>
                <Controller
                    name="fileCounter"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <input id="fileCounter" accept="image/*" type="file" max="10" name="fileCounter" onChange={(e) => {
                              let { files } = e.target;
                              const limitedFiles = files.length > 10 ? Array.from(files).slice(0, 10) : Array.from(files);
                              const objectUrls = limitedFiles.map(file => URL.createObjectURL(file));
                              field.onChange(limitedFiles.length)
                              setPreviews(objectUrls);
                              setFiles(limitedFiles);
                            }}
                             multiple
                              className="opacity-0 w-full pl-10 p-2 rounded-md border bg-background"/>
                        <div className={`flex items-center  absolute left-0 top-0 w-full h-full rounded-md border ${errors.fileCounter ? "border-red-500" : "border-input"} bg-background`}>
                          <Files className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                          <label htmlFor="fileCounter" className="pl-10 p-2 text-gray-600 w-full">{field.value && field.value > 0 ? `${field.value} archivo(s)` : "Escoge Archivo"}</label>
                        </div>
                      </div>
                    )}
                  />
              </div>
        
        <div className='space-y-2'>
          <Label htmlFor="additionalInfo" error={errors.extraInfo}>Información Adicional (Opcional)</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Información adicional..."
            error={errors.extraInfo}
            {...register("extraInfo")}
            className="bg-background text-foreground placeholder:text-gray-400 min-h-[120px]"
          />
          <p className="text-gray-500 text-sm mt-1">Max 500 caracteres</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleConfig;