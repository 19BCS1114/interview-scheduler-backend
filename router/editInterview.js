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
  const { name, date, startTime, endTime, interviewers, candidates, _id } =
    req.body;

  try {
    let interviews = await InterviewSchema.find({});
    for (let i = 0; i < interviews.length; i++) {
      startTime = date + "T" + startTime + ":00.000Z";
      endTime = date + "T" + endTime + ":00.000Z";
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
        return res.send({
          error: "This interview conflicts with other interview",
        });
      }
    }

    const interviewData = {
      name,
      date,
      startTime,
      endTime,
      interviewers,
      candidates,
    };
    InterviewSchema.findByIdAndUpdate(_id, interviewData);
    if (data) {
      req.send({ message: "Interview updated" });
    } else {
      res.send({ error: "Failed to update interview" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
