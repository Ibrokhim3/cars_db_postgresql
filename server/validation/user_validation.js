import Joi from "joi";

export const userValidationReg = (data) => {
  const shcema = Joi.object({
    user_name: Joi.string().trim().min(3).max(50).required(),
    user_email: Joi.string().trim().email().min(5).max(50).required(),
    user_age: Joi.number().required(),
    user_role: Joi.string().min(1).max(15),
    user_password: Joi.string()
      .trim()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return shcema.validate(data);
};

// export const userValidationLog = (data) => {
//   const shcema = Joi.object({
//     user_email: Joi.string().trim().email().min(5).max(50).required(),
//     user_password: Joi.string()
//       .trim()
//       .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
//       .required(),
//   });
//   return shcema.validate(data);
// };
