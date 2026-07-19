import Joi from 'joi';

const isoDateAfterToday = (value, helpers) => {
    const today = new Date().toISOString().split('T')[0]; 
    if (new Date(value) <= new Date(today)) {
      return helpers.error('any.invalid');
    }
    return value; 
};
function getDate30DaysFromNow() {
  const today = new Date(); // Get the current date
  today.setDate(today.getDate() + 30); // Add 30 days to the current date
  return today.toISOString(); // Convert the updated date to ISO format
}
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

export const methodSchema = Joi.object({
  _id: Joi.string().optional(),
  id: Joi.string().optional(),
  enabled: Joi.optional(),
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
    instructions: Joi.string().empty('').optional(),

});

export const firstStepValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().greater(0).required(),
  maxParticipants: Joi.number().greater(0).required(),
  additionalPrizes: Joi.array().items(
      Joi.object({
      place: Joi.number().required(),  
      prize: Joi.string().required()   
      })
  ).default([]),
  colorPalette: Joi.object({
    header: colorSchema,
    background: colorSchema,
    accent: colorSchema,
    borders: colorSchema,
    color: colorSchema,
  }).required(),
  font: Joi.string().valid(...fonts).required(),
  logo_position: Joi.string().valid('left', 'center', 'right').required(),
  logo_type: Joi.string().valid('on', 'off').required(),
  logo_size: Joi.string().valid('sm', 'md', 'lg').required(),
  border_corner: Joi.string().valid('round', 'square').required(),
  purchasedTicketDisplay: Joi.string().valid('hide', 'cross').required(),
  logo_display_name: Joi.boolean().required(),
  countdown: Joi.string().valid('on', 'off').required(),
  timeLimitPay: Joi.number().greater(0).required(),
  fileCounter: Joi.number().greater(0).less(11).required(),

  endDate: Joi.string()
      .isoDate()
      .custom(isoDateAfterToday, 'Date must be after today') 
      .default(getDate30DaysFromNow()),
  extraInfo: Joi.string().max(500).allow('').optional(),
})

export const raffleValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().greater(0).required(),
  maxParticipants: Joi.number().greater(0).required(),
 isActive: Joi.boolean().default(true),
    participants: Joi.string().optional(),      
    additionalPrizes: Joi.array().items(
        Joi.object({
        place: Joi.number().required(),  
        prize: Joi.string().required()   
        })
    ).default([]),
    colorPalette: Joi.object({
      header: colorSchema,
      background: colorSchema,
      accent: colorSchema,
      borders: colorSchema,
      color: colorSchema,
    }).required(),
    font: Joi.string().valid(...fonts).required(),
    logo_position: Joi.string().valid('left', 'center', 'right').required(),
    logo_type: Joi.string().valid('on', 'off').required(),
    logo_size: Joi.string().valid('sm', 'md', 'lg').required(),
    border_corner: Joi.string().valid('round', 'square').required(),
    purchasedTicketDisplay: Joi.string().valid('hide', 'cross').required(),
    logo_display_name: Joi.boolean().required(),
    countdown: Joi.string().valid('on', 'off').required(),
    // nightMode: Joi.boolean().required(),
    textHtml: Joi.object({
      title: Joi.string().required(),
      html: Joi.string().required(),
    }).required(),
    timeLimitPay: Joi.number().greater(0).required(),
    fileCounter: Joi.number().greater(0).less(11).required(),
    paymentMethods: Joi.array().items(methodSchema.required()).required(),
    
    payment_instructions: Joi.string().when('paymentMethods', {
      is: Joi.array().has('custom'),
      then: Joi.required(), // Make it required if "custom" is in paymentMethods
      otherwise: Joi.optional() 
    }),
    endDate: Joi.string()
        .isoDate()
        .custom(isoDateAfterToday, 'Date must be after today') 
        .default(getDate30DaysFromNow()),
    extraInfo: Joi.string().max(500).allow('').optional(),

});