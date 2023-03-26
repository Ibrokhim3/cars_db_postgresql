import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import pool from "../config/db_config.js";

const AuthCtr = {
  REGISTER: async (req, res) => {
    const { user_name, user_email, user_password, user_age } = req.body;

    const foundedEmail = await pool.query(
      `SELECT * FROM emails WHERE title = $1`,
      [user_email]
    );
    if (foundedEmail.rows[0]) {
      return res.send("This email already exists");
    }

    await pool.query(`INSERT INTO emails(title) VALUES($1)`, [user_email]);
    const emailId = await pool.query(`SELECT id FROM emails where title = $1`, [
      user_email,
    ]);
    const hashPsw = await bcrypt.hash(user_password, 12);
    await pool.query(
      `INSERT INTO users(user_name, 
      user_email_id, user_age,
      user_password ) VALUES($1,
        $2, $3, $4)`,
      [user_name, emailId.rows[0].id, user_age, hashPsw]
    );

    res.status(201).send("You're successfully registrated!");
  },
  LOGIN: async (req, res) => {
    const { user_email, user_password } = req.body;
    const foundedUser = await pool.query(
      `SELECT * FROM users WHERE user_email = $1`,
      [user_email]
    );
    const psw = await bcrypt.compare(
      user_password,
      foundedUser.rows[0].user_password
    );
    console.log(psw);

    if (!foundedUser.rows[0]) {
      return res.status(404).send("User not found");
    }
    if (psw) {
    }
  },
};

export { AuthCtr };
