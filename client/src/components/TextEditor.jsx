import "quill/dist/quill.snow.css";
import React, { useState, useRef, useEffect } from "react";
import Quill from 'quill';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Type,
  Palette,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Editor from "./Editor";

const options = {
    debug: 'info',
    modules: {
      toolbar: [],
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  };

const TextEditor = ({ setCurrentStep, formData, setFormData }) => {
  const [value, setValue] = useState(formData.textHtml)
  const [textError, setTextError] = useState(false)
  const editorRef = useRef(null);




  const handleNext = () => {
    if(value){
      setFormData(prev => ({...prev, textHtml: value}))
      setCurrentStep(3)
    } else {
      setTextError(true)
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1)
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Editor de Texto
          </h1>
          <p className="text-foreground">
            Paso 2: Crea y formatea tu contenido
          </p>

          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              1
            </div>
            <div className="w-24 h-1 bg-primary"></div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              2
            </div>
            <div className="w-24 h-1 bg-primary"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              3
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
        >
          
        <Editor
            value={value}
            setValue={setValue}
            textError={textError}
            ref={editorRef}
       />

     

          <div className="flex justify-between mt-6">
            <Button
                onClick={handlePrevious}
                variant="outline"
                className="bg-card border-border text-card-foreground hover:bg-muted"
            >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-[#3573d9] text-primary-foreground px-6 py-2"
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>

   
    </div>
  );
};

export default TextEditor;
