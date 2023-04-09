import pool from "../config/db_config.js";

const userData = await pool.query(`SELECT * FROM jwt`);
if (userData.rows[0]) {
  const { user_id, user_name, user_role, company_id } = userData.rows[0];
}

const apiCtr = {
  GET_SESSION_INFO: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about user");
    // }
    const sessionInfo = await pool.query(
      `SELECT
    u.*,
    s.start_at,
    s.end_at
    FROM session s
    JOIN users u 
    ON u.user_id = s.user_id
    WHERE s.user_id = $1`,
      [req.params.id]
    );
    if (!sessionInfo.rows) {
      return res
        .status(400)
        .send("There is no information related to this user ");
    }
    res.send(sessionInfo.rows);
  },
  GET_USER_INFO_BY_COMPANY: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about company");
    // }
    const userInfo = await pool.query(
      `SELECT 
    *
    FROM 
    users
    WHERE company_id = $1`,
      [req.params.id]
    );

    if (!userInfo.rows[0]) {
      return res
        .status(400)
        .send("There is no information related to this company");
    }
    res.send(userInfo.rows);
  },
  GET_CAR_INFO: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about car");
    // }
    const carInfo = await pool.query(
      `SELECT 
    *
    FROM 
    cars
    WHERE company_id = $1`,
      [req.params.id]
    );
    if (!carInfo.rows[0]) {
      return res
        .status(400)
        .send("There is no information related to this car");
    }

    res.send(carInfo.rows);
  },
  GET_EMAIL_INFO: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about email");
    // }
    const emailInfo = await pool.query(
      `SELECT
      c.*,
      e.title
      FROM company c
      JOIN emails e
      ON c.company_email_id = e.id
      WHERE c.company_email_id = $1`,
      [req.params.id]
    );
    if (!emailInfo.rows[0]) {
      return res
        .status(400)
        .send("There is no information related to this email");
    }

    res.send(emailInfo.rows);
  },
  GET_CAR_TITLE: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about car");
    // }
    const carInfo = await pool.query(
      `SELECT 
      c.car_title,
      com.company_title
      FROM cars c
      JOIN company com
      ON c.company_id = com.company_id
      WHERE c.car_id = $1
      `,
      [req.params.id]
    );
    if (!carInfo.rows[0]) {
      return res
        .status(400)
        .send("There is no information related to this car");
    }

    res.send(carInfo.rows);
  },
  GET_CUSTOMER_INFO: async (req, res) => {
    // if (user_role === "user") {
    //   return res
    //     .status(400)
    //     .send("Only admins can see the information about customer");
    // }

    const smt = await pool.query(`SELECT * FROM customers where user_id=$1`, [
      req.params.id,
    ]);

    const custInfo = await pool.query(
      `
      SELECT 
      u.*,
      c.car_title,
      com.company_title
      FROM users u
      INNER JOIN cars c
      ON c.car_id = $1    
      INNER JOIN company com
      ON c.company_id = com.company_id
      WHERE u.user_id = $2
      `,
      [smt.rows[0].car_id, req.params.id]
    );
    if (!custInfo.rows[0]) {
      return res
        .status(400)
        .send("There is no information related to this customer");
    }

    res.send(custInfo.rows);
  },
};

export { apiCtr };
