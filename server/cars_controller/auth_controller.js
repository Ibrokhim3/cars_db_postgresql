import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import pool from "../config/db_config.js";

const AuthCtr = {
  //trim was not work
  //jwt file
  REGISTER: async (req, res) => {
    try {
      const { user_name, user_email, user_password, user_age, user_role } =
        req.body;

      const foundedEmail = await pool.query(
        `SELECT * FROM emails WHERE title = $1`,
        [user_email]
      );
      if (foundedEmail.rows[0]) {
        return res.send("This user already exists");
      }

      await pool.query(`INSERT INTO emails(title) VALUES($1)`, [user_email]);
      const emailId = await pool.query(
        `SELECT id FROM emails where title = $1`,
        [user_email]
      );
      const hashPsw = await bcrypt.hash(user_password, 12);

      if (!user_role) {
        await pool.query(
          `INSERT INTO users(user_name, 
          user_email_id, user_age,
          user_password ) VALUES($1,
            $2, $3, $4)`,
          [user_name, emailId.rows[0].id, user_age, hashPsw]
        );
        return res
          .status(201)
          .send("You're successfully registrated as a user!");
      }

      await pool.query(
        `INSERT INTO users(user_name,
      user_email_id, user_age,
      user_password, user_role ) VALUES($1,
        $2, $3, $4, $5)`,
        [user_name, emailId.rows[0].id, user_age, hashPsw, user_role]
      );
      res.status(201).send("You're successfully registrated as an admin!");
    } catch (error) {
      return console.log(error.message);
    }
  },
  LOGIN: async (req, res) => {
    //qaysi user id url qilish kerakmi ?
    try {
      const { user_email, user_password } = req.body;
      const foundedEmail = await pool.query(
        `SELECT * FROM emails WHERE title = $1`,
        [user_email]
      );
      if (!foundedEmail.rows[0]) {
        return res.status(404).send("User not found");
      }

      const emailId = foundedEmail.rows[0].id;

      const foundedUser = await pool.query(
        `SELECT * FROM users where user_email_id = $1`,
        [emailId]
      );

      const psw = await bcrypt.compare(
        user_password,
        foundedUser.rows[0].user_password
      );

      if (psw) {
        let token = jwt.sign(
          {
            user_id: foundedUser.rows[0].user_id,
            user_name: foundedUser.rows[0].user_name,
            user_role: foundedUser.rows[0].user_role,
            company_id: foundedUser.rows[0].company_id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.JWT_TIME,
          }
        );

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        const { user_id, user_name, user_role, company_id, exp, iat } =
          userInfo;

        const jwtInfo = await pool.query(`SELECT * FROM JWT`);

        if (!jwtInfo.rows[0]) {
          await pool.query(
            `INSERT INTO jwt(user_id, user_name, user_role, company_id, exp, iat, token) VALUES($1, $2,$3,$4,$5, $6, $7) `,
            [user_id, user_name, user_role, company_id, exp, iat, token]
          );
        }
        await pool.query(
          `UPDATE jwt SET user_id=$1, user_name=$2, user_role=$3, exp=$4, iat=$5, token=$6, company_id=$7`,
          [user_id, user_name, user_role, exp, iat, token, company_id]
        );

        await pool.query(`INSERT INTO session(user_id) VALUES($1) `, [user_id]);

        return res.send({
          msg: `You're logged in as a(n) ${user_role}!`,
          token,
        });
      }
      res.send("Incorrect password!");
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_USERS: async (req, res) => {
    try {
      const usersList = await pool.query(`SELECT * FROM users`);
      res.status(200).send(usersList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_USER: async (req, res) => {
    try {
      const foundedUser = await pool.query(
        `SELECT * FROM users WHERE user_id=$1`,
        [req.params.id]
      );
      if (!foundedUser.rows[0]) {
        return res.status(404).send("User not found!");
      }
      res.send(foundedUser.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
  LOGOUT: async (req, res) => {
    const userData = await pool.query(`SELECT * FROM jwt`);
    let { user_id } = userData.rows[0];

    await pool.query(
      `UPDATE session SET end_at=CURRENT_TIMESTAMP where user_id=$1`,
      [user_id]
    );
    await pool.query(`DELETE FROM jwt WHERE user_id=$1`, [user_id]);
    res.send("You're logged out");
  },
  //userlarni o'zgartirish va o'chirish
};

export { AuthCtr };
