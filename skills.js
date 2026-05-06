const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

router.post("/add", async (req, res) => {
  const { user, title, description } = req.body;

  const skill = new Skill({ user, title, description });
  await skill.save();

  res.json({ message: "Skill added" });
});

router.get("/all", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

module.exports = router;