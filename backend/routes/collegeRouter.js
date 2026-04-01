import express from "express";
import { searchColleges } from "../controllers/collegeController.js";
const collegeRouter = express.Router();
collegeRouter.get("/", searchColleges);
export default collegeRouter;