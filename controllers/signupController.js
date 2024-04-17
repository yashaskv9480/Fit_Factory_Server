const db = require('../db/DBConfig')
const firebase_controller = require('./firebase/firebase_controller')
const { OAuth2Client } = require('google-auth-library');
const jwtTokenGeneration = require('./jwtAuthenticator')
const userDetails = require('./userDetails')
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

exports.user_signup = async (req, res) => {
    try{
    const {name,email,password,mobile} = req.body;
    const user_id = await userDetails.checkuserId(email);
    if(user_id){
        res.status(409).json({user_id:user_id})
    }
    else{
        await userSignup(name,email,password,mobile,2);
        res.status(200).send("User added sucessfully")
        console.log("User added")
    }
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
    console.log(email)
    const check_user_id = await userDetails.checkuserId(email);
    if(check_user_id){
        console.log(check_user_id)
        res.status(409).json({user_id:check_user_id})
    }
    else{
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
    const {email,name} = payload;
    const user_id = await userDetails.checkuserId(email)
    if(user_id){
        const userRole = userDetails.checkuserRole(user_id)
        const token = jwtTokenGeneration.token_generation(user_id,name,userRole)
        res.status(200).json({token: token})
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

