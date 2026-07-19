import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as LinkIcon, Palette, Pipette} from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label"
import { HexColorPicker } from 'react-colorful';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/styles/editor.css"

const toolbarOptions = [
    ['bold', 'italic', 'underline'], 
    ['link'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  
    [{ 'size': ['small', false, 'large', 'huge'] }], 
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
];

const options = {
    debug: 'info',
    modules: {
      toolbar: "#toolbar",
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  };

const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

// Editor is an uncontrolled React component
const Editor = forwardRef(
  ({ textError, value, setValue, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null)
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const [showLinkDialog, setShowLinkDialog] = useState(false)
    const [colorEditor, setColorEditor] = useState("#ff0000")
    const [showColor, setShowColor] = useState(false)
    const [linkUrl, setLinkUrl] = useState("");
    const [colorValue, setColorValue] = useState("#ff0000");
    const [inputColor, setInputColor] = useState('#ff0000');
    const [quillColor, setQuillColor] = useState(null)
    const [enableCheck, setEnableCheck] = useState(false)
    const colorPicker = useRef(null)

    useEffect(()=>{
        if(textError){
            setEnableCheck(true)
            const root = document.documentElement;
            root.style.setProperty("--border-editor", "360 87% 49%");
        }
    }, [textError])

    useEffect(()=>{
        if(enableCheck){
            console.log(value)
            if(value){
                const rootStyles = getComputedStyle(document.documentElement);
                const borderColor = rootStyles.getPropertyValue('--border').trim();
                root.style.setProperty("--border-editor", borderColor);
            } else {
                root.style.setProperty("--border-editor", "360 87% 49%");
            }
        }
    }, [value])
  
    const isValidHex = (val) => /^#([0-9A-F]{3}){1,2}$/i.test(val);
  
    const handleColorInputChange = (e) => {
      const val = e.target.value;
      setInputColor(val);
      if (isValidHex(val)) {
        setColorValue(val);
        handleColorChange(val); // update picker only on valid color
      }
    }
  
    const unFocusColor = ()=> {
        setInputColor(colorValue)
    }
    
    const handleColorChange = (newColor) => {
      setColorValue(newColor)
      setInputColor(newColor)
    }

    const applyColor = () => {
        const quill = quillRef.current;
        setShowColor(false)
        if (quill && colorValue) {
            quill.format('color', colorValue);
            setQuillColor(colorValue)
        }
    }

    const applyLink = () => {
        const quill = quillRef.current;
        if (quill && linkUrl) {
          const range = quill.getSelection();
          if (range) {
            quill.format('link', linkUrl);
            setShowLinkDialog(false);
            setLinkUrl('');
          }
        }
      };
 
    return(
        <div ref={containerRef}>
            {showLinkDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border border-border"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Agregar Enlace
                        </h3>
                        <Input
                        type="url"
                        placeholder="https://ejemplo.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {setShowLinkDialog(false)}}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={applyLink}
                            className="bg-[#4084f4] hover:bg-[#3573d9]"
                        >
                            Aplicar Enlace
                        </Button>
                        </div>
                    </motion.div>
                </div>
            )}
            <dialog id="color-picker" ref={colorPicker} className="w-screen bg-transparent h-screen">
                 <div className="flex h-full w-full items-center justify-center">
                   <div className="bg-card p-6 space-y-4 rounded-lg text-foreground border-2 border-input">
                     <HexColorPicker className="w-full" onChange={handleColorChange} color={colorValue} />
                     <footer className="flex max-w-full w-full gap-2 justify-between">
                       <input className="px-2 w-[100px] bg-background border border-input rounded-sm" onBlur={unFocusColor} value={inputColor} onChange={handleColorInputChange}/>
                       <button type="button" className="bg-muted py-1.5 px-4 rounded border border-input" onClick={()=>{{colorPicker.current?.close()}}}>Cerrar</button>
                     </footer>
                   </div>
                 </div>
               </dialog>
            
            <div id="toolbar">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <div className='relative'>
            <button className='relative' onClick={() => {setShowColor(prev => !prev)}}>
                <Palette className="w-4 h-4" style={{color: quillColor}} />
            </button>
                {showColor && (
                    <div className="absolute top-full mt-2 p-3 bg-background rounded-lg shadow-lg z-10 flex gap-2 items-center border border-border">
                    
                        <div
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: colorValue || 'red' }}
                        onClick={applyColor}
                        />
                        <Button variant="outline" onClick={() => {colorPicker.current?.showModal()}}>
                            <Pipette className='w-3 h-3'/>
                        </Button>
                    </div>
                )}
            </div>
            <select className="ql-size" defaultValue="small">
                <option value="small">Pequeño</option>
                <option>Normal</option>
                <option value="large">Grande</option>
                <option value="huge">Gigante</option>
            </select>
            <select className="ql-font" defaultValue="arial">
                <option value="arial" >
                    Arial
                </option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select>
            <button
                onClick={() => (setShowLinkDialog(prev => !prev))}
            >
            
                <LinkIcon className="w-4 h-4" />
            </button>
            </div>
            <div className='editor_rifaez'>
            <ReactQuill 
            ref={(el) => {
                if (el) {
                quillRef.current = el.getEditor(); // get the raw Quill instance
                }
            }} 
            theme="snow" 
            value={value.html} onChange={(v)=>{ setValue(prev => ({...prev, html: v}))}} modules={{toolbar: "#toolbar"}} formats={['bold', 'italic', 'underline', 'link',
                'size', 'font', 'color'
            ]}/>
            </div>
            <div className='mt-5 flex flex-col gap-2'>
                <Label>Titulo</Label>
                <Input type="text" value={value.title} onChange={(e)=>{ setValue(prev => ({...prev, title: e.target.value}))}} />
            </div>
        </div>
        
    ) ;
  },
);

Editor.displayName = 'Editor';

export default Editor;