const mongoose = require("mongoose");

const InterviewerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("InterviewerSchema", InterviewerSchema);
