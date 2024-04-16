const db = require('../db/DBConfig')
const firebase_controller = require('./firebase/firebase_controller')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

async function userSignup(name, email, password, mobile, roleId) {
    const userQuery = "INSERT INTO user_details(name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const userValues = [name, email, password, mobile];
    const userResult = await db.query(userQuery, userValues);
    const user_id = userResult.rows[0].user_id;

    const roleQuery = "INSERT INTO user_role_management(user_id, role_id) VALUES ($1, $2)";
    const roleValues = [user_id, roleId];
    await db.query(roleQuery, roleValues);

    return user_id;
}

async function checkuserid(email) {
    const userQuery = await db.query("SELECT user_id FROM user_details WHERE email = $1", [email]);
    
    if (userQuery.rows.length > 0) {
      const user_id = userQuery.rows[0].user_id;
      console.log("User id:", user_id);
      return user_id;
    } else {
      return null;  
    }
  }
  

exports.user_signup = async (req, res) => {
    try{
    const {name,email,password,mobile} = req.body;
    await userSignup(name,email,password,mobile,2);
    res.status(200).send("User added sucessfully")
    console.log("User added")
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Contact admin")
    }
}


exports.client_signup = async(req,res) => {
    try{
    console.log(req.file)
    const {name,email,password,mobile} = req.body;
    const user_id = await userSignup(name,email,password,mobile,3);
    const {gym_name,description,location,address,timings} = req.body;
    const gymQuery = "Insert into gym_details(user_id,gym_name,description,location,address,timings) values ($1,$2,$3,$4,$5,$6) returning gym_id"
    const gymValues = [user_id,gym_name,description,location,address,timings]
    const gymResult = await db.query(gymQuery,gymValues);
    const gym_id = gymResult.rows[0].gym_id;
    const imageName = gym_id+"_"+req.file.originalname;
    const gymImageResult = await db.query("Update gym_details SET gym_image = $1 where gym_id = $2",[imageName,gym_id])
    const imageBuffer = req.file.buffer;
    firebase_controller.upload_image(imageBuffer,imageName);
    res.status(200).send("Sucessfully Added")
    console.log("Created successfully")
    }
    catch(err){
        console.log(err)
        res.status(404).send("Contact admin")
    }
}

exports.google_oauth = async(req,res) => {
    const { credential, client_id } = req.body;
    try {
    const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: client_id,
    });
    const payload = ticket.getPayload();
    console.log(payload)
    const {sub,email,name} = payload;
    const user_id = await checkuserid(email)
    if(user_id != null){
        res.status(200).json({user_id: user_id})
    }
    else{
        await userSignup(name,email,null,null,2)
        res.status(200).json(payload);
    }
    } catch (err) {
    console.log(err)
    res.status(400).json({ err });
    }
}

