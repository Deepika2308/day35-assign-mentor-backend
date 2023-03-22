import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import {
findStudent,
findMentor,
getAllStudents,
getAllMentors,
showStudentsOfaMentor,
} from './helper.js';

import {createRouter} from './routes/create.js';
import {assignRouter} from './routes/assign.js';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    let client= new MongoClient(MONGO_URL);
    await client.connect();
    console.log("***connected to mongodb***");
    return client;
}

export const client=await createConnection();

app.get("/", (req,res) =>{
    res.send(`<center><b>This is student Mentor API</b></center><br/><br/>
    <u>List of APIs</u><br/><br/>
    1. /create-mentor - Store mentor details in database<br/><br/>
    2. /create-student - Store student details in database<br/><br/>
    3. /assign-students/:id - List of students' id will be stored to mentors record in database<br/><br/>
    4. /assign-mentor/:id - Mentors id will be stored to the student's record in database<br/><br/>
    5. /showStudentsOfMentor/:id - To list all students under a particular mentor`);
})

//to list all students under particular mentor
app.get("/showStudentsOfMentor/:id" ,async(req,res) => {
  let {id} = req.params;

  let result = await showStudentsOfaMentor(id);
  let students_list = result.students_list;
  res.send({students_list:students_list});
})

//to get list of all mentors
app.get("/mentors", async (req,res) => {
    let result = await getAllMentors();
    res.send(result);
})

//to get list of all students
app.get("/students", async (req,res) => {
    let result = await getAllStudents();
    res.send(result);
})

//get one mentor
app.get("/mentor/:id", async(req,res) => {
    let {id} = req.params;
    let result = await findMentor(id);
    res.send(result);
})

//get one student
app.get("/student/:id", async(req,res) => {
    let {id} = req.params;
    let result = await findStudent(id);
    res.send(result);
})

app.use("/create",createRouter);
app.use("/assign",assignRouter);


app.listen(PORT, (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log(`App is listening to ${PORT}`);
    }
})


