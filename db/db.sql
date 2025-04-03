/*User details table */
CREATE TABLE user_details (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    email VARCHAR(25) NOT NULL,
    password VARCHAR(25) ,
    mobile VARCHAR(25)
);


/* Roles Table */
CREATE TABLE roles(
    role_id SERIAL PRIMARY KEY,
    role VARCHAR(25)
);

/*User Role Management */
CREATE TABLE user_role_management(
    user_id integer REFERENCES user_details(user_id),
    role_id integer REFERENCES roles(role_id),
    PRIMARY KEY(user_id,role_id)
);

/*Gym details Table*/
CREATE TABLE gym_details(
    gym_id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES user_details(user_id),
    gym_name VARCHAR(25) NOT NULL,
    gym_image VARCHAR(50),
    description VARCHAR(25),
    location VARCHAR(25),
    address VARCHAR(25),
    timings VARCHAR(25),
    gym_price INT NOT NULL
);

/*Gym images Table*/
CREATE TABLE gym_images(
    gym_id integer REFERENCES gym_details(gym_id),
    image_name VARCHAR(50),
    PRIMARY KEY(gym_id,image_name)
);

/* Coupons Table */
CREATE TABLE coupons(
    coupon_id SERIAL PRIMARY KEY,
    coupon_name VARCHAR(25) NOT NULL,
    amount integer NOT NULL
);

/*Bookings Table*/
CREATE TABLE bookings(
    booking_id SERIAL,
    user_id integer REFERENCES user_details(user_id),
    gym_id integer REFERENCES gym_details(gym_id),
    booking_date DATE NOT NULL,
    amount integer NOT NULL,
    cid integer REFERENCES coupons(coupon_id),
    PRIMARY KEY(user_id,gym_id,booking_date)
);

/*Query Table*/
CREATE TABLE query(
    query_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES user_details(user_id),
    description VARCHAR(75)
);

/*Gym Equipments Table*/
CREATE TABLE gym_equipments(
    gym_id integer REFERENCES gym_details(gym_id),
    equipment_name VARCHAR(25),
    PRIMARY KEY gym_id,equipment_name
);

/*Queries */
ALTER SEQUENCE user_details_user_id_seq RESTART WITH 2;

INSERT INTO roles (role_id, role) VALUES (1, 'admin');
INSERT INTO roles (role_id, role) VALUES (2, 'user');   
INSERT INTO roles (role_id, role) VALUES (3, 'client');