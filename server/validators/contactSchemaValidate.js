// import Joi from 'joi';

// export const contactValidationSchema = Joi.object({
//   name: Joi.string().required().messages({
//       'string.empty': 'Name is required',
//     }),
//   email: Joi.string()
//       .email({ tlds: { allow: false } }) 
//       .required()
//       .messages({
//         'string.empty': 'Email is required',
//         'string.email': 'Must be a valid email address',
//       }),
//   message: Joi.string().required().messages({
//       'string.empty': 'Message is required',
//     }),
//   date: Joi.string().default(() => new Date().toISOString()),
// })