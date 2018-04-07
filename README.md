# AB-ERP
AWS serverless app blueprint.
This is a simple, but powerfull approach to create serverless applications in AWS. Your can use AB-ERP as a starting point for creating your own applications.

AB-ERP architecture
![AB-ERP architecture](architecture.png)

App has two main folders: **lambda** and **public**. Lambda folder contains backend code and public contains static content (frontend code).

## Installation and usage
1. Install database (MariaDB), Node.js, NPM, docker and [sam-local](https://github.com/awslabs/aws-sam-local)
2. Create project folder and git clone project source 
3. Import mysql.dump.sql in your MariaDB instance, set your local DB instance IP in lambda/index.js
4. Run `npm install` both in project root folder and in lambda folder
5. Run docker and then run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter, if you use remote docker)
6. Run `node abserver.js` in your project root folder to start small local express http-server for SPA
7. Have fun! :smiley:
