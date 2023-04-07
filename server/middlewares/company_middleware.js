import {
  carsValidation,
  companyValidation,
} from "../validation/company_validation.js";

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

export const carsValidMiddle = (req, res, next) => {
  try {
    const { error } = carsValidation(req.body);
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
