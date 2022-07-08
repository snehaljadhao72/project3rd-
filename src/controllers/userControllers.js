const userModel = require("../models/userModel.js")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const mobile1=/^[0-9]{10}$/;

const email1 = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
const password1 = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

const isValid = function (value) {
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const createUser =  async function(req,res){
    try{
    const data = req.body;
    const {title , name , phone , email , password}= data
    if(Object.keys(data) == 0) return res.status(400).send({status:false , message:"please enter details"})

    if(!isValid(title))return res.status(400).send({status:false , message:"please enter title"})
    if(!title.includes("Mr","Miss", "Mr")) return res.status(400).send({status:false , message:"please enter valid title , It should be either of three(Mrs,Miss,Mr)"})

    if(!isValid(name))return res.status(400).send({status:false , message:"please enter name"})

    if(!isValid(phone))return res.status(400).send({status:false , message:"please enter phone number"})
    if(!mobile1.test(phone)) return res.status(400).send({status:false , message:"please enter valid phone number"})
    const usedNumber = await userModel.findOne({phone:phone})
    if(usedNumber) return res.status(409).send({status:false , message:" Phone number is already exist"})

    if(!isValid(email))return res.status(400).send({status:false , message:"please enter phone number"})
    if(!email1.test(email)) return res.status(400).send({status:false , message:"please enter valid emailId"})
    const usedEmail = await userModel.findOne({email:email})
    if(usedEmail) return res.status(409).send({status:false , message:" email is already exist"})

    if(!isValid(password))return res.status(400).send({status:false , message:"please enter password"})
    if(!password1.test(password)) return res.status(400).send({status:false , message:"Please enter strong password of atleast 8 character, It should contain atleast One Capital letter , one lower case letter and special character ,"})

    let user = await userModel.create(data)
    res.status(201).send({status:true, message:"Success", data : user})
}catch(err){
    res.status(500).send({status:false, message: err.message})
}}

const userLogin = async function (req, res) {
    try{
    const email = req.body.email;
    const password = req.body.password;
    if(!email)return res.status(400).send({ msg: "please enter email id" })
    if (!email1.test(email))  return res.status(400).send({ msg: "please enter valid email id" })
    if (!password)  return res.status(400).send({ msg: "Password is required" })
    let user = await userModel.findOne({ email: email, password: password });
    if (!user)return res.status(400).send({status: false,msg: "email or the password is not corerct", });
    let token = jwt.sign(
        {userId: user._id.toString(),
        //  exp: 60 * 600 ,
         iat: (new Date().getTime())
        },"Project3-78");
    res.status(200).setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: "login Successful", data:{token: token }})
    }catch(err){return res.status(500).send({ msg: err.message })}}



    module.exports = {createUser,userLogin, isValid}