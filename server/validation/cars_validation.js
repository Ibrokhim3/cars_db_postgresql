import Joi from "joi";

export const companyValidation = (data) => {
  const shcema = Joi.object({
    company_title: Joi.string().min(2).max(50).required(),
    company_email: Joi.string().trim().email().min(5).max(50).required(),
    company_address: Joi.string().required(),
  });
  return shcema.validate(data);
};
