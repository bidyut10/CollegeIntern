const mongoose = require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createCollege = async function (req, res) {
   try {
      // Edge cases
      let data = req.body

      //this is for if user or student provide given an empty body
      if (Object.keys(data).length == 0) {
         return res.status(400).send({ status: false, msg: "Please provide your College details" })
      };


      //if any two feilds is not there
      if ((!data.fullName && !data.logoLink)) {
         return res.status(400).send({ status: false, msg: "Please provide your Full name and logolink" })
      };

       if ((!data.name && !data.fullName)) {
          return res.status(400).send({ status: false, msg: "Please provide your Name and Full-Name" })
       };
       if ((!data.name && !data.logoLink)) {
          return res.status(400).send({ status: false, msg: "Please provide your Name and logolink" })
       };
       
      //particular each required feild is mandetory
      if (!data.name) {
         return res.status(400).send({ status: false, msg: "Please provide the Name details" })
      };
      if (!data.fullName) {
         return res.status(400).send({ status: false, msg: "Please provide the Full-Name details" })
      };
      if (!data.logoLink) {
         return res.status(400).send({ status: false, msg: "Please provide the logoLink details" })
      };

      //checking isDeleted value false
      let isDeletedcheck=req.body.isDeleted
      if(!isDeletedcheck==false){
         return res.status(400).send({status:false,msg:"isDeleted value should be in false"})
      }
  
      //checking name and fullname in alphabet only

      if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.name))) {
         return res.status(400).send({ status: false, msg: "Name should be in alphabat type" })
      };

      if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.fullName))) {
         return res.status(400).send({ status: false, msg: "Full-Name should be in alphabat type" })
      };

      //checking logo format

      if (!(/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i.test(data.logoLink))) {
         return res.status(400).send({ status: false, msg: "Logolink is not in correct format" })
      };

      //checking the name is unique or not
      let nameCheck = await collegeModel.findOne({ name: data.name });
      if (nameCheck) {
         return res.status(400).send({ status: false, msg: "Name is already registerd" });
      }
      let finalData={
         name:data.name,
         fullName:data.fullName,
         logoLink:data.logoLink,
         isDeleted:isDeletedcheck
   
      }

      //checking college fullname is already registerd or not
      let isValidfullName = await collegeModel.findOne({ fullName: data.fullName });
      if (!isValidfullName) {
         let college = await collegeModel.create(finalData) //adding and createing in database
         return res.status(201).send(finalData); //user should be seeing details only and final response should be looking like this
      } else{
         return res.status(400).send({ status: false, message: "FullName is already registered", })
      };


   } catch (err) {
      return res.status(500).send({ msg: "Error", error: err.message });
   }

};


const getCollegeDetails = async function (req, res) {

   try {
      let data = req.query
      //edge cases
      //this is college name is empty or not

      if (Object.keys(data).length == 0) {
         return res.status(400).send({ status: false, msg: "Please provide your college details in body" })
      };

      //checking college name in alphabet only

      if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.collegeName))) {
         return res.status(400).send({ status: false, msg: "Name should be in alphabat type" })
      };
   
      // checking college is valid or not

      const getCollegeDetail = await collegeModel.findOne({ name: data.collegeName })
      if (!getCollegeDetail) {
         return res.status(404).send({ status: false, message: " Please provide correct College name" })
      };

      const collegeId = getCollegeDetail._id

      const findIntern = await internModel.find({ collegeId: collegeId, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })

      //checking any intern is present or not
      if (findIntern.length == 0) {
         return res.status(400).send({ status: false, message: "No Intern is enrolled in this college" })
      };


      let finalData = {
         name: getCollegeDetail.name,
         fullName: getCollegeDetail.fullName,
         logoLink: getCollegeDetail.logoLink,
         interns: findIntern
      }

      return res.status(200).send({ status: true, data: finalData })

   } catch (err) {
      return res.status(500).send({ msg: "Error", error: err.message });
   }
};

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails



