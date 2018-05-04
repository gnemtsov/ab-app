import React, { Component } from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';
import Paginator from './Paginator/Paginator';

export class Table extends Component {

    state = {
        currentPage: 1
    }

    pageClickHandler = (event, page) => {
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
        console.log('Components, UI, Table: starting', data);

        let table = 'No data specified';
        let totalPages = 0;
        if (data !== undefined && !data.length) {
            let thead = [];
            let tbody = [];

            totalPages = Math.ceil(data.rows.length / data.conf.rowsPerPage);

            //head
            let cells = [];
            data.cols.forEach((col, key) => {
                cells.push(<th key={`th${key}`}>{col.title}</th>);
            });
            thead = <tr key="thr">{cells}</tr>;

            //body
            const startRow = (this.state.currentPage - 1) * data.conf.rowsPerPage;
            for (let i = startRow; i < data.rows.length && i < startRow + data.conf.rowsPerPage; i++) {
                cells = [];
                const row = data.rows[i];
                for (var col in row) {
                    if (row.hasOwnProperty(col)) {
                        cells.push(<td key={`td${i}${col}`}>{row[col]}</td>);
                    }
                }
                tbody.push(<tr key={`tbr${i}`}>{cells}</tr>);
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