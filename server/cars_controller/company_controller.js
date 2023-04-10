import bcrypt from "bcryptjs";
import pool from "../config/db_config.js";

const comCtr = {
  GET_COMPANY: async (req, res) => {
    try {
      const companiesList = await pool.query(
        `SELECT * FROM company where isDeleted='false'`
      );
      res.status(200).send(companiesList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_COMPANY: async (req, res) => {
    try {
      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1 AND isDeleted='false'`,
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
  GET_COMPANY_BY_ADMIN: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      const foundedCompany = await pool.query(
        `SELECT * FROM company WHERE company_id=$1 and isDeleted='false'`,
        [company_id]
      );
      if (!foundedCompany.rows[0]) {
        return res.status(404).send("Company not found!");
      }
      res.send(foundedCompany.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
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
      const { company_title: com_title, company_address: com_address } =
        foundedCompany.rows[0];

      const foundedEmail = await pool.query(
        `SELECT * from emails where id=$1`,
        [foundedCompany.rows[0].company_email_id]
      );

      (company_title = company_title ? company_title : com_title),
        (company_address = company_address ? company_address : com_address),
        (company_email = company_email
          ? company_email
          : foundedEmail.rows[0].title);

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

      if (company_id !== req.params.id) {
        return res
          .status(400)
          .send("You do not have permission to delete this company");
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

      if (company_id_jwt !== req.params.id) {
        return res
          .status(400)
          .send("You do not have permission to delete this company");
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
        return res.status(400).send("Only admins can see users list");
      }

      const usersList = await pool.query(
        `SELECT * FROM users where company_id=$1 and user_role='company_user' and isDeleted='false'`,
        [company_id]
      );
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
        `SELECT * FROM users WHERE user_id=$1 AND company_id=$2 AND isDeleted='false'`,
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
  UPDATE_USER: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let {
        user_id,
        user_name: user_n,
        user_role,
        company_id,
      } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can update users");
      }

      const foundedUser = await pool.query(
        `SELECT * FROM users WHERE user_id=$1`,
        [req.params.id]
      );

      if (!foundedUser.rows[0]) {
        return res.status(404).send("User not found!");
      }
      if (company_id !== foundedUser.rows[0].company_id) {
        return res
          .status(400)
          .send("You do not have permission to update this user");
      }

      let { user_name, user_age, user_email, user_password } = req.body;

      const foundedEmail = await pool.query(
        `SELECT * from emails where id=$1`,
        [foundedUser.rows[0].user_email_id]
      );

      const {
        user_name: user_name_user,
        user_age: user_a,
        user_password: user_p,
      } = foundedUser.rows[0];

      const hashUserPsw = await bcrypt.hash(user_password, 12);

      (user_name = user_name ? user_name : user_name_user),
        (user_age = user_age ? user_age : user_a),
        (user_password = user_password ? hashUserPsw : user_p),
        (user_email = user_email ? user_email : foundedEmail.rows[0].title);

      await pool.query(`UPDATE emails SET title=$1 where id=$2`, [
        user_email,
        foundedUser.rows[0].user_email_id,
      ]);

      await pool.query(
        `UPDATE users SET user_name=$1, user_age=$2, user_password=$3 where user_id=$4`,
        [user_name, user_age, user_password, req.params.id]
      );
      res.status(200).send(`Company user updated successfully by ${user_n}!`);
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

      if (company_id_jwt !== foundedUser.rows[0].company_id) {
        return res
          .status(400)
          .send("You do not have permission to delete this user");
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
};

export { comCtr };
