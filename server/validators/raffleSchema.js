import Joi from 'joi';

const isoDateAfterToday = (value, helpers) => {
    const today = new Date().toISOString().split('T')[0]; 
    if (new Date(value) <= new Date(today)) {
      return helpers.error('any.invalid');
    }
    return value; 
};

const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'white', 'black']

const colorSchema = Joi.string().custom((value, helpers) => {
  const isPredefined = colors.includes(value);
  const isHex = /^#([0-9a-fA-F]{3}){1,2}$/.test(value);

  if (!isPredefined && !isHex) {
    return helpers.error('any.invalid');
  }

  return value;
}, 'Color Validation').messages({
  'any.invalid': 'Color must be a valid hex code or one of the predefined options',
});

export const methodSchema = Joi.object({
  bank: Joi.string().required(),
  person: Joi.string().required(),
  number: Joi.string()
    .pattern(/^\d{16}$/)
    .empty('')
    .optional()
    .messages({
      'string.pattern.base': 'Card number must be exactly 16 digits.',
      'string.empty': 'Card number is required.',
    }),
  clabe: Joi.string()
    .pattern(/^\d{18}$/)
    .empty('')
    .optional()
    .messages({
      'string.pattern.base': 'Cuenta clabe must be exactly 18 digits.',
      'string.empty': 'Cuenta clabe is required.',
    }),
  instructions: Joi.string().empty('').optional()

});


const fonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "IBM Plex Sans",
  "Concert One",
  "Bowlby One",
  "Lilita One",
  "Bungee",
  "Luckiest Guy",
  "Poppins"
];



export const raffleValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().greater(0).required(),
  logo: Joi.object({
    url: Joi.string().required(),  
    public_id: Joi.string().required()   
  }).optional(),
  phone: Joi.string().optional()
      .pattern(/^[0-9]{10}$/)
      .messages({
      'string.base': 'El teléfono debe ser un texto.',
      'string.empty': 'El teléfono es obligatorio.',
      'string.pattern.base': 'El teléfono debe tener 10 dígitos numéricos',
      'any.required': 'El teléfono es obligatorio.'
  }),
  maxParticipants: Joi.number().greater(0).required(),
    isActive: Joi.boolean().default(true),
    participants: Joi.string().optional(),      
    additionalPrizes: Joi.array().items(
        Joi.object({
        place: Joi.number().required(),  
        prize: Joi.string().required()   
        })
    ).default([]),
    images: Joi.array().items( Joi.object({
      url: Joi.string().required(),  
      public_id: Joi.string().required()   
    })).max(10).required(),
    colorPalette: Joi.object({
      header: colorSchema,
      background: colorSchema,
      accent: colorSchema,
      borders: colorSchema,
      color: colorSchema,
    }).required(),
    font: Joi.string().valid(...fonts).required(),
    logo_position: Joi.string().valid('left', 'center', 'right').required(),
    logo_size: Joi.string().valid('sm', 'md', 'lg').required(),
    logo_type: Joi.string().valid('on', 'off').required(),
    border_corner: Joi.string().valid('round', 'square').required(),
    purchasedTicketDisplay: Joi.string().valid('hide', 'cross').required(),
    logo_display_name: Joi.boolean().required(),
    countdown: Joi.string().valid('on', 'off').required(),
    textHtml: Joi.object({
      title: Joi.string().required(),
      html: Joi.string().required(),
    }).required(),
    timeLimitPay: Joi.number().required(),
    paymentMethods: Joi.array().items(methodSchema.required()).required(),
    endDate: Joi.string()
        .isoDate()
        .custom(isoDateAfterToday, 'Date must be after today') 
        .default("12-12-25"),
    extraInfo: Joi.string().max(500).allow('').optional(),

});