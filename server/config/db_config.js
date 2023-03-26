import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cars_db",
  password: "2626",
  port: process.env.PORT_POSTGRES,
});

export default pool;
