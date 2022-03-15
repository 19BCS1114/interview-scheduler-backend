const router = require("express").Router();
const InterviewSchema = require("../models/InterviewSchema");
const InterviewerSchema = require("../models/InterviewerSchema");
const CandidateSchema = require("../models/CandidateSchema");

const conflicts = (newStartTime, newEndTime, startTime, endTime) => {
  return (
    newStartTime.getTime() < endTime.getTime() &&
    newEndTime.getTime() > startTime.getTime()
  );
};
const personsConflict = (A, B) => {
  for (let i = 0; i < A.length; i++) {
    if (B.includes(A[i]._id)) return true;
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
    startTime = date + "T" + startTime + ":00.000Z";
    endTime = date + "T" + endTime + ":00.000Z";
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
        console.log(message);
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
