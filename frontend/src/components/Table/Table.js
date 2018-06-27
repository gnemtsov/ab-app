import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paginator from './Paginator/Paginator';
import Toolbar from './Toolbar/Toolbar';
import classes from './Table.css';

export default class Table extends Component {
    defaultSortParams = []

    static defaultProps = {
        rowsPerPage: 10,
        selectable: false,
        csvExport: true,
        emptyTableMessage: 'No data specified',
        cols: [],
        rows: []
    }

    static propTypes = {
        rowsPerPage: PropTypes.number,
        selectable: PropTypes.bool,
        csvExport: PropTypes.bool,
        emptyTableMessage: PropTypes.string,
        cols: PropTypes.array,
        rows: PropTypes.array
    }

    state = {
        cols: [],
        rows: [],
        sortParams: [],
        selected: [],
        totalPages: 1,
        currentPage: 1,
        toolbarShow: false,
        isEmpty: true,
        bodyTop: 0,
        headerHeight: 0,
        bodyHeight: 0
    }

    constructor(props) { //constructor updates initial state
        super(props);

        this.refHeader = React.createRef()
        this.refBody = React.createRef()

        let { rowsPerPage, cols, rows } = props;
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        //make defaultSortParams
        let sortCols = cols.filter(col => col.sortDirection !== undefined);
        if (sortCols.length) {
            sortCols.sort((a, b) => a.sortOrder - b.sortOrder);

            this.defaultSortParams = sortCols.map((col) => ({
                name: col.name,
                dir: col.sortDirection
            }));
        }

        rows = this.multiSort(rows, this.defaultSortParams); //sort rows

        this.state = {
            ...this.state,
            cols,
            rows,
            isEmpty: !cols.length || !rows.length,
            sortParams: this.defaultSortParams,
            totalPages
        };
    }

    componentDidMount() {
        if (!this.state.isEmpty) {
            const bodyRect = this.refBody.current.getBoundingClientRect();
            const headerRect = this.refHeader.current.getBoundingClientRect();

            this.setState({
                bodyTop: bodyRect.top + window.scrollY,
                headerHeight: headerRect.height,
                bodyHeight: bodyRect.height
            });
        }
    }


    multiSort = (arr, sortParams) => {
        if (!sortParams.length) {
            return arr.slice();
        }

        const cols = sortParams.map((col) => col.name);
        const dirs = sortParams.map((col) => col.dir);

        const sortRecursive = (a, b, cols, dirs, index) => {
            const col = cols[index];
            const dir = dirs[index];
            let x = a.data[col];
            let y = b.data[col];

            if (typeof x === 'string' || typeof y === 'string') {
                x = x === null ? '' : x.toLowerCase();
                y = y === null ? '' : y.toLowerCase();
            }

            if (x < y) {
                return dir === 'DESC' ? 1 : -1;
            }

            if (x > y) {
                return dir === 'DESC' ? -1 : 1;
            }

            return cols.length - 1 > index ? sortRecursive(a, b, cols, dirs, index + 1) : a.i - b.i;
        }

        let sortArr = arr.map((data, i) => ({ data, i })); //mapping needed to make sort stable for equal values
        sortArr.sort((a, b) => sortRecursive(a, b, cols, dirs, 0));
        return sortArr.map(el => el.data);
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

        const sortedRows = this.multiSort(this.state.rows, sortParams); //sort rows
        const selected = this.state.selected.map(i => sortedRows.indexOf(sortedRows[i])); //remap selected values

        this.setState({
            rows: sortedRows,
            selected: selected,
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

        this.setState({ selected: selected });
    }

    pageClickHandler = (event, button) => { //paginator handler
        event.preventDefault();
        this.setState(prevState => {
            switch (button) {
                case 'back': return { currentPage: prevState.currentPage - 1 };
                case 'forward': return { currentPage: prevState.currentPage + 1 };
                default: return { currentPage: button }
            }
        })
    }

    toolbarShow = () => this.setState({ toolbarShow: true })
    toolbarHide = () => this.setState({ toolbarShow: false })

    csvExportHandler = (event) => {
        const { cols, rows } = this.state;

        let table = 'No data specified';
        if (cols.length) {
            const totalRows = rows.length;

            //head
            const thead = cols.map(col => '"' + String(col.title) + '"').join(';');

            //body
            let tbody = [];
            for (let i = 0; i < totalRows; i++) {
                let cells = [];
                const row = rows[i];
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

    selectAllHandler = (event) => {
        let selected = [];
        if (!this.state.selected.length) {
            for (let i = 0; i < this.state.rows.length; i++) {
                selected.push(i);
            }
        }
        this.setState({ selected: selected })
    }

    defaultSortHandler = (event) => {
        this.setState({
            rows: this.multiSort(this.state.rows, this.defaultSortParams),
            sortParams: this.defaultSortParams,
        });
    }

    render() {
        if (this.state.isEmpty) {
            return <div>{this.props.emptyTableMessage}</div>;
        }

        const {
            cols,
            rows,
            totalPages,
            currentPage
        } = this.state;

        const totalCols = cols.length;
        const totalRows = rows.length;

        const {
            rowsPerPage,
            selectable,
            csvExport
        } = this.props;

        const pageFirstRow = (currentPage - 1) * rowsPerPage;
        const pageLastRow = totalRows < pageFirstRow + rowsPerPage ? totalRows : pageFirstRow + rowsPerPage;

        let cells = [];

        //head
        let thead = [];
        for (const col of cols) {
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
                    key={`th${col.name}`}
                    onMouseDown={event => this.headerMouseDownHandler(event, col.name)}>
                    {[col.title, sort]}
                </th>
            );
        };
        thead = <tr key="thr">{cells}</tr>;

        //footer
        let paginator = null;
        if (totalPages > 1) {
            paginator =
                <Paginator
                    cp={currentPage}
                    tp={totalPages}
                    pageClickHandler={this.pageClickHandler} />;
        }
        let tfoot =
            <tr key="tfr">
                <td colSpan={totalCols}>
                    <div className={classes.Footer}>
                        <div className={classes.Legend}>Rows {pageFirstRow + 1} to {pageLastRow} of {totalRows}</div>
                        {paginator}
                    </div>
                </td>
            </tr>;

        //body
        let tbody = [];
        for (let i = pageFirstRow; i < pageLastRow; i++) {
            let attachedClasses = [];
            cells = [];
            const row = rows[i];

            for (const col of cols) {
                const tdKey = `td${i}${col.name}`;

                let value = col.formatter ? col.formatter(col, row) : row[col.name];

                if (col.html) {
                    cells.push(
                        <td
                            key={tdKey}
                            dangerouslySetInnerHTML={{ __html: value }}>
                        </td>
                    );
                } else {
                    cells.push(
                        <td key={tdKey}>
                            {value}
                        </td>
                    );
                }
            }

            if (this.state.selected.indexOf(i) !== -1) {
                attachedClasses.push(classes.Selected);
            }
            if (i % 2 === 0) {
                attachedClasses.push(classes.Odd);
            }

            tbody.push(
                <tr
                    key={`tbr${i}`}
                    className={attachedClasses.join(' ')}
                    onMouseDown={selectable ? event => this.rowMouseDownHandler(event, i, pageFirstRow, pageLastRow) : null}>
                    {cells}
                </tr>
            );
        }

        return (
            <div
                className={classes.Container}
                onMouseEnter={this.toolbarShow}
                onMouseLeave={this.toolbarHide}>
                <table
                    className={classes.Table}>
                    <thead ref={this.refHeader} onMouseEnter={this.toolbarShow}>{thead}</thead>
                    <tfoot onMouseEnter={this.toolbarHide}>{tfoot}</tfoot>
                    <tbody ref={this.refBody} onMouseEnter={this.toolbarShow}>{tbody}</tbody>
                </table>
                <Toolbar
                    show={this.state.toolbarShow}
                    defaultTop={this.state.headerHeight}
                    boundaryTop={this.state.bodyTop}
                    boundaryBottom={this.state.bodyTop + this.state.bodyHeight}
                    defaultSortHandler={this.defaultSortHandler}
                    csvExportHandler={csvExport ? this.csvExportHandler : null}
                    selectAllHandler={selectable ? this.selectAllHandler : null} />
            </div>
        );
    }
}
