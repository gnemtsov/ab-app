import React, { Component } from 'react';

import axios from 'axios';
import AbTable from 'react-ab-table';

import Aux from '../../../hoc/Auxillary/Auxillary';
import Spinner from '../Spinner/Spinner';
import * as formatters from '../../../shared/formatters';

export class Table extends Component {

    conf = {
        selectable: true,
        formatters: formatters
    }

    state = {
        cols: [],
        rows: []
    }

    constructor(props) { //constructor updates initial state
        super(props);
        const { conf, cols, rows } = props;

        this.conf = {
            ...this.conf,
            ...conf
        }

        if (cols !== undefined) {
            this.state = {
                ...this.state,
                cols,
                rows
            }
        }
    }

    componentDidMount() {
        if (!this.state.cols.length) {
            axios.get(this.props.api)
                .then(result => this.setState(...result.data));
        }
    }

    render() {
        let table = <Spinner />;
        if (this.state.cols.length) {
            table = <AbTable data={{ conf: this.conf, ...this.state }} />;
        }

        return (
            <Aux>
                <h1>{this.props.title}</h1>
                {table}
            </Aux >
        );
    }
}

export default Table;