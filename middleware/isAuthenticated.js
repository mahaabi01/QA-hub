// const jwt = require("jsonwebtoken");
// const { promisify } = require("util");
// const { users } = require("../model");

// exports.isAuthenticated = async (req, res, next) => {
//   const token = req.cookies.jwtToken;
//   console.log("token", token);
//   if (!token || token === null || token === undefined) {
//     return res.redirect("/login");
//   }
//   const decryptedResult = await promisify(jwt.verify)(token, "password");
//   console.log("descrypted Result:", decryptedResult);
//   const data = await users.findByPk(decryptedResult.id);
//   if (!data) {
//     return res.send("Invalid token.");
//   }
//   req.userId = decryptedResult.id;

//   next();
// };

const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const { users } = require('../model')

exports.isAuthenticated = async(req,res,next)=>{
    const token = req.cookies.jwtToken
    if(!token || token === null || token === undefined ){
        return res.redirect('/login')
    }
   const decryptedResult =  await promisify(jwt.verify)(token,'password')
   console.log("decrypted Result:", decryptedResult);
   const data =  await users.findByPk(decryptedResult.id)
   if(!data){
    return res.send("No user belonging to that id")
   }
   req.userId = decryptedResult.id

   next()
}