const router = require("express").Router();
const InterviewSchema = require("../models/InterviewSchema");
const InterviewerSchema = require("../models/InterviewerSchema");
const CandidateSchema = require("../models/CandidateSchema");
const mongoose = require("mongoose");
const conflicts = (newStartTime, newEndTime, startTime, endTime) => {
  return (
    (startTime.getTime() >= newStartTime.getTime() &&
      startTime.getTime() <= newEndTime.getTime()) ||
    (endTime.getTime() >= newStartTime.getTime() &&
      endTime.getTime() <= newEndTime.getTime()) ||
    (newStartTime.getTime() >= startTime.getTime() &&
      newStartTime.getTime() <= endTime.getTime()) ||
    (newEndTime.getTime() >= startTime.getTime() &&
      newEndTime.getTime() <= endTime.getTime())
  );
};
const personsConflict = (A, B) => {
  console.log(A, B);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      if (A[i] == B[j].toString()) {
        return true;
      }
    }
  }
  return false;
};
router.get("/", async (req, res) => {
  try {
    let interviewers = await InterviewerSchema.find({});
    let candidates = await CandidateSchema.find({});

    res.send({ interviewers: interviewers, candidates: candidates });
  } catch (err) {
    console.log(err);
    res.send({ err: "Some error occurred" });
  }
});

router.post("/", async (req, res) => {
  let { name, date, startTime, endTime, interviewers, candidates } = req.body;
  console.log(req.body);
  try {
    let flag = false;
    let interviews = await InterviewSchema.find({});
    startTime = new Date(date + "T" + startTime + ":00.000Z");
    endTime = new Date(date + "T" + endTime + ":00.000Z");
    for (let i = 0; i < interviews.length; i++) {
      if (
        conflicts(
          startTime,
          endTime,
          interviews[i].startTime,
          interviews[i].endTime
        ) &&
        (personsConflict(interviewers, interviews[i].interviewers) ||
          personsConflict(candidates, interviews[i].candidates))
      ) {
        flag = true;
        res.send({
          error: "This interview conflicts with other interview",
        });
        break;
      }
    }

    if (flag == false) {
      const interviewData = new InterviewSchema({
        name,
        date,
        startTime,
        endTime,
        interviewers,
        candidates,
      });

      const data = await interviewData.save();
      if (data) {
        res.send({ message: "Interview created" });
      } else {
        console.log(error);
        res.send({ error: "Failed to create interview" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ err: "Some error occurred" });
  }
});

module.exports = router;
