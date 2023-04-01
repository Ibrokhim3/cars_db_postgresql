import pool from "../config/db_config.js";

const customsCtr = {
  //delete qilinmadi
  //customer da update bolmaydi
  GET_ALL_CUSTOMERS: async (req, res) => {
    const userData = await pool.query(`SELECT * FROM jwt`);
    let { user_id, user_name, user_role, company_id } = userData.rows[0];

    if (user_role !== "admin") {
      return res.status(400).send("Only admins can see the list of customers!");
    }
    const customersList = await pool.query(
      `SELECT * FROM customers where company_id=$1`,
      [company_id]
    );
    res.status(200).send(customersList.rows);
  },
  GET_ONE_CUTOMER: async (req, res) => {
    const userData = await pool.query(`SELECT * FROM jwt`);
    let { user_id, user_name, user_role, company_id } = userData.rows[0];

    if (user_role !== "admin") {
      return res.status(400).send("Only admins can see the list of customers!");
    }
    const foundedCustomer = await pool.query(
      `SELECT * FROM customers WHERE company_id=$1 AND customer_id=$2`,
      [company_id, req.params.id]
    );
    if (!foundedCustomer.rows[0]) {
      return res.status(404).send("Customer not found!");
    }
    res.send(foundedCustomer.rows[0]);
  },
  CREATE_CUSTOMER: async (req, res) => {
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

    await pool.query(
      `INSERT INTO customers(user_id, car_id, company_id) VALUES($1,$2,$3)`,
      [user_id, car_id, companyId.rows[0].company_id]
    );
    res.status(201).send("You're a customer!");
  },

  DELETE_CUSTOMER: async (req, res) => {
    //delete qivotkanda admin boshqa company customer larni ochirib tashlomasligi kerak
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

    const deletedCustomer = await pool.query(
      `DELETE FROM customers WHERE customer_id=$1 AND company_id=$2`,
      [req.params.id, company_id]
    );
    // console.log(deletedCustomer.rows);
    // if (!deletedCustomer.rows[0]) {
    //   return res.status(400).send("You cannot delete this customer :(");
    // }
    res
      .status(200)
      .send(
        `${foundedCustomer.rows[0].customer_id} was deleted successfully :)`
      );
  },
};

export default customsCtr;
