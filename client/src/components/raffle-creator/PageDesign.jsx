import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from 'react-colorful';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const colorCheck = {
  red: 'Rojo',
  blue: 'Azul',
  yellow: 'Amarillo',
  green: 'Verde',
  purple: 'Púrpura',
  black: 'Negro',
  white: 'Blanco',
}

const colors = [
  { id: 'red', name: "Rojo", hex: "#FF0000" },
  { id: 'blue', name: "Azul", hex: "#0000FF" },
  { id: 'yellow', name: "Amarillo", hex: "#FFFF00" },
  { id: 'green', name: "Verde", hex: "#00FF00" },
  { id: 'purple', name: "Púrpura", hex: "#800080" },
  { id: 'black', name: "Negro", hex: "#000000" },
  { id: 'white', name: "Blanco", hex: "#FFFFFF" }
];

const PageDesign = ({ setValue, errors, control }) => {
  const { toast } = useToast();
  const [paletteData, setPaletteData] = useState({
    header: "red",
    background: "red",
    accent: "red",
    borders: "red",
    color: "red",
  })
  const [showPaletteValue, setPaletteValue] = useState(false)
  const [pickerName, setPickerName] = useState("header")
  const [colorValue, setColorValue] = useState("#ff0000");
  const [pickerColor, setPickerColor] = useState({
    header: "#ff0000",
    background: "#ff0000",
    accent: "#ff0000",
    borders: "#ff0000",
    color: "#ff0000",
  });
  const [dropdownFont, setDropdownFont] = useState(false)
  const dropdownRef = useRef(null);
  const dropdownFontOpenRef = useRef({state: dropdownFont, changed: false});
  const openColorPicker = (name) => {
    setPickerName(name)
    setColorValue(pickerColor[name])
    document.getElementById("color-picker").showModal()
  }

  const isValidHex = (val) => /^#([0-9A-F]{3}){1,2}$/i.test(val);


  const handleColorInputChange = (e) => {
    const val = e.target.value;
    setColorValue(val);
    if (isValidHex(val)) {
      handleColorChange(val); // update picker only on valid color
    }
  }

  const unFocusColor = ()=> {
    setColorValue(pickerColor[pickerName])
  }
  
  const handleColorChange = (newColor) => {
    setPickerColor(prev => ({...prev, [pickerName]: newColor}));
    handlePaletteChange({target: {name: pickerName, value: newColor}})
    setColorValue(newColor)
  }

    useEffect(() => {
      dropdownFontOpenRef.current = {state: dropdownFont, changed: true};
    }, [dropdownFont]);

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownFontOpenRef.current.state && !dropdownFontOpenRef.current.changed) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownFont(false);
          }
        } else {
          dropdownFontOpenRef.current.changed = false;
        }
      }

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);

    const handlePaletteChange = (e) => {
      const {name, value} = e.target
      if(colors.map(color => color.id).includes(value)){
        setPickerColor(prev => ({...prev, [name]: colors.find(color => color.id === value).hex}));
      }
      setPaletteData(prev => ({...prev, [name]: value}))
    }
  
    const submitPalette = () => {
      document.getElementById("create-palette").close()
      setPaletteValue(true)
      setValue("colorPalette", paletteData, { shouldValidate: true })
      // const colorP = watch("colorPalette")
      // console.log(colorP)
    }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 border-b pb-4">Diseño de la Página</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className='space-y-2'>
          <Label error={errors.colorPalette}>Paleta de Colores</Label>
          <div
            onClick={()=>{document.getElementById("create-palette").showModal()}}
            name="colorPalette"
            className={`w-full p-2 rounded-md border text-muted-foreground ${errors.colorPalette ? "border-red-500" : "border-border"} bg-background`}
          >
            { !showPaletteValue ? "Crear una paleta +" : `Encabezado: ${colorCheck[paletteData.header] || paletteData.header}, Fondo: ${colorCheck[paletteData.background] || paletteData.background}, Detalles: ${colorCheck[paletteData.accent] || paletteData.accent}, Bordes: ${colorCheck[paletteData.borders] || paletteData.borders}, Letra: ${colorCheck[paletteData.color] || paletteData.color}`}
          </div>
          <dialog id="create-palette" className="h-screen bg-transparent">
                <div className='flex items-center h-full'>
                    <div className="space-y-5 px-5 py-5 w-[400px] shadow-lg text-foreground border-2 border-border rounded-md max-w-full bg-background">
                      <h1 className="text-lg">Colores de Rifa</h1>
                      <dialog id="color-picker" className="w-screen bg-transparent h-screen">
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="bg-card p-6 space-y-4 rounded-lg text-foreground border-2 border-input">
                            <HexColorPicker className="w-full" onChange={handleColorChange} color={pickerColor[pickerName]} />
                            <footer className="flex max-w-full w-full gap-2 justify-between">
                              <input className="px-2 w-[100px] bg-background border border-input rounded-sm" onBlur={unFocusColor} value={colorValue} onChange={handleColorInputChange}/>
                              <button type="button" className="bg-muted py-1.5 px-4 rounded border border-input" onClick={()=>{document.getElementById("color-picker").close()}}>Cerrar</button>
                            </footer>
                          </div>
                        </div>
                      </dialog>
                      <div className="space-y-3">
                        <div className="flex flex-col w-full gap-2">
                          <label htmlFor="encabezado_color" className='text-sm'>Encabezado</label>
                          <div className="w-full items-center max-w-full flex gap-2">
                            <select 
                              id="encabezado_color" 
                              name="header" 
                              value={paletteData.header} 
                              onChange={handlePaletteChange} 
                              className='w-full max-w-full p-2 rounded-md bg-background border border-border' >
                                {colors.map((color, index) => (
                                  <option key={index} value={color.id} >{color.name}</option>
                                ))}
                                <option value={pickerColor.header || 'Personalizado'} >{pickerColor.header || 'Personalizado'}</option>
                            </select>
                            <div style={{ backgroundColor: pickerColor.header }} className="h-[35px] aspect-square rounded border-2 border-input" onClick={()=>{openColorPicker("header")}}></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="fondo_color" className='text-sm'>Fondo</label>
                          <div className="w-full items-center max-w-full flex gap-2">
                            <select 
                                id="fondo_color" 
                                name="background" 
                                value={paletteData.background} 
                                onChange={handlePaletteChange} 
                                className='w-full max-w-full p-2 rounded-md bg-background border border-border' >
                                {colors.map((color, index) => (
                                  <option key={index} value={color.id} >{color.name}</option>
                                ))}
                                <option value={pickerColor.background || 'Personalizado'} >{pickerColor.background || 'Personalizado'}</option>
                            </select>
                            <div style={{ backgroundColor: pickerColor.background }} className="h-[35px] aspect-square rounded border-2 border-input" onClick={()=>{openColorPicker("background")}}></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="accento_color" className='text-sm'>Detalles</label>
                          <div className="w-full items-center max-w-full flex gap-2">
                            <select 
                            id="accento_color" 
                            name="accent" 
                            value={paletteData.accent} 
                            onChange={handlePaletteChange} 
                            className='w-full max-w-full p-2 rounded-md bg-background border border-border' >
                                {colors.map((color, index) => (
                                  <option key={index} value={color.id} >{color.name}</option>
                                ))}
                                <option value={pickerColor.accent || 'Personalizado'} >{pickerColor.accent || 'Personalizado'}</option>
                            </select>
                            <div style={{ backgroundColor: pickerColor.accent }} className="h-[35px] aspect-square rounded border-2 border-input" onClick={()=>{openColorPicker("accent")}}></div>
                          </div>
                        </div> 
                        <div className="flex flex-col gap-2">
                          <label htmlFor="bordes_color" className='text-sm'>Bordes</label>
                          <div className="w-full items-center max-w-full flex gap-2">
                            <select 
                                id="bordes_color" 
                                name="borders" 
                                value={paletteData.borders} 
                                onChange={handlePaletteChange} 
                                className='w-full max-w-full p-2 rounded-md bg-background border border-border' >
                                {colors.map((color, index) => (
                                  <option key={index} value={color.id} >{color.name}</option>
                                ))}
                                <option value={pickerColor.borders || 'Personalizado'} >{pickerColor.borders || 'Personalizado'}</option>
                            </select>
                            <div style={{ backgroundColor: pickerColor.borders }} className="h-[35px] aspect-square rounded border-2 border-input" onClick={()=>{openColorPicker("borders")}}></div>
                          </div>
                        </div>  
                        <div className="flex flex-col gap-2">
                          <label htmlFor="color_color" className='text-sm'>Letra</label>
                          <div className="w-full items-center max-w-full flex gap-2">
                            <select 
                                id="color_color" 
                                name="color" 
                                value={paletteData.color} 
                                onChange={handlePaletteChange} 
                                className='w-full max-w-full p-2 rounded-md bg-background border border-border' >
                                {colors.map((color, index) => (
                                  <option key={index} value={color.id} >{color.name}</option>
                                ))}
                                <option value={pickerColor.color || 'Personalizado'} >{pickerColor.color || 'Personalizado'}</option>
                            </select>
                            <div style={{ backgroundColor: pickerColor.color }} className="h-[35px] aspect-square rounded border-2 border-input" onClick={()=>{openColorPicker("color")}}></div>
                          </div>
                        </div>  
                      </div>
                      <footer className="flex items-center gap-3">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={()=>{document.getElementById("create-palette").close()}}
                        >Cancelar</Button>
                        <Button
                        type="button"
                        onClick={submitPalette}
                        >
                          Agregar
                        </Button>
                      </footer>   
                    </div>       
                  </div>                                         
               </dialog>      
        </div>
        
        <Controller
            name="logo_position"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label error={errors.logo_position}>Posicionamiento de Logo</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger error={errors.logo_position} className="bg-background text-foreground">
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Izquierdo</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Derecho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

        <Controller
            name="font"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label error={errors.font}>Fuentes</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger error={errors.font} className="bg-background text-foreground">
                    <SelectValue placeholder="Selecciona una fuente" />
                  </SelectTrigger>
                  <SelectContent>
                        <SelectItem value="Poppins" className="font-[Poppins]">Poppins</SelectItem>
                        <SelectItem value="Inter" className="font-[Inter]">Inter</SelectItem>
                        <SelectItem value="Roboto" className="font-[Roboto]">Roboto</SelectItem>
                        <SelectItem value="Open Sans" className="font-[Open_Sans]">Open Sans</SelectItem>
                        <SelectItem value="Lato" className="font-[Lato]">Lato</SelectItem>
                        <SelectItem value="IBM Plex Sans" className="font-[IBM_Plex_Sans]">IBM Plex Sans</SelectItem>
                        <SelectItem value="Concert One" className="font-[Concert_One]">Concert One</SelectItem>
                        <SelectItem value="Bowlby One" className="font-[Bowlby_One]">Bowlby One</SelectItem>
                        <SelectItem value="Lilita One" className="font-[Lilita_One]">Lilita One</SelectItem>
                        <SelectItem value="Bungee" className="font-[Bungee]">Bungee</SelectItem>
                        <SelectItem value="Luckiest Guy" className="font-[Luckiest_Guy]">Luckiest Guy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        
        
        <Controller
            name="countdown"
            control={control}
            render={({ field }) => (
              <div className='flex items-center space-x-2'>
                <Switch
                    id="countdown"
                    checked={field.value === "on"}
                    onCheckedChange={(checked) => {
                      const newV = checked ? "on" : "off"
                      field.onChange(newV)
                    }}
                  />
                  <Label htmlFor="countdown">Temporizador de cuenta regresiva</Label>
              </div>
            )}
          />

        <Controller
            name="logo_type"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label error={errors.logo_type} >Tipo de Logo</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger error={errors.logo_type} className="bg-background text-foreground">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Redondo</SelectItem>
                    <SelectItem value="off">Sin fondo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        
        
        
        <Controller
            name="border_corner"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label error={errors.border_corner}>Tipo de Esquinas</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger error={errors.border_corner} className="bg-background text-foreground">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Cuadrado</SelectItem>
                    <SelectItem value="round">Redondeado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            name="purchasedTicketDisplay"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label error={errors.purchasedTicketDisplay}>Visualización del boleto comprado</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger error={errors.purchasedTicketDisplay} className="bg-background text-foreground">
                      <SelectValue placeholder="Selecciona una visualizacion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cross">Tachado</SelectItem>
                      <SelectItem value="hide">Oculto</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            )}
          />

        <Controller
            name="logo_size"
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                  <Label>Tamaño de Logo</Label>
                  <div className="flex space-x-2 mt-2">
                    {[{label: 'S', value: "sm"}, {label: 'M', value: "md"}, {label: 'L', value: "lg"}].map((size) => (
                      <Button
                        key={size.value}
                        variant={field.value === size.value ? "default" : "outline"}
                        size="sm"
                        type="button"
                        onClick={() => field.onChange(size.value)}
                        className={field.value === size.value ? 
                          "bg-primary text-background hover:bg-[#3573d9]" : 
                          "bg-background border-border text-card-foreground hover:bg-muted-foreground"
                        }
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>
            )}
          />
           <Controller
            name="logo_display_name"
            control={control}
            render={({ field }) => (
                <div className='space-y-2'>
                    <Label>Nombre de Empresa en Encabezado</Label>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className={field.value ? 
                            "bg-primary text-background hover:bg-[#3573d9]" : 
                            "bg-background border-border text-card-foreground hover:bg-muted-foreground"
                          }
                        onClick={() => field.onChange(true)}
                      >
                        Sí
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className={!field.value ? 
                            "bg-primary text-background hover:bg-[#3573d9]" : 
                            "bg-background border-border text-card-foreground hover:bg-muted-foreground"
                          }
                        onClick={() => field.onChange(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
            )}
          />
        
        
        
        
      </div>
    </motion.div>
  );
};

export default PageDesign;