# Introduction
AB-APP is an AWS serverless boilerplate application.
This is a simple, but powerfull approach to create serverless applications in the AWS cloud. You can use AB-APP as a starting point for creating your own applications.

AB-APP is using [bit](https://bitsrc.io), so you can not only use it as a whole, but also make use of some parts of AB-APP in your applications.

AB-APP is a site of fictional "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "Monday Begins on Saturday". AB-APP exposes the list of institute departments for authenticated users. It also allows to add and edit departments.

Deployed app is availbale here: [d1v3l4fe3mshyi.cloudfront.net](d1v3l4fe3mshyi.cloudfront.net)

## Current application state
AB-APP is under development. **It is not finished**! Feel free to experiment with it, but don't use it in production as is.

## Architecture

![AB-APP architecture](architecture-Main.png)

The application uses RDS/DynamoDB and S3 for persistent storage. Lambda function holds backend logic. API Gateway as a proxy service to pass requests from the frontent to the backend. CloudFront CDN allows to deliver the application content fast.

The application has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend folder contains static content (frontend code, assets, etc.) AB-APP backend is written in Node.js. AB-APP frontend is written with React, Redux and Redux-Saga.

## Features implemented
Authentication using **JWT tokens** + tokens refresh.

Functionality for viewing and editting data: 
- **tables** with pagination, row selection, sorting and csv export; 
- **forms** with live, backend-frontend consistent validation.

## TODO
- Use AppSync instead of API Gateway. AppSync provides convenient way of communication between frontend and backend using GraphQL queries and is also responsible for offline and realtime functionality.
- Add DynamoDB support
- Add realtime features
- Add PWA features and offline functionality

# Table of contents
- [Installation](https://github.com/gnemtsov/ab-app#installation)
- JWT authentication
- [Tables](https://github.com/gnemtsov/ab-app#tables)
    - [Architecture](https://github.com/gnemtsov/ab-app#architecture)
    - [Formatters functions](https://github.com/gnemtsov/ab-app#formatter-functions)
    - [Table React component](https://github.com/gnemtsov/ab-app#table-react-component)
- [Forms](https://github.com/gnemtsov/ab-app#installation)
    - [Architecture](https://github.com/gnemtsov/ab-app#installation)
    - [Installation](https://github.com/gnemtsov/ab-app#installation)
    - [Usage](https://github.com/gnemtsov/ab-app#installation)
    - [Component properties](https://github.com/gnemtsov/ab-app#installation)
- PWA and offline
- Realtime
- Testing
- Deploying
- Bit
- [Contributing](https://github.com/gnemtsov/ab-app#installation)


# Installation
1. Install database (MariaDB), Node.js, NPM, docker, [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone or download project source
3. Run `npm install` in root folder, frontend and backend folders
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
```
6. Create user **abapp** with password **abapp** in your mysql.user table and give appropriate rights to allow lambda backend to connect and work with your DB

## Starting AB-APP locally
1. Run docker and then run `sam local start-api` to start local API Gateway (set --docker-volume-basedir parameter to your .../backend dir, if you use remote docker)
2. Run `npm start` in frontend folder to start webpack development server
3. Have fun! :smiley:


# Tables

Table implementation includes backend and frontend functionality. 

Tables have the following features:
- Pagination
- Sorting (hold shift for multisort) 
- Row selection (hold ctrl or shift to select multiple rows)
- CSV data export
- Sticky toolbar
- Easy custom styling
- Very fast and lightweight
- No devependencies

## Architecture

The frontend "knows" only the table name. Everything else is fetched from the backend.

On the backend there is corresponding .sql file for each application table. This file contains query that must be executed to fetch table data from a database. Column descriptions are stored as .json files.

The backend is responsible for fetching table data from a database, applying backend formatters (see below) and providing column descriptions. 

Frontend has two React components. Table high order component and table core component. 

Table HOC is responsible for fetching table data from the backend and applying frontend formatters. Table core component is responsible for rendering and providing main table functionality (selecting, sorting, pagination, etc.)

![Tables architecture](architecture-Tables.png)

## Formatters functions
There are backend and frontend libs of formatters functions. Formatter function receives two parametes: column description and raw table data. It should return rendered view to display on the page.

```jsx
const sampleFormatter = (col, row) => `<b>${row.lastname}${row.firstname}</b>`;
```

Formatters are defined for a column and they are executed for each table cell in a column. There can only be one formatter per column. 

Since formatter function is executed for each cell it slows down table creation. If possible you should try not to use formatters at all - try to get table data as it should be displayed right from a database. 

If you need to use a formatter, try to use frontend formatter. It is executed on the frontend and only for whose column cells that are currently rendered.

Use backend formatters only if there is no other options. Backend formatters are executed on the backend and for all column cells at once.

## Table React component

This component can be used in any application without conjunction with the AB-APP backend.

### Component properties

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| rowsPerPage | Integer | 10 | Number of rows rendered per page |
| selectable | Boolean | false | Whether rows can be selected or not |
| className | String | '' | Name of a custom CSS class (see below) |
| csvExport | Boolean | true | Whether table can be exported as csv-file |
| emptyTableMessage | String | 'No data specified' | A message, shown when table is empty. |
| cols | Array of objects | [] | Columns descriptions (see below) |
| rows | Array of objects | [] | Table data (see below) |


#### Custom styling (className property)

To apply custom styling you should set className property of the conf object. Your class will be put on top of default table styles, so all custom styles will override default. For example, to make headers' text green, you should set your custom class: `className = "CustomTable"`. Then write the following CSS in the .css file of your component, where you use table component:
```css
.CustomTable th {
    color: green;
}
```

#### Columns descriptions (cols property)

Each table column is an object with the following properties:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| name | String | - | Column name, must have corresponding data in rows objects (see below). |
| title | String | '' | Column title |
| sortOrder | Integer | 0 | Default column sort priority |
| sortDirection | String | 'ASC' | Default column sort direction (ASC or DESC) |
| html | Boolean | false | Whether the cell content should be put to page as html |


The following properties are available only when using tables as part of AB-APP:
| Key | Type | Default | Description |
| --- | --- | --- | --- |
| frontendFormatter | String | '' | Name of frontend formatter function |
| backendFormatter | String | '' | Name of backend formatter function |

#### Table data (rows property)

Each table row is an object that holds the data of the table row. Object keys must be the same as **names** properties of the cols objects.

For example
```jsx
[{ 
    name: 'Buddy', 
    class: 'Dog', 
    age: 3, 
    gender: 'male' 
},
{ 
    name: 'Molly', 
    class: 'Cat', 
    age: 5, 
    gender: 'female' 
}]
```

### Using as separate React component
```jsx
import React, { Component } from 'react';

import Table from 'table';

export default class App extends Component {
    render() {
        const cols = [
            { name: 'name', title: 'Pet name' },
            { name: 'class', title: 'Animal class' },
            { name: 'age', title: 'Age' },
            { name: 'gender', title: 'Gender' }
        ]

        const rows = [
            { name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
            { name: 'Molly', class: 'Cat', age: 5, gender: 'female' },
            { name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
            { name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
            { name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
            { name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
            { name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
        ]

        return (
            <div
                className="TableContainer" >
                <Table
                    selectable={true}
                    emptyTableMessage={'No animals found'}
                    cols={cols}
                    rows={rows} />
            </div>
        )
    }
}
```

# Forms

Writing forms markup, programming fields validation can be hard. AB-APP is making the whole process a breeze. You just have to provide form data as a simple json config! :tada:

AB-APP form features:
- Clean, responsible mobile-first css markup (horizontal or inline)
- Live validation as user types
- Consistent both frontend and backend validation using single sourse of truth (see Validation section below)
- Automatic injection of fields validators according to DB column types
- Easy custom styling
- Very fast and lightweight
- No devependencies

Forms can be rendered as horizontal (default, CSS grid is used) or inline (layout="inline" prop must be set, CSS flex is used). Styles of the form can be overriden by custom className.

## Architecture

The frontend "knows" only the form's endpoint. It uses GET request to get the form's configuration, data and validation functions. It uses POST request to send user data to the backend.

On the backend there is corresponding .json file for each form. This file contains fields descriptions. There is also an .sql file for some forms which holds the query for fetching form data from a database.

The backend is responsible for building form config and sending it to the frontend. It is also responsible for accepting POST requests, validating data and putting it into the database. 

Frontend has two React components. Form high order component and form core component. 

Form HOC is responsible for fetching form data from the backend and sending user data back (form submition). Table core component is responsible for rendering and validation.

![Forms architecture](architecture-Forms.png)

## Form React core component

### Component properties

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| layout | String ('horizontal' or 'inline') | 'horizontal' | Form layout type |
| infoIcon | HTML or JSX | feather info icon | Here you can put your custom "i" icon - it can be a react component |
| buttonText | String or Array of strings | ["Submit", "Sending..."] | Text for the submit button. If array is given it must contain two elements: one for default state and one for sending state |
| doneText | String | 'Done!' | Text that appers near the submit button if the form was submitted successfully |
| doneTextDuration | Integer | 2000 | Number of milliseconds to display doneText near the submit button |
| className | String | '' | Name of a custom class (see below) |
| submitHandler | Function | null | Function that will be invoked when form is submitted |
| fields | Array of objects | [] | Form fields (see below) |


#### Custom styling
You can put a custom class on top of default form styles, so all custom styles will override default. For example, to make labels green, you should set your custom class: `className = "CustomForm"`. Then write the following CSS in the .css file of your component, where you use react-ab-form:
```css
.CustomForm .Label {
    color: green;
}
```

#### Submitting form
Use **submitHandler** property to set a function that will be invoked when form is submitted. Values of the form will be passed to this function as parameter. This function must return a promise. 

If the promise resolves `doneText` is shown near the submit button. 

If the promise rejects (it can happen when the server invalidate a field), the error will be catched by Form component. It expects to receive the error in the following format:
```
{
    response: {
            data: {
                field: {
                    name: 'field_name_here',
                    message: 'error_message_here'
                }
            }
        }
}
```

If Form component receives error it show error message the same way it does when form field is invalidated on the frontend.

#### Form fields

Each form field is an object with the following properties.
| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| name | String | none | Field name |
| label | String | '' | Field label |
| placeholder | String | '' | Field placeholder |
| value | String | none | Field value |
| required | Boolean | false | Whether field is required |
| type | Boolean | false | Field type (see below) |
| allowedValues | Array of strings | [] | Contains allowed values for the field (see "type" property description for more details) |
| noEcho | Boolean | false | If set `true`, value of the field is obscured |
| description | String | '' | String with additional field description. If set, small "i" icon appears near the field. When user hovers the icon this description appears as tooltip |
| validators | Array of objects | '' | Contains validators functions descriptions (one or multiple), see below |


##### Field types
Fields can be one of the following types:

| Field type  | Additional conditions | Renders as |
| ------------- | ------------- | ------------- |
| String  | -  | input type="text" |
| String  | noEcho = true  | input type="password" |
| String  | allowedValues is an array of 2 elements  | input type="radio" |
| String  | allowedValues is an array of more than 2 elements  | select |
| Text  | -  | textarea |
| Number  | -  | input type="text" |
| Boolean  | -  | input type="checkbox" |


##### Field validators
Each validator is described by separate object with the following properties:
- **params**, (array): additional params values, passed to validator besides field value
- **message** (string): message that should be shown when validator is not passed
- **f** (function or function as a string): validator function, it should return true or false

When user changes field all validators are executed one by one with the current value of the field. If validator returns `false`, execution stops and current validator message is shown - field is considered invalid.

### Using as separate React component
In this code we use [axios](https://github.com/axios/axios) to send post request. 

```jsx
import React, { Component } from 'react';
import axios from 'axios';

import FormComponent from 'Form';

export default class App extends Component {
    render() {
        const conf = {
            submitHandler: values => {
                console.log('Form values should be sent to the server here.');
                console.log('submitHandler must return promise.');
                return axios.post('api_endpoint_here', values)
                            .then(response => /*do something*/);
             }
        }

        const fields = [
            {
                name: 'name',
                label: 'Pet name',
                type: 'String',
                required: true,
                validators: [
                    {
                        params: [4, 64],
                        message: 'Must be bigger than 4 and smaller than 64 chars',
                        f: (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength
                    },
                    {
                        message: 'Can\'t contain digits',
                        f: value => !/[1-9]/.test(value)
                    },
                ]
            }
        ]

        return <FormComponent {...conf} fields={fields} />;
    }
}
```

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

