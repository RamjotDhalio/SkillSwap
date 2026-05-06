const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  user: String,
  title: String,
  description: String
});

module.exports = mongoose.model("Skill", SkillSchema);