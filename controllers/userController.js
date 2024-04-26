const db = require('../db/DBConfig')
const firebaseController = require('../controllers/firebase/firebase_controller')

exports.viewusers = async(req, res) => {
    try {
        const allusers = await db.query(
            'SELECT * FROM user_details'
        );
        res.json(allusers.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
}

exports.viewLocationGyms = async(req,res) => {
    try{
        const {location} = req.body;
        const locationGymsResult = await db.query(`SELECT * FROM gym_details WHERE location = $1`, [location])
        for(let i =0; i<  locationGymsResult.rows.length; i++){
            const imageUrl = await firebaseController.downlaod_image(locationGymsResult.rows[i].gym_image)
            locationGymsResult.rows[i].gym_image = imageUrl
        }
        console.log(locationGymsResult.rows)
        res.status(200).json(locationGymsResult.rows)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Please Contact admin"})
    }
}

exports.viewSingleGyms = async(req,res) => {
    try{
        const {gym_id} = req.params 
        const gymDetailsResult = await db.query("SELECT * from gym_details where gym_id = $1",[gym_id])
        const gymImagesResult = await gymGetImage(gym_id) 
        res.status(200).json({gymDetails: gymDetailsResult.rows,gymImages: gymImagesResult})
        
    }
    catch(err){
        res.status(500).json({message: "Contact Admin"})
    }
}

const gymGetImage = async(gym_id) => {
    try{
        const gymImagesResult = await db.query("Select image_name FROM gym_images WHERE gym_id = $1",[gym_id])
        for(let i =0; i<  gymImagesResult.rows.length; i++){
          const imageUrl = await firebaseController.downlaod_image(gymImagesResult.rows[i].image_name)
          gymImagesResult.rows[i].image_url = imageUrl
      }
        return gymImagesResult.rows
    }   
    catch(err){
        console.log(err)
        res.status(500).json({message: "Please Contact Admin"})
    }
}