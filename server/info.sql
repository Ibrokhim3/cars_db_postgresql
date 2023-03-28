DROP DATABASE IF EXISTS cars_db;
  CREATE DATABASE cars_db;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
     user_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     user_name VARCHAR(50) NOT NULL,
     user_role VARCHAR(20)  NOT NULL DEFAULT 'user',
     user_email_id VARCHAR NOT NULL,
     user_age INTEGER NOT NULL,
     user_password VARCHAR(30) NOT NULL,
     company_id VARCHAR,
     
);

--

ALTER TABLE users ADD CONSTRAINT fk_user_email
FOREIGN KEY(user_email_id) 
	  REFERENCES emails(id);
--

ALTER TABLE users ADD CONSTRAINT fk_users_com
FOREIGN KEY(company_id) 
    REFERENCES company(company_id);

--

CREATE TABLE emails(
     id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     title VARCHAR(50) NOT NULL
     
);


CREATE TABLE company(
     company_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     company_title VARCHAR(50) NOT NULL,
     company_email_id VARCHAR NOT NULL,
     company_adress VARCHAR NOT NULL,
     created_by VARCHAR NOT NULL,

     CONSTRAINT fk_company_email
       FOREIGN KEY(company_email_id) 
	  REFERENCES emails(id),

     CONSTRAINT fk_company_cr_by
       FOREIGN KEY(created_by) 
	  REFERENCES users(user_id)
     
);


CREATE TABLE cars(
     car_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     car_title VARCHAR(50) NOT NULL,
     car_brand VARCHAR(50) NOT NULL,
     car_price VARCHAR NOT NULL,
     car_color VARCHAR(50) NOT NULL,
     company_id VARCHAR NOT NULL,
     created_by VARCHAR NOT NULL,

     CONSTRAINT fk_company_id
       FOREIGN KEY(company_id) 
	  REFERENCES company(company_id),

     CONSTRAINT fk_company_cr_by
       FOREIGN KEY(created_by) 
	  REFERENCES users(user_id)
     
);

CREATE TABLE customers(
     customer_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     user_id VARCHAR NOT NULL,
     car_id VARCHAR NOT NULL,
     company_id VARCHAR NOT NULL,
     created_at DATE NOT NULL DEFAULT CURRENT_DATE,

     CONSTRAINT fk_customers_users
       FOREIGN KEY(user_id) 
	  REFERENCES users(user_id),

     CONSTRAINT fk_customers_car
       FOREIGN KEY(car_id) 
	  REFERENCES cars(car_id),

     CONSTRAINT fk_customers_company
       FOREIGN KEY(company_id) 
	  REFERENCES company(company_id)

     
);


CREATE TABLE session(
     session_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     user_id VARCHAR NOT NULL,
     start_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
     end_at TIMESTAMP(0),

     CONSTRAINT fk_customers_users
       FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
     
);



--Guide draft DATE + TIME without miliseconds

  DROP TABLE users;
CREATE TABLE users(
     session_id VARCHAR UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     user_name VARCHAR NOT NULL,
     start_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
     end_at TIMESTAMP
     
);

INSERT INTO users(user_name) VALUES ('someone');


--Increase the length of varchar

 ALTER TABLE users ALTER user_password TYPE VARCHAR;

 --

SELECT id FROM emails WHERE title = $1, [user_email]


--

INSERT INTO users(user_name, user_role, user_email_id,
       user_age,
      user_password) VALUES('Sarvar', 'admin', '7dcdff16-f104-4626-b6c2-54f88d1add50', 24, '2020i');


INSERT INTO emails(title) VALUES('sarvar@gmail.com');

--

CREATE TABLE jwt(
     user_id VARCHAR UNIQUE NOT NULL,
     user_name VARCHAR(50) NOT NULL,
     user_role VARCHAR(20)  NOT NULL
     
);


--

ALTER TABLE users ALTER COLUMN user_role DROP NOT NULL;


--











