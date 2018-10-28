# Tables

Tables are the best way to present data to the users of your application. AB-APP table implementation includes backend and frontend logic. 

Implemented features:
- Pagination
- Sorting (hold shift for multisort) 
- Row selection (hold ctrl or shift to select multiple rows)
- CSV data export
- Sticky table toolbar
- Easy custom styling
- Very fast and lightweight, no dependencies

## Architecture

On the backend, there is a corresponding .sql file for each application table. This file contains a query that is executed to fetch table data from a database. Column descriptions are also stored on the backend. They are stored as .json files as array of objects. These descriptions go to `cols` property of the table React component (see below).

The backend is responsible for fetching table data from a database, applying backend "formatters" (see below) and providing column descriptions. 

The frontend is responsible for rendering tables. It has two React components: a high order table component (HOC) and a core table component. The core table component can be used outside AB-APP as an independent React component. 

HOC is responsible for fetching table data from the backend and applying frontend formatters. The core component is responsible for rendering and providing main table functionality (selecting, sorting, pagination, etc.)

![Tables architecture](architecture-Tables-API-Gateway.png)

## Formatters functions
Formatter function is a function that accepts column description and raw table data of the current row and returns the rendered content of table cell. There are backend and frontend libs of formatters functions.

Example:
```jsx
const sampleFormatter = (col, row) => `<b>${row.lastname}${row.firstname}</b>`;
```

Formatters are defined for a column and they are executed for each table cell in a column. There can only be one formatter per column. 

Since formatter function is executed for each cell, it slows down table creation and/or rendering. If possible you should try not to use formatters at all - try to get table data as it should be displayed right from a database. 

If you need to use a formatter, try to use frontend formatter. It is executed on the frontend and only for whose column cells that are currently rendered on a page.

Use backend formatters only if there are no other options. Backend formatters are executed on the backend and for all column cells at once.

## Core table component

This component can be used in any application without conjunction with the AB-APP backend.

The component has the following properties:

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| rowsPerPage | Integer | 10 | Number of rows rendered per page |
| selectable | Boolean | false | Whether rows can be selected or not |
| className | String | '' | Name of a custom CSS class (see below) |
| csvExport | Boolean | true | Whether table can be exported as CSV-file |
| emptyTableMessage | String | 'No data specified' | A message, shown when the table is empty. |
| cols | Array of objects | [] | Columns descriptions (see below) |
| rows | Array of objects | [] | Table data (see below) |


### Custom styling (className property)

To apply custom styling you should define `className` property. Your class will be put on top of default table styles, so all your custom styles will override the default. 

For example, to make headers' text green, you should set your custom class: `className = "CustomTable"`. Then write the following CSS in the .css file of your component, where you use table component:
```css
.CustomTable th {
    color: green;
}
```

### Columns descriptions (cols property)

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
| frontendFormatter | String | '' | Name of the frontend formatter function |
| backendFormatter | String | '' | Name of the backend formatter function |

### Table data (rows property)

Each table row is an object that holds the data of the table row. Object keys must be the same as the **names** properties of the cols objects.

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

### Using component independently
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
