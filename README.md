# Introduction
AB-APP is an AWS serverless boilerplate application. You can use it as a starting point for your own applications. AB-APP is using [bit](https://bitsrc.io), so you can not only use it as a whole but also make use of some parts of it.

AB-APP is a site of fictional "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "[Monday Begins on Saturday](https://en.wikipedia.org/wiki/Monday_Begins_on_Saturday)". AB-APP exposes the list of institute departments for authenticated users. It also allows to add and edit departments.

AB-APP is deployed here: [d1v3l4fe3mshyi.cloudfront.net](http://d1v3l4fe3mshyi.cloudfront.net). It might not be the last version as we don't redeploy every time we push changes in the repo. Also, note that when visiting the link for the first time application may load slowly. This is because of the lambda cold start. In production warm up dump requests should be used to keep your lambda in a warm state.

## Current status
AB-APP is still under development. **It is not finished**! Feel free to experiment with it, but don't use it in production as is.

## Architecture

![AB-APP architecture](architecture-Main-API-Gateway.png)

The application uses RDS/DynamoDB and S3 for persistent storage. A single lambda function holds all the backend logic. API Gateway (for now) is used as a proxy service to pass requests from the frontend to the backend. CloudFront CDN allows delivering the application's content fast.

The application has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend folder contains static content (frontend code, assets, etc.) 

AB-APP backend is written in Node.js. AB-APP frontend is written with React, Redux, and Redux-Saga.

## Features implemented
Authentication using **JWT tokens** + tokens refresh.

[**Tables**](https://github.com/gnemtsov/ab-app/blob/master/TABLES.md) for viewing data with pagination, row selection, sorting and CSV export.

[**Forms**](https://github.com/gnemtsov/ab-app/blob/master/FORMS.md) for adding and editing data with live, backend-frontend consistent validation.

## TODO
- Replace API Gateway with AppSync. AppSync provides a convenient way of communication between frontend and backend using GraphQL queries and is also responsible for offline and real-time functionality.
- Add DynamoDB support
- Add real-time features
- Add PWA features and offline functionality

# Table of contents
- [Installation for local development](https://github.com/gnemtsov/ab-app#installation)
- [Starting AB-APP locally](https://github.com/gnemtsov/ab-app#starting-ab-app-locally)
- [How to contribute](https://github.com/gnemtsov/ab-app#how-to-contribute)
- [Further reading](https://github.com/gnemtsov/ab-app#further-reading)


# Installation
1. Install a database (MariaDB), Node.js, NPM, docker, [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone or download the project source
3. Run `npm install` in the root folder, the frontend, and the backend folders
4. Import mysql.dump.sql in your MariaDB instance
5. Create the file `backend/.env` with the following content (replace DB_HOST with IP of your local DB instance):
```
#Environment
PROD=false

#Token secret
SECRET="SOME_SECRET_CODE_672967256"

#DB
DB_HOST="192.168.1.5"
DB_NAME="abapp"
DB_USER="abapp"
DB_PASSWORD="abapp"
```
6. Create a user **abapp** with password **abapp** in your mysql.user table and give appropriate rights to allow the lambda function to connect and work with your database

# Starting AB-APP locally
1. Run docker and then run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter to your .../backend dir, if you use remote docker)
2. Run `npm start` in the frontend folder to start webpack development server
3. Have fun! :smiley:

## How to contribute
1. Click the "Fork" button.
2. Clone your fork to your local machine:
```shell
git clone https://github.com/YOUR_USERNAME/ab-app.git
```
3. Add 'upstream' repo to keep your form up to date:
```shell
git remote add upstream https://github.com/gnemtsov/ab-app.git
```
4. Fetch latest upstream changes:
```shell
git fetch upstream
```
5. Checkout your master branch and merge the upstream repo's master branch:
```shell
git checkout master
git merge upstream/master
```
6. Create a new branch and start working on it:
```shell
git checkout -b NEW_FEATURE
```
7. Push your changes to GitHub.
8. Go to your fork's GitHub page and click the pull request button.

### Further reading
* [How to contribute to a project on Github](https://gist.github.com/MarcDiethelm/7303312)
* [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)
* [Fork A Repo - User Documentation](https://help.github.com/articles/fork-a-repo/)
* [Development workflow with Git: Fork, Branching, Commits, and Pull Request](https://github.com/sevntu-checkstyle/sevntu.checkstyle/wiki/Development-workflow-with-Git:-Fork,-Branching,-Commits,-and-Pull-Request)

