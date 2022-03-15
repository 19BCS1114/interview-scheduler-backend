const mongoose = require("mongoose");

const InterviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  interviewers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "InterviewerSchema",
    },
  ],
  candidates: [
    {
      type: mongoose.Types.ObjectId,
      ref: "CandidateSchema",
    },
  ],
});

module.exports = mongoose.model("InterviewSchema", InterviewSchema);

//ese kyu likha ye or ref kya hai?  dekh database me hum jab do schema ko combine karte to populate karna hota
// aur populate karne ke liye ye ref dena hota jaha populate karre  ok
// Tune decide kiya? kaisa banana? kya cheez?
// chalahe to ek bhi nbana sakta interviewer aur candidate ka ek me hi alag alag baannan easy ya ek me? alga lalg bna dete toh aurr role assign kar sakta simple kaam krtye i.e waise hi baki bhi banenge do
// dono simple , completely your call ok to bana do schemas
// interviewer schema & candidate schema? yep
