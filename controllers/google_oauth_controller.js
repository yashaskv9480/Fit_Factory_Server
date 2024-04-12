const axios = require('axios'); 
    
const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ;

const GOOGLE_CALLBACK_URL = "http://localhost:5000/api/google/callback";

const GOOGLE_OAUTH_SCOPES = [

    "https%3A//www.googleapis.com/auth/userinfo.email",
    
    "https%3A//www.googleapis.com/auth/userinfo.profile"
    ];

exports.google_consent = async(req,res) => {
    try{
        const state = "some_state";
        const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
        res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
    }
    catch(err){
        console.log(err)
    }

}

exports.google_callback = async(req,res) => {
    try {
        const {code} = req.query;
        console.log('Authorization Code:', code);
  
        console.log({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:5000/api/google/callback',
          grant_type: 'authorization_code'
        })
  
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:5000/api/google/callback',
            grant_type: 'authorization_code'
          }
        );
        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);
  
        const userResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const userDetails = userResponse.data;
        console.log('User Details:', userDetails);
        res.status(200).json({ message: 'Authentication successful', user: userDetails.name + " " + userDetails.email });
      } catch (error) {
        console.error('Error saving code:', error.message);
        res.status(500).json({ message: 'Failed to save code' });
      }
}