# AB-APP
AWS serverless app blueprint.
This is a simple, but powerfull approach to create serverless applications in AWS. Your can use AB-APP as a starting point for creating your own applications.

AB-APP architecture
![AB-APP architecture](architecture.png)

App has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend contains static content (frontend code). AB-APP backend is written in Node.js. AB-APP frontend is written with React, Redux and Redux-Saga.

Features implemented:
1. JWT authentication with tokens refresh
2. Tables (backend logic + React component with pagination, row selection and sorting)

Demo app is a site of "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "Monday Begins on Saturday". App exposes the list of institute departments for authenticated users.

## Installation
1. Install database (MariaDB), Node.js, NPM, docker, [sam-local](https://github.com/awslabs/aws-sam-local) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone project source
3. Run `npm install` both in frontend and backend folders
4. Import mysql.dump.sql in your MariaDB instance, set your local DB instance IP in backend/index.js
5. Create user **abapp** with password **abapp** in your mysql.user table and give appropriate rights to allow lambda backend to connect and work with your DB

## Starting AB-APP locally
1. Run docker and then run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter to your .../backend dir, if you use remote docker)
2. Run `npm start` in frontend folder to start webpack development server
3. Have fun! :smiley:
