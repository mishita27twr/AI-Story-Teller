import express from "express";
import { createStory } from "../controllers/storyController.js";

const router = express.Router();

router.post("/generate", createStory);

export default router;