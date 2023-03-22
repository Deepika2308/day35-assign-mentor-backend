

import express from 'express';
import {assignMentorToStudent,
    assignStudentsToMentor} from '../helper.js';

const router = express.Router();


//assign students dropdown will show only students who are not assigned any mentor yet
//list of student id will be stored to mentors record
router.put(`/assign-students/:id`, async(req,res) => {
    let {id} = req.params;
    let students = req.body;
    let result = await assignStudentsToMentor(id, students);
    res.send(result);
})

//to assign a mentor to student
//mentor name will be stored in the student's record
router.put(`/assign-mentor/:id`, async(req,res) => {
    let {id} = req.params;
    let mentor = req.body;
    
    let result = await assignMentorToStudent(id, mentor);
    res.send(result);
})


export const assignRouter = router;