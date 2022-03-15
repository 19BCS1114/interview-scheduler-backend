const mongoose = require("mongoose");

const CandidateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CandidateSchema", CandidateSchema);
