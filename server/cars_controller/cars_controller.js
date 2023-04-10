import pool from "../config/db_config.js";

const carsCtr = {
  GET_CARS: async (req, res) => {
    try {
      const carsList = await pool.query(
        `SELECT * FROM cars where isDeleted='false'`
      );
      if (!carsList.rows[0]) {
        return res.status(404).send("There are no cars yet");
      }
      res.status(200).send(carsList.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_CAR: async (req, res) => {
    try {
      const foundedCar = await pool.query(
        `SELECT * FROM cars WHERE car_id=$1 and isDeleted='false'`,
        [req.params.id]
      );
      if (!foundedCar.rows[0]) {
        return res.status(404).send("Car not found!");
      }
      res.send(foundedCar.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_CARS_BY_ADMIN: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const { user_id, user_name, user_role, company_id } = userData.rows[0];

      const foundedCars = await pool.query(
        `SELECT * FROM cars where company_id=$1 and isDeleted='false'`,
        [company_id]
      );
      if (!foundedCars.rows[0]) {
        return res.status(404).send("Car not found!");
      }
      res.send(foundedCars.rows);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ONE_CAR_BY_ADMIN: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const { user_id, user_name, user_role, company_id } = userData.rows[0];

      const foundedCar = await pool.query(
        `SELECT * FROM cars where company_id=$1 and car_id=$2 and isDeleted='false'`,
        [company_id, req.params.id]
      );
      if (!foundedCar.rows[0]) {
        return res.status(404).send("Car not found!");
      }
      res.send(foundedCar.rows[0]);
    } catch (error) {
      return console.log(error.message);
    }
  },

  CREATE_CAR: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const { user_id, user_name, user_role, company_id } = userData.rows[0];

      if (!company_id) {
        return res
          .status(400)
          .send("Company cars can be added after company creation");
      }

      if (user_role !== "admin") {
        return res.status(400).send("Only admins can add car!");
      }

      const { car_title, car_brand, car_price, car_color } = req.body;
      const foundedeCar = await pool.query(
        `SELECT * FROM cars where car_title = $1 `,
        [car_title]
      );

      if (foundedeCar.rows[0]) {
        return res.send("Car already exists!");
      }

      await pool.query(
        `INSERT INTO cars(car_title, 
      car_brand, car_price, car_color, company_id,
      created_by) VALUES($1,
        $2, $3, $4, $5, $6)`,
        [car_title, car_brand, car_price, car_color, company_id, user_id]
      );

      return res
        .status(201)
        .send(`The ${car_title} addedd successfully addedd by ${user_name} `);
    } catch (error) {
      return console.log(error.message);
    }
  },
  UPDATE_CAR: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const { user_id, user_name, user_role, company_id } = userData.rows[0];

      if (user_role !== "admin") {
        return res.status(400).send("Only admins can update the cars!");
      }

      const foundedCar = await pool.query(
        `SELECT * FROM cars WHERE car_id=$1`,
        [req.params.id]
      );

      if (!foundedCar.rows[0]) {
        return res.status(404).send("Car not found!");
      }

      if (company_id !== foundedCar.rows[0].company_id) {
        return res
          .status(404)
          .send("You are not permitted to update this car!");
      }
      let { car_title, car_brand, car_price, car_color } = req.body;

      const {
        car_title: c_title,
        car_brand: c_brand,
        car_price: c_price,
        car_color: c_color,
      } = foundedCar.rows[0];

      (car_title = car_title ? car_title : c_title),
        (car_brand = car_brand ? car_brand : c_brand),
        (car_price = car_price ? car_price : c_price);
      car_color = car_color ? car_color : c_color;

      await pool.query(
        `UPDATE cars SET 
        car_title=$1, car_brand=$2, car_price=$3, car_color=$4, company_id=$5 where car_id=$6`,
        [car_title, car_brand, car_price, car_color, company_id, req.params.id]
      );
      res
        .status(200)
        .send(
          `${c_title} updated successfully updated by ${user_name} to ${car_title}`
        );
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_CAR: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      let { user_id, user_name, user_role, company_id } = userData.rows[0];
      if (user_role !== "admin") {
        return res.status(400).send("Only admins can delete car");
      }
      const foundedCar = await pool.query(
        `SELECT * FROM cars WHERE car_id=$1`,
        [req.params.id]
      );
      if (!foundedCar.rows[0]) {
        return res.status(404).send("Car not found!");
      }

      if (company_id !== foundedCar.rows[0].company_id) {
        return res
          .status(404)
          .send("You are not permitted to delete this car!");
      }

      await pool.query(`DELETE FROM customers WHERE car_id=$1`, [
        foundedCar.rows[0].car_id,
      ]);

      await pool.query(`DELETE FROM cars where car_id=$1`, [
        foundedCar.rows[0].car_id,
      ]);
      res
        .status(200)
        .send(`${foundedCar.rows[0].car_title} was deleted successfully`);
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_CAR_BOOL: async (req, res) => {
    try {
      const userData = await pool.query(`SELECT * FROM jwt`);
      const {
        user_id: user_id_jwt,
        user_name: user_name_jwt,
        user_role: user_role_jwt,
        company_id: company_id_jwt,
      } = userData.rows[0];

      if (user_role_jwt !== "admin") {
        return res.status(400).send("Only admins can remove cars");
      }

      const foundedCar = await pool.query(
        `SELECT * FROM cars WHERE car_id=$1`,
        [req.params.id]
      );

      if (!foundedCar.rows[0]) {
        return res.status(404).send("Car not found!");
      }

      if (company_id_jwt !== foundedCar.rows[0].company_id) {
        return res
          .status(404)
          .send("You are not permitted to delete this car!");
      }

      await pool.query(`UPDATE cars SET isDeleted=true where car_id=$1`, [
        req.params.id,
      ]);
      res.status(200).send(`Car was deleted successfully by ${user_name_jwt}`);
    } catch (error) {
      return console.log(error.message);
    }
  },
};

export { carsCtr };
