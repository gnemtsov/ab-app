import React, { Component } from 'react';
import axios from 'axios';
import memoize from 'memoize-one';

import ErrorBoundary from '../../hoc/errorBoundary/errorBoundary';
import Spinner from '../../components/UI/Spinner/Spinner';
import TableComponent from '../../components/Table/Table';

import * as Formatters from './Formatters/Formatters';

export class Table extends Component {

    conf = {
        selectable: true
    }
    
    formattersToFunctions = memoize (
		(cols) => cols.map( col => { //make functions out of formatters
			const newCol = {...col};
			if (newCol.frontendFormatter !== undefined) {
				newCol.formatter = Formatters[newCol.frontendFormatter];
				delete newCol.frontendFormatter;
			}
			return newCol;
		})
    );

    constructor(props) {
        super(props);

        this.conf = {
            ...this.conf,
            ...props.conf
        }
    }

    componentDidMount() {
        /*if (this.state.cols === undefined) {
            axios.get(this.props.api)
                .then(result => this.setState(...result.data));
        }*/
    }

    render() {
        let table = <Spinner />;
		let {cols, rows} = this.props;
        if (cols !== undefined) {
			cols = this.formattersToFunctions(cols);
            table = <TableComponent {...this.conf} cols={cols} rows={rows} />;
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
