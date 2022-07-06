const userModel = require("../models/userModel.js")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const createUser =  async function(req,res){
    try{
    const data = req.body;
    let user = await userModel.create(data)
    res.status(201).send({status:true, message:"Success", data : user})
}catch(err){
    res.status(500).send({status:false, message: err.message})
}}

const userLogin = async function (req, res) {
    try{
    const email = req.body.email;
    const password = req.body.password;
    // if (!validateEmail(authorEmail))  return res.status(400).send({ msg: "please enter valid email id" })
    if (!password.trim())  return res.status(400).send({ msg: "Password is required" })
    let user = await userModel.findOne({ email: email, password: password });
    if (!user)return res.status(400).send({status: false,msg: "email or the password is not corerct", });
    let token = jwt.sign(
        {userId: user._id.toString(),
         exp: 60 * 60 ,
         iat: (new Date().getTime())
        },
         "Project3-78" ,
);
    res.status(200).setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: "login Successful", data:{token: token }})
    }catch(err){return res.status(500).send({ msg: err.message })}}



    module.exports = {createUser,userLogin}