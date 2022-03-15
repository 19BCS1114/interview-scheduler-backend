const router = require("express").Router();
const InterviewSchema = require("../models/InterviewSchema");
const InterviewerSchema = require("../models/InterviewerSchema");
const CandidateSchema = require("../models/CandidateSchema");

router.get("/", (req, res) => {
  InterviewSchema.find({})
    .populate("interviewers")
    .populate("candidates")
    .exec((err, interviews) => {
      if (err) {
        console.log(err);
        res.send({ err: "Server Error!" });
      } else {
        res.send({ interviews: interviews });
      }
    });
});

module.exports = router;
