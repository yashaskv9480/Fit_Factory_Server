process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express')
const app = express()
const dotenv = require('dotenv')

const db = require('./db/DBConfig')
const admin_routes = require('./routes/admin')
const user_routes = require('./routes/users')
const client_routes = require('./routes/client')
const google_routes = require('./routes/google_oauth')
dotenv.config()


const port = process.env.PORT || 5000

app.use('/api/admin',admin_routes)
app.use('/api/user',user_routes)
app.use('/api/client',client_routes)
app.use('/api/google',google_routes)

app.get('/api/test-database', async(req, res) => {
    try {
        const allusers = await db.query(
            'SELECT * FROM user_details'
        );
        res.json(allusers.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})