import React, { Component } from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';
import Paginator from './Paginator/Paginator';

import * as utility from '../../../shared/utility';

import classes from './Table.css';

export class Table extends Component {

    state = {
        currentPage: 1,
        selected: [],
        sorted: []
    }

    setDefaultSorting() {
        const data = this.props.data;

        let sortCols = data.cols.filter(col => col.sortDirection !== undefined);
        if (sortCols.length) {
            sortCols.sort((a, b) => a.sortOrder - b.sortOrder);

            const sorted = sortCols.map((col) => ({
                name: col.name,
                dir: col.sortDirection
            }));

            this.setState({
                ...this.state,
                sorted
            });
        }
    }

    componentDidMount() {
        this.setDefaultSorting();
    }

    headerMouseDownHandler = (event, colName) => { //sort handler
        event.preventDefault();

        let sorted = this.state.sorted.slice();
        let sortIndex = sorted.findIndex(el => el.name === colName);

        if (event.shiftKey) {
            if (sortIndex === -1) {
                sorted.push({
                    name: colName,
                    dir: 'ASC'
                });
            } else if (sorted[sortIndex].dir === 'ASC') {
                sorted[sortIndex].dir = 'DESC';
            } else {
                sorted.splice(sortIndex, 1);
            }
        } else {
            if (sortIndex === -1) {
                sorted = [{
                    name: colName,
                    dir: 'ASC'
                }];
            } else if (sorted[sortIndex].dir === 'ASC') {
                sorted = [{
                    name: colName,
                    dir: 'DESC'
                }];
            } else {
                sorted = [];
            }
        }

        this.setState({
            ...this.state,
            sorted
        });
    }

    rowMouseDownHandler = (event, row, pageFirstRow, pageLastRow) => { //select handler
        event.preventDefault();

        let selected = this.state.selected.slice();

        if (event.ctrlKey) {
            const selectedRowIndex = selected.indexOf(row);
            selectedRowIndex === -1 ? selected.push(row) : selected.splice(selectedRowIndex, 1);
        } else if (event.shiftKey) {
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
        const data = this.props.data;
        console.log('Components, UI, Table: rendering', data);

        let table = 'No data specified';
        let totalPages = 0;
        if (data !== undefined && !data.length) {
            let thead = [];
            let tbody = [];

            totalPages = Math.ceil(data.rows.length / data.conf.rowsPerPage);

            //sort
            if (this.state.sorted.length) {
                const cols = this.state.sorted.map((col) => col.name);
                const dirs = this.state.sorted.map((col) => col.dir);
                data.rows = utility.multiSort(data.rows, cols, dirs);
            }

            //head
            let cells = [];
            data.cols.forEach((col, key) => {
                let sortObj = this.state.sorted.find(el => el.name === col.name);
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
                <Paginator currentPage={this.state.currentPage} totalPages={totalPages} pageClickHandler={this.pageClickHandler} />
            </Aux>
        );
    }
}

export default Table;