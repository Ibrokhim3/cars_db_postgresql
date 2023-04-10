import pool from "../config/db_config.js";

const customsCtr = {
  GET_ALL_CUSTOMERS: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];

      if (user_role !== "admin") {
        return res
          .status(400)
          .send("Only admins can see the list of customers!");
      }
      const customersList = await pool.query(
        `SELECT * FROM customers where company_id=$1 and isDeleted='false'`,
        [company_id]
      );
      if (!customersList) {
        return res.status(404).send("There are no customers yet!");
      }
      res.status(200).send(customersList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_CUSTOMER: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];

      if (user_role !== "admin") {
        return res
          .status(400)
          .send("Only admins can see the list of customers!");
      }
      const foundedCustomer = await pool.query(
        `SELECT * FROM customers WHERE company_id=$1 AND customer_id=$2 AND isDeleted='false'`,
        [company_id, req.params.id]
      );
      if (!foundedCustomer.rows[0]) {
        return res.status(404).send("Customer not found!");
      }
      res.send(foundedCustomer.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
  CREATE_CUSTOMER: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role } = userData.rows[0];
      if (user_role !== "user") {
        return res.status(400).send("Only users can be a customer!");
      }
      const { car_id } = req.body;
      const companyId = await pool.query(
        `SELECT company_id FROM cars WHERE car_id=$1`,
        [car_id]
      );

      if (!companyId.rows[0]) {
        return res.status(400).send("The car was not found!");
      }

      const foundedeCustomer = await pool.query(
        `SELECT * FROM customers where user_id = $1`,
        [user_id]
      );

      if (foundedeCustomer.rows[0]) {
        return res.status(400).send("You can buy only one car");
      }
      await pool.query(`UPDATE users SET company_id=$1 where user_id=$2`, [
        companyId.rows[0].company_id,
        user_id,
      ]);

      await pool.query(
        `INSERT INTO customers(user_id, car_id, company_id) VALUES($1,$2,$3)`,
        [user_id, car_id, companyId.rows[0].company_id]
      );
      res.status(201).send("You're a customer!");
    } catch (error) {
      return console.log(error.message);
    }
  },

  DELETE_CUSTOMER: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can delete customers");
      }
      const foundedCustomer = await pool.query(
        `SELECT * FROM customers WHERE customer_id=$1`,
        [req.params.id]
      );
      if (!foundedCustomer.rows[0]) {
        return res.status(404).send("Customer not found!");
      }

      if (company_id !== foundedCustomer.rows[0].company_id) {
        return res
          .status(404)
          .send("You are not permitted to delete this customer!");
      }

      await pool.query(`DELETE FROM customers where customer_id=$1`, [
        req.params.id,
      ]);

      res
        .status(200)
        .send(
          `${foundedCustomer.rows[0].customer_id} was deleted successfully :)`
        );
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_CUSTOMER_BOOL: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const {
        user_id: user_id_jwt,
        user_name: user_name_jwt,
        user_role: user_role_jwt,
        company_id: company_id_jwt,
      } = userData.rows[0];

      if (user_role_jwt !== "admin") {
        return res.status(400).send("Only admins can delete customers");
      }

      const foundedCustomers = await pool.query(
        `SELECT * FROM customers WHERE customer_id=$1`,
        [req.params.id]
      );

      if (!foundedCustomers.rows[0]) {
        return res.status(404).send("Csutomers not found!");
      }

      if (company_id_jwt !== foundedCustomers.rows[0].company_id) {
        return res
          .status(404)
          .send("You are not permitted to delete this customer!");
      }

      await pool.query(
        `UPDATE customers SET isDeleted=true where customer_id=$1`,
        [req.params.id]
      );
      res
        .status(200)
        .send(`Customer was deleted successfully by ${user_name_jwt}`);
    } catch (error) {
      return console.log(error.message);
    }
  },
};

export default customsCtr;
