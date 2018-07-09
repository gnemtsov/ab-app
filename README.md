# AB-APP
AWS serverless app boilerplate.
This is a simple, but powerfull approach to create serverless applications in AWS. Your can use AB-APP as a starting point for creating your own applications.

AB-APP architecture
![AB-APP architecture](architecture.png)

App has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend contains static content (frontend code). AB-APP backend is written in Node.js. AB-APP frontend is written with React, Redux and Redux-Saga.

Features implemented:
1. **JWT authentication** with tokens refresh
2. **Tables** with pagination, row selection, sorting and csv export
3. **Forms** with live, backend-frontend consistent validation

AB-APP is a site of fictional "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "Monday Begins on Saturday". AB-APP exposes the list of institute departments for authenticated users.

## Installation
1. Install database (MariaDB), Node.js, NPM, docker, [sam-local](https://github.com/awslabs/aws-sam-local) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone or download project source
3. Run `npm install` both in frontend and backend folders
4. Import mysql.dump.sql in your MariaDB instance
5. Create file `backend/.env` with the following content (replace DB_HOST with IP of your local DB instance):
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

#API
API_PATH="api"
FORMS_PATH="forms"
TABLES_PATH="tables"

```
6. Create user **abapp** with password **abapp** in your mysql.user table and give appropriate rights to allow lambda backend to connect and work with your DB

## Starting AB-APP locally
1. Run docker and then run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter to your .../backend dir, if you use remote docker)
2. Run `npm start` in frontend folder to start webpack development server
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
7. Push your changes to github.
8. Go to your fork's GitHub page and click the pull request button.

### Further reading
* [How to contribute to a project on Github](https://gist.github.com/MarcDiethelm/7303312)
* [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)
* [Fork A Repo - User Documentation](https://help.github.com/articles/fork-a-repo/)
* [Development workflow with Git: Fork, Branching, Commits, and Pull Request](https://github.com/sevntu-checkstyle/sevntu.checkstyle/wiki/Development-workflow-with-Git:-Fork,-Branching,-Commits,-and-Pull-Request)

