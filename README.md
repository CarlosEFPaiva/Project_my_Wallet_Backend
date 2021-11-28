# My Wallet - Backend

## About this Project

This project was developed as part of the Driven Web Full-Stack Bootcamp, a 6-month bootcamp where I started my journey as a web developer.

It serves as the back-end for my-wallet-Project -> the front-end of this project can be found [here](https://github.com/CarlosEFPaiva/Project_My_Wallet_FrontEnd), and it's deployment can be found [here](https://project-my-wallet-front-end.vercel.app/).

My-Wallet is an app where users can save their spending and income, all saved with their own login information and with a friendly interface.

The code for this project was developed in English, but it's interface is currently in Portuguese.

## Functionalities

- Create your own login, using the registration screen. It will save your information in a database and allow you to login wherever you want.

- Sign in using your email and password, and a homescreen will show your name and all your saved entries and a calculated balance for all entries.

- Add a new spending or income, typing it's value and a description. It will automatically be sent to the database and added to your homescreen.

## Getting Started

### Prerequisites

To run this project in the development mode, you'll need to have a basic environment to run a Node.js App.

- Run it locally: take note that it will be set in port 4000. If you wish another port, make sure to set it as an enviroment variable.

- Database: The app is set to work with a DATABASE_URL sent as an environment variable. When using Heroku, for example, this URL is given with the information of the created database.

### Running

The following scripts are set for better using of the app:

- start -> Will start the app locally, setting to use the development database. A Production database was not created due to a limitation in the number of databases a free user can have in Heroku.

- test -> Will run the test files once, setting to use the testing database. Once the tests are complete, the database is erased and the connection ended.

- test:watch -> will run the same tests as the previous script, but constantly, re-running at each change on any file of the app. It might be useful in case a change is being done, as it shows in real-time if any test has started to fail after a change.


## Built With

- [Express](https://expressjs.com/) - Web Framework for Noje.js
- [ESlint](https://eslint.org/) - Linter
- [Babel](https://babeljs.io/) - JavaScript Compiler
- [DotEnv](https://www.npmjs.com/package/dotenv) - Configs from .env file
- [Jest](https://jestjs.io/) - Framework for testing
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Encryption and checking encripted strings
- [Joi](https://www.npmjs.com/package/joi) - Validates data before proceeding to its processing
- [Uuid](https://www.npmjs.com/package/uuid) - Lib for creating unique tokens to be distributed to users as they login
- [Faker](https://www.npmjs.com/package/faker) - Creates random values for variables in order to perform better testing
- [SuperTest](https://www.npmjs.com/package/supertest) - Easily performs integration tests for every possible app route.
