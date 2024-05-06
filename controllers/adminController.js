const db = require('../db/DBConfig')

exports.viewUsers = async (req,res) => {
    try{
        const getUsersResult = await db.query(`SELECT ud.user_id, ud.name, ud.email, ud.mobile
        FROM user_details ud
        JOIN user_role_management urm ON ud.user_id = urm.user_id
        JOIN roles r ON urm.role_id = r.role_id
        WHERE r.role = 'user';
        `)
        res.status(200).json(getUsersResult.rows)
    }
    catch(err){
        res.status(500).json({message:"Error in retriving"})
    }
} 

exports.viewClients = async(req,res) => {
    try{
        const getClientResult = await db.query(`SELECT ud.user_id,gd.gym_id,ud.name, ud.email, ud.mobile, gd.gym_name, gd.location, gd.gym_price
        FROM user_details ud
        JOIN user_role_management urm ON ud.user_id = urm.user_id
        JOIN gym_details gd ON ud.user_id = gd.user_id
        JOIN roles r ON urm.role_id = r.role_id
        WHERE r.role = 'client';`)
        res.status(200).json(getClientResult.rows)
    }
    catch(err){
        res.status(500).json({message:"Error in retriving"})
    }
}

exports.viewAllBookings = async(req,res) => {
    try{
        const getAllBookingsResult = await db.query( `SELECT ud.name, gd.gym_name, b.booking_id, b.booking_date, b.amount
        FROM bookings b
        JOIN user_details ud ON b.user_id = ud.user_id
        JOIN gym_details gd ON b.gym_id = gd.gym_id;
        `)
        res.status(200).json(getAllBookingsResult.rows)
    }
    catch(err){
        res.status(500).json({message:"Error in retriving"})
    }
}