import Joi from "joi";

export const companyValidation = (data) => {
  const shcema = Joi.object({
    company_title: Joi.string().min(2).max(50).required(),
    company_email: Joi.string().trim().email().min(5).max(50).required(),
    company_address: Joi.string().required(),
  });
  return shcema.validate(data);
};

export const carsValidation = (data) => {
  const shcema = Joi.object({
    car_title: Joi.string().min(2).max(50).required(),
    car_brand: Joi.string().min(3).max(50).required(),
    car_color: Joi.string().min(2).max(30).required(),
    car_price: Joi.string().min(3).max(100).required(),
  });
  return shcema.validate(data);
};
