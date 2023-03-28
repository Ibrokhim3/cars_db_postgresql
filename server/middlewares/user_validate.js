import { userValidationReg } from "../validation/user_validation.js";

export const userValidateMiddle = (req, res, next) => {
  try {
    const { error } = userValidationReg(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        msg: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
