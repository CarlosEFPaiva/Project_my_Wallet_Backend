import express from "express";
import cors from "cors";
import { postNewSignUp } from "./src/controllers/SignUp.js";

const server = express();
server.use(express.json());
server.use(cors());


// server.get("/categories", (req, resp) => sendCategories(connection, req, resp) );
server.post("/sign-up", postNewSignUp)

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});