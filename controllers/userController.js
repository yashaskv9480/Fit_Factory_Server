const db = require("../db/DBConfig");
const firebaseController = require("../controllers/firebase/firebase_controller");
const userDetails = require("./userDetails");
const { messaging } = require("firebase-admin");

exports.viewUserDetails = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const userDetailResponse = await db.query(
      `Select user_id,name,email,mobile from user_details where user_id = $1`,
      [user_id]
    );
    res.json(userDetailResponse.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.viewLocationGyms = async (req, res) => {
  try {
    const { location } = req.body;
    const locationGymsResult = await db.query(
      `SELECT * FROM gym_details WHERE location = $1`,
      [location]
    );
    for (let i = 0; i < locationGymsResult.rows.length; i++) {
      const imageUrl = await firebaseController.downlaod_image(
        locationGymsResult.rows[i].gym_image
      );
      locationGymsResult.rows[i].gym_image = imageUrl;
    }
    res.status(200).json(locationGymsResult.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Please Contact admin" });
  }
};

exports.viewSingleGyms = async (req, res) => {
  try {
    const { gym_id } = req.params;
    const gymDetailsResult = await db.query(
      "SELECT * from gym_details where gym_id = $1",
      [gym_id]
    );
    const gymImagesResult = await gymGetImage(gym_id);
    res
      .status(200)
      .json({ gymDetails: gymDetailsResult.rows, gymImages: gymImagesResult });
  } catch (err) {
    res.status(500).json({ message: "Contact Admin" });
  }
};

exports.bookGym = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { bookingDates, gym_id, gym_price } = req.body;
    const { user_id } = await userDetails.decodedToken(token);
    const query =
      "Insert into bookings(user_id,gym_id,booking_date,cid,amount) Values($1,$2,$3,$4,$5)";
    console.log(bookingDates);
    if (Array.isArray(bookingDates)) {
      for (const date of bookingDates) {
        const values = [user_id, gym_id, date, null, gym_price];
        await db.query(query, values);
      }
    } else {
      const values = [user_id, gym_id, bookingDates, null, gym_price];
      await db.query(query, values);
    }
    res.status(200).json({ message: "Succesfully Booked" });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Duplicate booking attempt" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const { name, email, mobile } = req.body;
    const query = `UPDATE user_details 
    SET name = $1, mobile = $2, email = $3
    WHERE user_id = $4;`;
    const values = [name, mobile, email, user_id];
    await db.query(query, values);
    res.status(200).json({ message: "Succesfully Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Contact Admin" });
  }
};

exports.resetOauthPassword = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const { newPassword } = req.body;
    const resetPasswordQuery = await db.query(
      `Update user_details SET password = $1 where user_id = $2`,
      [newPassword, user_id]
    );
    res.status(200).json({ message: "Succesfully Password Reset" });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const { password, newPassword } = req.body;

    const getCurrentPasswordQuery = await db.query(
      `SELECT password FROM user_details WHERE user_id = $1`,
      [user_id]
    );
    const currentPassword = getCurrentPasswordQuery.rows[0].password;

    if (currentPassword === password) {
      await db.query(
        `UPDATE user_details SET password = $1 WHERE user_id = $2`,
        [newPassword, user_id]
      );

      res.status(200).json({ message: "Successfully Changed" });
    } else {
      res.status(405).json({ message: "Password was wrong" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCurrentPassword = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { user_id } = await userDetails.decodedToken(token);
    const query = `SELECT password FROM user_details WHERE user_id = $1`;
    const result = await db.query(query, [user_id]);

    const currentPassword = result.rows[0]?.password;
    if (currentPassword === null || currentPassword === undefined) {
      return res
        .status(202)
        .json({ message: "No password found for the user" });
    } else {
      return res.status(200).json({ message: "Password exists" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const gymGetImage = async (gym_id) => {
  try {
    const gymImagesResult = await db.query(
      "Select image_name FROM gym_images WHERE gym_id = $1",
      [gym_id]
    );
    for (let i = 0; i < gymImagesResult.rows.length; i++) {
      const imageUrl = await firebaseController.downlaod_image(
        gymImagesResult.rows[i].image_name
      );
      gymImagesResult.rows[i].image_url = imageUrl;
    }
    return gymImagesResult.rows;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Please Contact Admin" });
  }
};
