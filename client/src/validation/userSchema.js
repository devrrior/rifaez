import Joi from 'joi';

export const passwordSchema = Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // at least one lowercase, one uppercase, and one number
  .required()
  .messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.pattern.base': 'La contraseña debe incluir mayúsculas, minúsculas y un número',
  })

export const workerSchema = Joi.object({
    _id: Joi.any().optional(), // allow it, or Joi.string().optional()
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    role: Joi.string().valid('editor', 'admin', 'viewer').optional()
})


export const methodSchema = Joi.object({
  _id: Joi.string().optional(),
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

export const emailSchema = Joi.string().email({ tlds: { allow: false } }).required()

export const saveSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string()
      .email({ tlds: { allow: false } }) // disable TLD check for flexibility
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Must be a valid email address',
    }),
    companyName: Joi.string().optional(),
  
    // workers: Joi.array().items(workerSchema).optional(),
  
    currentPlan: Joi.string().valid('basic', 'premium', 'pro').optional(), 

    payment_methods: Joi.array().items(methodSchema).optional(),
  
    facebookUrl: Joi.string().uri().allow('', null).optional(),
  
    phone: Joi.string().required()
        .pattern(/^[0-9]{10}$/)
        .messages({
        'string.base': 'El teléfono debe ser un texto.',
        'string.empty': 'El teléfono es obligatorio.',
        'string.pattern.base': 'El teléfono debe tener 10 dígitos numéricos',
        'any.required': 'El teléfono es obligatorio.'
    }),
  
    // Do NOT allow updating 'raffles' from this route to prevent injection
  });
  

  