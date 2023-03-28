import pool from "../config/db_config.js";

export const verifyToken = async (req, res, next) => {
  const userData = await pool.query(`SELECT * FROM jwt`);
  const { token } = userData.rows[0];
  if (req.headers.token && req.headers.token === token) {
    return next();
  }
  res.send("Token doesn't exist or you are not authorized !");
};
