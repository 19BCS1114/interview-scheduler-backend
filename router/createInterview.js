const router = require("express").Router();
const InterviewSchema = require("../models/InterviewSchema");

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

router.post("/", async (req, res) => {
  const { name, date, startTime, endTime, interviewers, candidates } = req.body;

  try {
    let interviews = await InterviewSchema.find({});
    for (let i = 0; i < interviews.length; i++) {
      startTime = date + "T" + startTime + ":00.000Z";
      endTime = date + "T" + endTime + ":00.000Z";
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
        return res.send({
          error: "This interview conflicts with other interview",
        });
      }
    }

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
      req.send({ message: "Interview created" });
    } else {
      res.send({ error: "Failed to create interview" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
