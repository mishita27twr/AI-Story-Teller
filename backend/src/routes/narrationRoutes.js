import express from "express";
import { generateNarration } from "../controllers/narrationController.js";

const router = express.Router();

router.post("/generate", generateNarration);

export default router;