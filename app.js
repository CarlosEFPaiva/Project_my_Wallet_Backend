import express from "express";
import cors from "cors";
import { postNewSignUp } from "./src/controllers/SignUp.js";
import { postSignIn } from "./src/controllers/SignIn.js";

const server = express();
server.use(express.json());
server.use(cors());

//SIGN-UP
server.post("/sign-up", postNewSignUp);

//SIGN-IN
server.post("/sign-in", postSignIn);

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});