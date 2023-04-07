import bcrypt from "bcryptjs";
import pool from "../config/db_config.js";

const comCtr = {
  GET_COMPANY: async (req, res) => {
    try {
      const companiesList = await pool.query(`SELECT * FROM company`);
      res.status(200).send(companiesList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_COMPANY: async (req, res) => {
    try {
      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1`,
        [req.params.id]
      );
      if (!foundedCompany.rows[0]) {
        return res.status(404).send("Company not found!");
      }
      res.send(foundedCompany.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
  //company_id in users
  //email_id now cannot be changed
  //user role qoshilmagan

  CREATE_COMPANY: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can add company!");
      }
      const { company_title, company_address, company_email } = req.body;

      const foundedeCompany = await pool.query(
        `SELECT * FROM emails where title = $1 `,
        [company_email]
      );

      const foundedeCompanyUser = await pool.query(
        `SELECT * FROM company where created_by = $1 `,
        [user_id]
      );

      if (foundedeCompanyUser.rows[0]) {
        return res.status(400).send("Only one company can be added ): !");
      }
      if (foundedeCompany.rows[0]) {
        return res.send("Company already exists!");
      }

      await pool.query(`INSERT INTO emails(title) VALUES($1)`, [company_email]);

      let emailId = await pool.query(`SELECT id FROM emails where title=$1`, [
        company_email,
      ]);

      await pool.query(
        `INSERT INTO company(company_title, 
      company_email_id, company_address,
      created_by) VALUES($1,
        $2, $3, $4)`,
        [company_title, emailId.rows[0].id, company_address, user_id]
      );

      const companyId = await pool.query(
        `SELECT company_id FROM company where company_email_id=$1`,
        [emailId.rows[0].id]
      );

      await pool.query(`UPDATE jwt SET company_id=$1 where user_id=$2`, [
        companyId.rows[0].company_id,
        user_id,
      ]);

      await pool.query(`UPDATE users SET company_id=$1 where user_id=$2`, [
        companyId.rows[0].company_id,
        user_id,
      ]);

      return res
        .status(201)
        .send(`The ${company_title} addedd successfully by ${user_name} `);
    } catch (error) {
      return console.log(error.message);
    }
  },
  UPDATE_COMPANY: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can update company");
      }

      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1`,
        [req.params.id]
      );

      if (!foundedCompany.rows[0]) {
        return res.status(404).send("Company not found!");
      }
      if (company_id !== req.params.id) {
        return res
          .status(400)
          .send("You do not have permission to update this company");
      }

      let { company_title, company_address, company_email } = req.body;
      const {
        company_title: com_title,
        company_address: com_address,
        company_email: com_email,
      } = foundedCompany.rows[0];

      (company_title = company_title ? company_title : com_title),
        (company_address = company_address ? company_address : com_address),
        (company_email = company_email ? company_email : com_email);

      const emailId = foundedCompany.rows[0].company_email_id;

      await pool.query(`UPDATE emails SET title=$1 where id=$2`, [
        company_email,
        emailId,
      ]);

      await pool.query(
        `UPDATE company SET company_title=$1, company_address=$2 where company_id=$3`,
        [company_title, company_address, req.params.id]
      );
      res.status(200).send(`Company updated successfully by ${user_name}!`);
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_COMPANY: async (req, res) => {
    //cars va users ochib ketish kerak
    // on drop cascade ishlatish
    //delete ishlamoqda lekin chala
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can delete company");
      }
      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1`,
        [req.params.id]
      );
      if (!foundedCompany.rows[0]) {
        return res.status(404).send("Company not found!");
      }

      await pool.query(`DELETE FROM customers where company_id=$1`, [
        foundedCompany.rows[0].company_id,
      ]);

      await pool.query(`DELETE FROM cars where company_id=$1`, [
        foundedCompany.rows[0].company_id,
      ]);

      await pool.query(
        `DELETE FROM users where company_id=$1 AND user_role='company_user'`,
        [foundedCompany.rows[0].company_id]
      );

      await pool.query(`UPDATE users SET company_id=null where company_id=$1`, [
        foundedCompany.rows[0].company_id,
      ]);

      await pool.query(`DELETE FROM company where company_id=$1`, [
        foundedCompany.rows[0].company_id,
      ]);

      res
        .status(200)
        .send(
          `${foundedCompany.rows[0].company_title} was deleted successfully`
        );
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_COMPANY_BOOL: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const {
        user_id: user_id_jwt,
        user_name: user_name_jwt,
        user_role: user_role_jwt,
        company_id: company_id_jwt,
      } = userData.rows[0];

      if (user_role_jwt !== "admin") {
        return res.status(400).send("Only admins can remove company");
      }

      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1`,
        [company_id_jwt]
      );

      if (!foundedCompany.rows[0]) {
        return res.status(404).send("Company not found!");
      }

      await pool.query(
        `UPDATE company SET isDeleted=true where company_id=$1`,
        [company_id_jwt]
      );
      await pool.query(
        `UPDATE users SET company_id=null where company_id=$1 `,
        [company_id_jwt]
      );
      await pool.query(`UPDATE jwt SET company_id=null where company_id=$1 `, [
        company_id_jwt,
      ]);
      res
        .status(200)
        .send(`Company was deleted successfully by ${user_name_jwt}`);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_USERS: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can delete company");
      }

      const usersList = await pool.query(
        `SELECT * FROM users where company_id=$1 and user_role='company_user'`,
        [company_id]
      );
      //shu yerda company_user bolish kerak
      if (!usersList.rows[0]) {
        return res.status(404).send("Users not found");
      }
      res.status(200).send(usersList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_USER: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can delete company");
      }

      const foundedUser = await pool.query(
        `SELECT * FROM users WHERE user_id=$1 AND company_id=$2`,
        [req.params.id, company_id]
      );
      if (!foundedUser.rows[0]) {
        return res.status(404).send("User not found!");
      }
      res.send(foundedUser.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
  ADD_USERS: async (req, res) => {
    //userlarni update va delete qilish get qilish ?
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const {
        user_id: user_id_jwt,
        user_name: user_name_jwt,
        user_role: user_role_jwt,
        company_id: company_id_jwt,
      } = userData.rows[0];

      if (user_role_jwt !== "admin") {
        return res.status(400).send("Only admins can add company users");
      }

      if (!company_id_jwt) {
        return res
          .status(400)
          .send("Company users can be added after company creation");
      }

      const { user_name, user_email, user_password, user_age } = req.body;

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

      await pool.query(
        `INSERT INTO users(user_name, 
          user_email_id, user_age,
          user_password, company_id, user_role) VALUES($1,
            $2, $3, $4, $5, $6)`,
        [
          user_name,
          emailId.rows[0].id,
          user_age,
          hashPsw,
          company_id_jwt,
          "company_user",
        ]
      );
      return res
        .status(201)
        .send(`${user_name} was added successfully by ${user_name_jwt}!`);
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_USER_BOOL: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const {
        user_id: user_id_jwt,
        user_name: user_name_jwt,
        user_role: user_role_jwt,
        company_id: company_id_jwt,
      } = userData.rows[0];

      if (user_role_jwt !== "admin") {
        return res.status(400).send("Only admins can remove company users");
      }

      const foundedUser = await pool.query(
        `SELECT * FROM users WHERE user_id=$1`,
        [req.params.id]
      );

      if (!foundedUser.rows[0]) {
        return res.status(404).send("User not found!");
      }

      await pool.query(`UPDATE users SET isDeleted=true where user_id=$1`, [
        req.params.id,
      ]);
      res
        .status(200)
        .send(`Company user was deleted successfully by ${user_name_jwt}`);
    } catch (error) {
      return console.log(error.message);
    }
  },
  //userlarni o'zgartirish ham qoshsa boladi
};

export { comCtr };
