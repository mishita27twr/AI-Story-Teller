import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storyRoutes from "./routes/storyRoutes.js";
import narrationRoutes from "./routes/narrationRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/story", storyRoutes);
app.use("/api/narration", narrationRoutes);

app.get("/", (req, res) => {
  res.send("StoryVerse Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});