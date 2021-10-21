import express from "express";
import cors from "cors";
import { postNewSignUp } from "./src/controllers/SignUp.js";
import { postSignIn } from "./src/controllers/SignIn.js";
import { postNewEntry } from "./src/controllers/NewEntry.js";

const server = express();
server.use(express.json());
server.use(cors());

//SIGN-UP
server.post("/sign-up", postNewSignUp);

//SIGN-IN
server.post("/sign-in", postSignIn);

//NewEntry
server.post("/new-entry", postNewEntry);

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});