import React, { Component } from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';
import Paginator from './Paginator/Paginator';

import * as utility from '../../../shared/utility';

import classes from './Table.css';

export class Table extends Component {

    state = {
        data: {
            conf: {
                rowsPerPage: 15,
                selectable: false
            },
            cols: [],
            rows: []
        },
        totalPages: 1,
        currentPage: 1,
        selected: [],
        sortParams: [],
        defaultSortParams: []
    }

    constructor(props) { //constructor updates initial state
        super(props);

        const data = props.data; //table data provided
        if (data === undefined || data.cols === undefined || !data.cols.length) {
            return;
        }

        data.conf = {
            ...this.state.data.conf,
            ...data.conf
        }

        const totalPages = Math.ceil(data.rows.length / data.conf.rowsPerPage);

        let defaultSortParams = [];
        let sortCols = data.cols.filter(col => col.sortDirection !== undefined);
        if (sortCols.length) {
            sortCols.sort((a, b) => a.sortOrder - b.sortOrder);

            defaultSortParams = sortCols.map((col) => ({
                name: col.name,
                dir: col.sortDirection
            }));
        }

        if (defaultSortParams.length) {
            const cols = defaultSortParams.map((col) => col.name);
            const dirs = defaultSortParams.map((col) => col.dir);
            data.rows = utility.multiSort(data.rows, cols, dirs);
        }

        this.state = {
            ...this.state,
            data,
            totalPages,
            sortParams: defaultSortParams,
            defaultSortParams
        };
    }

    exportToCSV = () => { //export data as comma-separated text
        const data = this.state.data;
        
        let table = 'No data specified';
        if (data !== undefined && !data.length) {
            //head
            const thead = data.cols.map(col => '"' + String(col.title) + '"').join(';');

            //body
            let tbody = [];
            for (let i = 0; i < data.rows.length; i++) {
                let cells = [];
                const row = data.rows[i];
                for (var col in row) {
                    if (row.hasOwnProperty(col)) {
                        cells.push('"' + String(row[col]).replace(/"/g, '""') + '"');
                    } else {
                        cells.push('" "');
                    }
                }
                tbody.push(cells.join(';'));
            }

            table = `${thead}\r\n${tbody.join("\r\n")}`;
        }

        const uri = 'data:application/csv;charset=utf-8;base64,';
        const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));

        let link = document.createElement("a");
        link.download = "export.csv";
        link.href = uri + base64(table);
        link.click();
    }

    headerMouseDownHandler = (event, colName) => { //sort handler
        event.preventDefault();

        let sortParams = this.state.sortParams.slice();
        let sortIndex = sortParams.findIndex(el => el.name === colName);

        if (event.shiftKey) {
            if (sortIndex === -1) {
                sortParams.push({
                    name: colName,
                    dir: 'ASC'
                });
            } else if (sortParams[sortIndex].dir === 'ASC') {
                sortParams[sortIndex].dir = 'DESC';
            } else {
                sortParams.splice(sortIndex, 1);
            }
        } else {
            if (sortIndex === -1) {
                sortParams = [{
                    name: colName,
                    dir: 'ASC'
                }];
            } else if (sortParams[sortIndex].dir === 'ASC') {
                sortParams = [{
                    name: colName,
                    dir: 'DESC'
                }];
            } else {
                sortParams = [];
            }
        }

        const cols = sortParams.map((col) => col.name);
        const dirs = sortParams.map((col) => col.dir);
        const rows = this.state.data.rows.slice();
        const sortedRows = utility.multiSort(rows, cols, dirs);
        const updatedSelected = this.state.selected.map(i => sortedRows.indexOf(rows[i])); //remap selected values after sort

        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                rows: sortedRows
            },
            selected: updatedSelected,
            sortParams: sortParams
        });
    }

    rowMouseDownHandler = (event, row, pageFirstRow, pageLastRow) => { //select handler

        let selected = this.state.selected.slice();

        if (event.ctrlKey) {
            const selectedRowIndex = selected.indexOf(row);
            selectedRowIndex === -1 ? selected.push(row) : selected.splice(selectedRowIndex, 1);
        } else if (event.shiftKey) {
            event.preventDefault();
            const selectedRowIndex = selected.indexOf(row);
            const selectedOnPage = selected.filter(i => i >= pageFirstRow && i <= pageLastRow);
            const lastSelectedRow = selectedOnPage.length ? selectedOnPage[selectedOnPage.length - 1] : row;

            const selectAction = (i) => {
                const selectedI = selected.indexOf(i);
                if (selectedRowIndex === -1) {
                    selectedI === -1 && selected.push(i);
                } else {
                    row !== i && selected.splice(selectedI, 1);
                }
            }

            if (row > lastSelectedRow) {
                for (let i = lastSelectedRow; i <= row; i++) {
                    selectAction(i);
                }
            } else {
                for (let i = lastSelectedRow; i >= row; i--) {
                    selectAction(i);
                }
            }
        } else {
            selected = selected.filter(row => row < pageFirstRow || row > pageLastRow);
            selected.push(row);
        }

        this.setState({
            ...this.state,
            selected: selected
        });
    }

    pageClickHandler = (event, page) => { //paginator handler
        event.preventDefault();

        let newPage = page;
        if (newPage === 'back') {
            newPage = this.state.currentPage - 1;
        } else if (newPage === 'forward') {
            newPage = this.state.currentPage + 1;
        }

        this.setState({
            ...this.state,
            currentPage: newPage
        });
    }

    render() {
        const data = this.state.data;
        console.log('Components, UI, Table: rendering', data);

        let table = 'No data specified';
        if (data !== undefined && !data.length) {
            let thead = [];
            let tbody = [];

            //head
            let cells = [];
            data.cols.forEach((col, key) => {
                let sortObj = this.state.sortParams.find(el => el.name === col.name);
                let sort = '';
                if (sortObj !== undefined) {
                    switch (sortObj.dir) {
                        case 'ASC': sort = '\u2197'; break;
                        case 'DESC': sort = '\u2198'; break;
                        default: sort = '';
                    }
                }
                cells.push(
                    <th
                        key={`th${key}`}
                        onMouseDown={event => this.headerMouseDownHandler(event, col.name)}>
                        {[col.title, sort]}
                    </th>
                );
            });
            thead = <tr key="thr">{cells}</tr>;

            //body
            const pageFirstRow = (this.state.currentPage - 1) * data.conf.rowsPerPage;
            const pageLastRow = data.rows.length < pageFirstRow + data.conf.rowsPerPage ? data.rows.length : pageFirstRow + data.conf.rowsPerPage;
            for (let i = pageFirstRow; i < pageLastRow; i++) {
                cells = [];
                const row = data.rows[i];
                for (var col in row) {
                    if (row.hasOwnProperty(col)) {
                        cells.push(<td key={`td${i}${col}`}>{row[col]}</td>);
                    } else {
                        cells.push(<td key={`td${i}${col}`}></td>);
                    }
                }
                tbody.push(
                    <tr
                        key={`tbr${i}`}
                        className={this.state.selected.indexOf(i) === -1 ? '' : classes.Selected}
                        onMouseDown={data.conf.selectable ? event => this.rowMouseDownHandler(event, i, pageFirstRow, pageLastRow) : null}>
                        {cells}
                    </tr>
                );
            }

            table = (
                <table>
                    <thead>{thead}</thead>
                    <tbody>{tbody}</tbody>
                </table>
            );
        }

        return (
            <Aux>
                {table}
                <button onClick={this.exportToCSV}>Export to csv</button>
                <Paginator currentPage={this.state.currentPage} totalPages={this.state.totalPages} pageClickHandler={this.pageClickHandler} />
            </Aux>
        );
    }
}

export default Table;