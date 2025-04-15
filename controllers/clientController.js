const db = require("../db/DBConfig");
const jwtAuthenticator = require("./jwtAuthenticator");
const firebase_controller = require("./firebase/firebase_controller");
const { v4: uuidv4 } = require("uuid");
const userDetails = require("./userDetails");
const { messaging } = require("firebase-admin");
const userController = require("./userController");

exports.viewGymDetails = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const gymDetailsQuery = await db.query(
      `SELECT u.user_id, u.name AS user_name, u.email, u.mobile,
    g.gym_id, g.gym_name, g.gym_image, g.location, g.address, g.timings, g.description, g.gym_price
FROM user_Details u
JOIN gym_Details g ON u.user_id = g.user_id
WHERE u.user_id = $1;
`,
      [user_id],
    );
    res.status(200).json(gymDetailsQuery.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Error in fetching" });
  }
};

exports.updateGymDetails = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const {
      name,
      email,
      mobile,
      gym_name,
      location,
      address,
      timings,
      description,
      gym_price,
    } = req.body;
    const updateUserQuery = `
    UPDATE user_Details AS u
    SET 
      name = $1,
      email = $2,
      mobile = $3
    FROM gym_Details AS g
    WHERE
      u.user_id = g.user_id
      AND u.user_id = $4;
  `;
    await db.query(updateUserQuery, [name, email, mobile, user_id]);

    const updateGymQuery = `
    UPDATE gym_Details AS g
    SET 
      gym_name = $1,
      location = $2,
      address = $3,
      timings = $4,
      description = $5,
      gym_price = $6
    WHERE
      g.user_id = $7;
  `;
    await db.query(updateGymQuery, [
      gym_name,
      location,
      address,
      timings,
      description,
      gym_price,
      user_id,
    ]);

    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Error is updating" });
  }
};

exports.gymAddImage = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { gym_id } = await userDetails.decodedToken(token);
    const imageBuffer = req.file.buffer;
    const uuid = uuidv4();
    const imageName = gym_id + uuid;
    const response = await firebase_controller.upload_image(
      imageBuffer,
      imageName,
    );
    const uploadImageResult = await db.query(
      "Insert into gym_images(gym_id,image_name) VALUES ($1,$2)",
      [gym_id, imageName],
    );
    res.status(200).json({ message: "Successfully Uplaoded" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Error uploading image.");
  }
};

exports.gymGetImage = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { gym_id } = await userDetails.decodedToken(token);
    const gymImagesResult = await db.query(
      "Select image_name FROM gym_images WHERE gym_id = $1",
      [gym_id],
    );
    for (let i = 0; i < gymImagesResult.rows.length; i++) {
      const imageUrl = await firebase_controller.downlaod_image(
        gymImagesResult.rows[i].image_name,
      );
      gymImagesResult.rows[i].image_url = imageUrl;
    }
    res.status(200).json(gymImagesResult.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Please Contact Admin" });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { gym_id } = await userDetails.decodedToken(token);
    const gymBookingResult = await db.query(
      "SELECT b.booking_id,b.booking_date,b.amount, u.name FROM bookings b JOIN user_details u ON b.user_id = u.user_id WHERE b.gym_id = $1",
      [gym_id],
    );
    res.status(200).json(gymBookingResult.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Contact admin" });
  }
};

exports.deleteGymImages = async (req, res) => {
  try {
    const { image_name } = req.params;
    await firebase_controller.delete_image(image_name);
    await db.query("Delete from gym_images where image_name = $1", [
      image_name,
    ]);
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500), json({ message: "Failure" });
  }
};
