const router = require("express").Router();
const InterviewSchema = require("../models/InterviewSchema");
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
router.delete("/:id", (req, res) => {
  InterviewSchema.findByIdAndDelete(req.params.id)
    .then((interview) => {
      res.send({ messgae: "Deleted!" });
    })
    .catch((err) => {
      res.send({ err: "Deletion Failed!" });
    });
});

router.put("/", async (req, res) => {
  let { name, date, startTime, endTime, interviewers, candidates, _id } =
    req.body;

  try {
    let flag = false;
    let interviews = await InterviewSchema.find({});
    startTime = new Date(date + "T" + startTime + ":00.000Z");
    endTime = new Date(date + "T" + endTime + ":00.000Z");
    for (let i = 0; i < interviews.length; i++) {
      if (
        !_id === interviews[i]._id &&
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
        return res.send({
          error: "This interview conflicts with other interview",
        });
      }
    }

    if (flag == false) {
      const interviewData = {
        name,
        date,
        startTime,
        endTime,
        interviewers,
        candidates,
      };
      const data = await InterviewSchema.findByIdAndUpdate(
        _id,
        interviewData,
        (err, data) => {
          if (err) {
            console.log(err);
            res.send({ error: "Failed to update interview" });
          } else {
            res.send({ message: "Interview updated" });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
