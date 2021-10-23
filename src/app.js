import express from "express";
import cors from "cors";
import { postNewSignUp } from "./controllers/SignUp.js";
import { postSignIn } from "./controllers/SignIn.js";
import { getUserNameAndEntries, postNewEntry } from "./controllers/Entries.js";

const app = express();
app.use(express.json());
app.use(cors());

//SIGN-UP
app.post("/sign-up", postNewSignUp);

//SIGN-IN
app.post("/sign-in", postSignIn);

//ENTRIES
app.get("/entries", getUserNameAndEntries);
app.post("/entries", postNewEntry);

export default app;