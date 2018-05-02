# AB-APP
AWS serverless app blueprint.
This is a simple, but powerfull approach to create serverless applications in AWS. Your can use AB-APP as a starting point for creating your own applications.

AB-APP architecture
![AB-APP architecture](architecture.png)

App has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend contains static content (frontend code). AB-APP backend is written in Node.js. AB-APP frontend is written with React, Redux and Redux-Saga.

Demo app is a site of "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "Monday Begins on Saturday". App exposes the list of institute departments for authenticated users.

## Installation
1. Install database (MariaDB)
2. Install Node.js
3. Install NPM
4. Install docker
5. Install [sam-local](https://github.com/awslabs/aws-sam-local)
6. Create project folder and git clone project source 
7. Create user **abapp** with password **abapp** in your mysql.user table and give appropriate rights to allow lambda backend to connect and work with your DB
8. Import mysql.dump.sql in your MariaDB instance
9. Run `npm install` both in frontend and backend folders
10. Run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter to your .../backend dir, if you use remote docker)
11. Run `npm start` in frontend folder to start webpack development server
12. Have fun! :smiley: