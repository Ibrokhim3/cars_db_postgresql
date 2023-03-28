import { companyValidation } from "../validation/cars_validation.js";

export const companyValidMiddle = (req, res, next) => {
  try {
    const { error } = companyValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        msg: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    return console.log(error.message);
  }
};
