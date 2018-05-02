import React, { Component } from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';

export class Table extends Component {

    render() {

        const data = this.props.data;
        console.log('Components, UI, Table: starting', data);

        let table = 'No data specified';
        if (data !== undefined && !data.length) {
            let thead = [];
            let tbody = [];
            let cells = [];

            data.cols.forEach((col, key) => {
                cells.push(<th key={`th${key}`}>{col.title}</th>);
            });
            thead = <tr key="thr">{cells}</tr>;

            data.rows.forEach((row, key) => {
                cells = [];
                for (var col in row) {
                    if (row.hasOwnProperty(col)) {
                        cells.push(<td key={`td${key}${col}`}>{row[col]}</td>);
                    }
                }
                tbody.push(<tr key={`tbr${key}`}>{cells}</tr>);
            });

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
            </Aux>
        );

    }
}

export default Table;