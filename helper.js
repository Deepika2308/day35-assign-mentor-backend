import { client } from "./index.js";
import {ObjectId} from "mongodb";

async function assignMentorToStudent(id, mentor) {
    return await client.db("mentor_student").collection("students").updateOne({ _id: ObjectId(id) }, { $set: mentor });
  }
  
  async function assignStudentsToMentor(id, students) {
    return await client.db("mentor_student").collection("mentors").updateOne({ _id: ObjectId(id) }, { $set: students });
  }
  
  async function findStudent(id) {
    return await client.db("mentor_student").collection("students").findOne({ _id: ObjectId(id) });
  }
  
  async function findMentor(id) {
    return await client.db("mentor_student").collection("mentors").findOne({ _id: ObjectId(id) });
  }
  
  async function getAllStudents() {
    return await client.db("mentor_student").collection("students").find().toArray();
  }
  
  async function getAllMentors() {
    return await client.db("mentor_student").collection("mentors").find().toArray();
  }
  
  async function createStudent(student) {
    return await client.db("mentor_student").collection("students").insertOne(student);
  }
  
  async function createMentor(mentor) {
    return await client.db("mentor_student").collection("mentors").insertOne(mentor);
  }
  
  async function showStudentsOfaMentor(id) {
    return await client.db("mentor_student").collection("mentors").findOne({ _id: ObjectId(id) });
  }

  async function findStudentByEmail(student) {
    return await client
        .db("mentor_student")
        .collection("students")
        .findOne({ email: student.email });
}


async function findMentorWithEmail(mentor) {
    return await client
        .db("mentor_student")
        .collection("mentors")
        .findOne({ email: mentor.email });
}


  export {
    findStudentByEmail,
    findMentorWithEmail,
    assignMentorToStudent,
assignStudentsToMentor,
findStudent,
findMentor,
getAllStudents,
getAllMentors,
createStudent,
createMentor,
showStudentsOfaMentor,
  }