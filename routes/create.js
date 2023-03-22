import express from 'express';
import {
  createStudent,
  createMentor,
  findStudentByEmail,
  findMentorWithEmail
  } from '../helper.js';

const router = express.Router();


//api to store mentor details in db
router.post("/create-mentor", async(req,res) =>{
    let mentor = req.body;

    //check if mentor with same email id exists
    let checkUser = await findMentorWithEmail(mentor);

    if (checkUser) {
        res.send({
          error: "Mentor with same email Id has already been registered. Use different Id",
        });
      }
      else {
        let result = await createMentor(mentor);
        if (result) {
          res.send({ result });
        } else {
          res.send({ error: result });
        }
    }
})

router.post("/create-student", async(req,res) =>{
    let student = req.body;

     //check if student with same email id exists
     let checkUser = await findStudentByEmail(student);


    if (checkUser) {
        res.send({
          error: "Student with same email Id has already been registered. Use different Id",
        });
      }
      else {
        let result = await createStudent(student);
        if (result) {
          res.send({ result });
        } else {
          res.send({ error: result });
        }
    }
})



export const createRouter = router;

