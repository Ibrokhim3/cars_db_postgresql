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

ALTER TABLE emails ADD CONSTRAINT fk_company_email
FOREIGN KEY(user_email_id) 
	  REFERENCES emails(id);


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

-- ALTER TABLE company ADD CONSTRAINT fk_company_cr_by
-- FOREIGN KEY(created_by) 
-- 	  REFERENCES users(user_id);


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
     end_at TIMESTAMP(0) CURRENT_TIMESTAMP
     
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

ALTER TABLE company ADD UNIQUE(company_title);

ALTER TABLE cars ADD UNIQUE(car_title);

--


UPDATE cars SET 
      (car_title ='fdsfdasf', car_brand='adfadsf', car_price='adfadsf', car_color='adsfdsaf', company_id='asdfsdf' where car_id='2bfccc8a-dd09-4cc8-a80e-380e2a906624');


--

ALTER TABLE company DROP CONSTRAINT fk_company_email;


DELETE FROM users where company_id="35272cba-aaf9-4abe-848d-9aad8c6946da";



--APIS

SELECT
	c.customer_id,
	c.first_name customer_first_name,
	c.last_name customer_last_name,
	s.first_name staff_first_name,
	s.last_name staff_last_name,
	amount,
	payment_date
FROM
	customer c
INNER JOIN payment p 
    ON p.customer_id = c.customer_id
INNER JOIN staff s 
    ON p.staff_id = s.staff_id
ORDER BY payment_date;

-- API 1 

SELECT 
u.*,
c.car_title,
com.company_title
FROM cars c
INNER JOIN company com
ON c.company_id = com.company_id  
INNER JOIN users u
ON u.company_id = com.company_id
WHERE u.user_id = 'ed2aef7d-2bb4-4087-97ce-732ac9158ca9';





-- API 2 ishladi

SELECT
u.user_id,
u.user_name,
u.user_role,
u.user_age,
u.user_password,
u.user_email_id,
s.start_at,
s.end_at
FROM session s
JOIN users u 
ON u.user_id = s.user_id
WHERE s.user_id = $1

--API 3 ishladi


SELECT 
*
FROM 
users
WHERE company_id = '5708b5d7-e39e-44fd-8a71-af2dc723d4aa';

-- API 4 ishladi

SELECT * 
FROM cars
WHERE company_id = '5708b5d7-e39e-44fd-8a71-af2dc723d4aa';

-- API 5  ishladi

SELECT
c.*,
e.title
FROM company c
JOIN emails e
ON c.company_email_id = e.id
WHERE c.company_email_id = 'f8c89f29-6d82-48f3-bb1c-2c5453100328';

-- API 6 ishladi

SELECT 
c.car_title,
com.company_title
FROM cars c
JOIN company com
ON c.company_id = com.company_id
WHERE c.car_id = '264380af-f588-4323-81d1-c028b71e5dde';









