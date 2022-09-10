import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
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

const client=await createConnection();

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

  let result = await client.db("mentor_student").collection("mentors").findOne({ _id: ObjectId(id)});
  let students_list = result.students_list;
  res.send({students_list:students_list});
})

//api to store mentor details in db
app.post("/create-mentor", async(req,res) =>{
    let mentor = req.body;

    //check if mentor with same email id exists
    let checkUser = await client
    .db("mentor_student")
    .collection("mentors")
    .findOne({ email: mentor.email });

    if (checkUser) {
        res.send({
          error: "Mentor with same email Id has already been registered. Use different Id",
        });
      }
      else {
        let result = await client.db("mentor_student").collection("mentors").insertOne(mentor);
        if (result) {
          res.send({ result });
        } else {
          res.send({ error: result });
        }
    }
})

//api to store student details in db
app.post("/create-student", async(req,res) =>{
    let student = req.body;

     //check if student with same email id exists
     let checkUser = await client
     .db("mentor_student")
     .collection("students")
     .findOne({ email: student.email });


    if (checkUser) {
        res.send({
          error: "Student with same email Id has already been registered. Use different Id",
        });
      }
      else {
        let result = await client.db("mentor_student").collection("students").insertOne(student);
        if (result) {
          res.send({ result });
        } else {
          res.send({ error: result });
        }
    }
})

//to get list of all mentors
app.get("/mentors", async (req,res) => {
    let result = await client.db("mentor_student").collection("mentors").find().toArray();
    res.send(result);
})

//to get list of all students
app.get("/students", async (req,res) => {
    let result = await client.db("mentor_student").collection("students").find().toArray();
    res.send(result);
})

//get one mentor
app.get("/mentor/:id", async(req,res) => {
    let {id} = req.params;
    let result = await client.db("mentor_student").collection("mentors").findOne({_id:ObjectId(id)});
    res.send(result);
})

//get one student
app.get("/student/:id", async(req,res) => {
    let {id} = req.params;
    let result = await client.db("mentor_student").collection("students").findOne({_id:ObjectId(id)});
    res.send(result);
})


//assign students dropdown will show only students who are not assigned any mentor yet
//list of student id will be stored to mentors record
app.put(`/assign-students/:id`, async(req,res) => {
    let {id} = req.params;
    let students = req.body;
    let result = await client.db("mentor_student").collection("mentors").updateOne({_id:ObjectId(id)},{$set:students});
    res.send(result);
})

//to assign a mentor to student
//mentor name will be stored in the student's record
app.put(`/assign-mentor/:id`, async(req,res) => {
    let {id} = req.params;
    let mentor = req.body;
    
    let result = await client.db("mentor_student").collection("students").updateOne({_id:ObjectId(id)},{$set:mentor});
    res.send(result);
})

app.listen(PORT, (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log(`App is listening to ${PORT}`);
    }
})