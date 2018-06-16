import React, { Component } from 'react';

import axios from 'axios';
import AbTable from 'react-ab-table';

import ErrorBoundary from '../../../hoc/errorBoundary/errorBoundary';
import Spinner from '../Spinner/Spinner';
import * as Formatters from './Formatters/Formatters';

export class Table extends Component {

    conf = {
        selectable: true
    }

    state = {}

    constructor(props) {
        super(props);
        let { conf, cols, rows } = props;

        this.conf = {
            ...this.conf,
            ...conf
        }

        if (cols !== undefined) {            
            cols = cols.map(col => { //make functions out of formatters
                if (col.frontendFormatter !== undefined) {
                    col.formatter = Formatters[col.frontendFormatter];
                    delete col.frontendFormatter;
                }
                return col;
            });

            this.state = { cols, rows }
        }
    }

    componentDidMount() {
        if (this.state.cols === undefined) {
            axios.get(this.props.api)
                .then(result => this.setState(...result.data));
        }
    }

    render() {
        let table = <Spinner />;
        if (this.state.cols !== undefined) {
            table = <AbTable {...this.conf} {...this.state} />;
        }

        return (
            <React.Fragment>
                <h1>{this.props.title}</h1>
                <ErrorBoundary>{table}</ErrorBoundary>
            </React.Fragment >
        );
    }
}

export default Table;