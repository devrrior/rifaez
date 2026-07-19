import Joi from 'joi';

import mexicanStates from '../lib/mexicanStates.js';


export const ticketInfoValidationSchema = Joi.object({
  first_name: Joi.string().required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es obligatorio.",
    "any.required": "El nombre es obligatorio.",
  }),
  last_name: Joi.string().required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es obligatorio.",
    "any.required": "El nombre es obligatorio.",
  }),
  phone: Joi.object({
    number: Joi.string().required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.base": "El teléfono debe ser un texto.",
      "string.empty": "El teléfono es obligatorio.",
      "any.required": "El teléfono es obligatorio.",
    }).required(),
    country: Joi.string().valid("mexico", "usa").required()
  }).required()
    ,
  state: Joi.string()
    .valid(...mexicanStates)
    .required()
    .messages({
      "any.only": 'El estado debe ser uno válido de México o "Extranjero".',
      "string.empty": "El estado es obligatorio.",
      "any.required": "El estado es obligatorio.",
    }),
  date: Joi.string().default(() => new Date().toISOString()),
  tickets: Joi.array().items(Joi.object({
    number: Joi.number().required(),
    status: Joi.string().valid("pagado", "pendiente").default("pendiente"),
    notes: Joi.string().optional()
  })).required(),
  amount: Joi.number().required(),
  transactionID: Joi.string()
  .pattern(/^\d{3}$/) // must be exactly 3 digits (e.g. "001", "123")
  .required()
  .messages({
    'string.pattern.base': 'transactionId debe ser una cadena de 3 dígitos (ej. "001").',
    'string.empty': 'transactionId es obligatorio.',
    'any.required': 'transactionId es obligatorio.'
  }),
});
