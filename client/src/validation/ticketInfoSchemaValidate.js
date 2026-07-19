import Joi from "joi";

import mexicanStates from "../raffleTemplates/lib/mexicanStates";

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
});
