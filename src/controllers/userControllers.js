const userModel = require("../models/userModel.js")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const mobile1 = /^[0-9]{10}$/;
const email1 = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
const password1 = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const createUser = async function (req, res) {
    try {
        const data = req.body;
        const { title, name, phone, email, password, address } = data
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "please enter details" })

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is required" })
        } else if (title != 'Mr' && title != 'Mrs' && title != 'Miss') {
            return res.status(400).send({ status: false, message: "Invalid Title : Valid titles : Mr, Miss, Mrs" })
        }

        if (!isValid(name)) return res.status(400).send({ status: false, message: "please enter name" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "please enter phone number" })
        if (!mobile1.test(phone)) return res.status(400).send({ status: false, message: "please enter valid phone number" })
        const usedNumber = await userModel.findOne({ phone: phone })
        if (usedNumber) return res.status(409).send({ status: false, message: " Phone number is already exist" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "please enter phone number" })
        if (!email1.test(email)) return res.status(400).send({ status: false, message: "please enter valid emailId" })
        const usedEmail = await userModel.findOne({ email: email })
        if (usedEmail) return res.status(409).send({ status: false, message: " email is already exist" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "please enter password" })
        if (!password1.test(password)) return res.status(400).send({ status: false, message: "Please enter strong password of atleast 8 character, It should contain atleast One Capital letter , one lower case letter and special character ," })
   
        if(address) {
            if(address.city){
               if(!(/^[A-Za-z]+$/.test(address.city))) return res.status(400).send({status:false , message:"City name should only contain alphabets"})
            }
            if(address.street){
                if(!(typeof address.street === "string"&& address.street.trim().length != 0))return res.status(400).send({status:false , message:"Please enter valid street name"})
            }
            if(address.pincode){
                if(!/^([1-9]\d{5})$/.test(address.pincode))return res.status(400).send({status:false , message:"Pincode should be of 6 digits only"})
            }
        }

        let user = await userModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: user })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const userLogin = async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (Object.keys(req.body) == 0) return res.status(400).send({ status: false, message: "please enter details" })

        if(!email)return res.status(400).send({ status:false , message: "please enter email id" })
        if (!email1.test(email))  return res.status(400).send({ status:false ,message: "please enter valid email id" })
        
        if (!password)  return res.status(400).send({status:false , message: "Password is required" })
        
        let user1 = await userModel.findOne({ email: email });
        if (!user1)return res.status(400).send({status: false, message: "email  is not correct", });
        let user = await userModel.findOne({ email: email, password: password });
        if (!user)return res.status(400).send({status: false, message: "password is not correct", });

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: (new Date().getTime() + 60 * 60 * 1000) / 1000,
                iat: (new Date().getTime())
            }, "Project3-78");

        res.status(200).setHeader("x-api-key", token);

        res.status(200).send({ status: true, message: "login Successful", data: { token: token } })

    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}



module.exports = { createUser, userLogin, isValid }
