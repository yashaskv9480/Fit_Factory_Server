const db = require('../db/DBConfig')

exports.checkuserRole = async (user_id) => {
    const userRoleId = await db.query("SELECT role_id FROM user_role_management WHERE user_id = $1", [user_id]);
    const userRole = await db.query("Select role FROM roles where role_id = $1",[userRoleId.rows[0].role_id])
    return userRole.rows[0].role;
}

exports.checkuserId = async (email) => {
    const userQuery = await db.query("SELECT user_id FROM user_details WHERE email = $1", [email]); 
    if (userQuery.rows.length > 0) {
      const user_id = userQuery.rows[0].user_id;
      return user_id;
    } else {
      return ;  
    }
}