import express from 'express';
import cors from 'cors';

import * as usersController from './controllers/usersController.js';
import * as entriesController from './controllers/entriesController.js';
import validateToken from './middleware/authorization.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', usersController.postNewSignUp);
app.post('/sign-in', usersController.postSignIn);

app.get('/entries', validateToken, entriesController.getUserNameAndEntries);
app.post('/entries', validateToken, entriesController.postNewEntry);

export default app;
