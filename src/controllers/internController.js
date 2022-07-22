const mongoose = require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createIntern = async function (req, res) {
    try {
        let data = req.body

        // Edge cases
        //if user or student given a empty body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide your Intern details" })
        };
        //each required field is mandetory
        if (!data.name) {
            return res.status(400).send({ status: false, msg: "Please provide the Name details" })
        };
        if (!data.email) {
            return res.status(400).send({ status: false, msg: "Please provide the Email details" })
        };
        if (!data.mobile) {
            return res.status(400).send({ status: false, msg: "Please provide the Mobile details" })
        };
        if (!data.collegeName) {
            return res.status(400).send({ status: false, msg: "Please provide the College Name" })
        };

        // checking name in alphbet only

        if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.name))) {
            return res.status(400).send({ status: false, msg: "Name should be in alphabat type" })
        };

        // checking email is in right format or not and also the email is unique or not

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
            return res.status(400).send({ status: false, msg: "please enter a valid Email" })
        };

        const isEmailPresent = await internModel.findOne({ email: data.email })

        if (isEmailPresent) {
            return res.status(400).send({ status: false, msg: "Email Is already registerd" })
        };


        //checking mobile is in right format or not and also the mobile is present or not in our database

        if (!(/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(data.mobile))) {

            return res.status(400).send({ status: false, msg: "Please Enter a valid Mobile" })
        };

        const isMobilePresent = await internModel.findOne({ mobile: data.mobile })

        if (isMobilePresent) {
            return res.status(400).send({ status: false, msg: "Mobile is already registered" })
        };



        let collegeCheck = await collegeModel.findOne({ name: data.collegeName })
               if (!collegeCheck) {
            return res.status(400).send({ status: false, msg: "CollegeName was not found" })
        };
        
        let findId=collegeCheck._id

        let finaldata = {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            collegeId: findId

        }
        let college = await internModel.create(finaldata)
        {return res.status(201).send(finaldata)}

    } catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message });
    }

};


module.exports.createIntern = createIntern
