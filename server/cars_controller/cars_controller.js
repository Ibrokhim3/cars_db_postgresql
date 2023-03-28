import pool from "../config/db_config.js";

const carsCtr = {
  CREATE_COMPANY: async (req, res) => {
    try {
      const { company_title, company_address, company_email } = req.body;
      const foundedeCompany = await pool.query(
        `SELECT * FROM emails where title = $1 `,
        [company_email]
      );
      if (foundedeCompany.rows[0]) {
        return res.send("Company already exists!");
      }
      await pool.query(`INSERT INTO emails(title) VALUES($1)`, [company_email]);

      const userData = await pool.query(`SELECT * FROM jwt`);
      const { user_id, user_name, user_role } = userData.rows[0];
      let emailId = await pool.query(`SELECT id FROM emails where title=$1`, [
        company_email,
      ]);

      if (user_role !== "admin") {
        return res.status(400).send("Only admins can add company!");
      }
      await pool.query(
        `INSERT INTO company(company_title, 
      company_email_id, company_address,
      created_by) VALUES($1,
        $2, $3, $4)`,
        [company_title, emailId.rows[0].id, company_address, user_id]
      );
      return res
        .status(201)
        .send(`${user_name}, the company addedd successfully`);
    } catch (error) {
      return console.log(error.message);
    }
  },
};

export { carsCtr };
