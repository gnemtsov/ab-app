import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Table from '../../components/Table/Table';
import * as actionTypes from "../../store/actionTypes";

import * as Formatters from '../../components/Table/Formatters/Formatters';

import classes from './Departments.css';

export class Departments extends Component {
	state = {
		initialized: false,
		cols: [],
		filteredRows: [],
		rows: []
	}
	
	static filterRows(rows, cols, filter) {
		return rows.filter( Departments.useFilter.bind(null, filter, cols) )
    };
	
	static formattersToFunctions(cols) {
		return cols.map( col => { //make functions out of formatters
			const newCol = {...col};
			if (newCol.frontendFormatter !== undefined) {
				newCol.formatter = Formatters[newCol.frontendFormatter];
				delete newCol.frontendFormatter;
			}
			return newCol;
		});
    }
	
	static buildFilter(search, option) {
		if (search === "" || !option) {
			return null;
		}
		
		const filter = {};
		filter[option.name] = search;
		
		return filter;
	}
	
	static useFilter(filter, cols, row) {
		if (!filter) {
			return true;
		}
		
		for (const key in filter) {
			if (!filter.hasOwnProperty(key)) {
				continue;
			}
			const col = cols.find(x => x.name === key);
			if (!col) {
				continue;
			}
						
			if (!row[key]) {
				return false;
			}
			const value = col.formatter ? col.formatter(col, row) : row[key];
			if (value.toString().indexOf(filter[key]) < 0) {
				return false;
			}
		}
		return true;
	}
	
	
    componentDidMount() {
        this.props.onInitDepartments();
    }

	static getDerivedStateFromProps(props, state) {
		const departments = props.departments.departments;
		if (!state.initialized && departments) {
			return {
				initialized: true,
				cols: Departments.formattersToFunctions(departments.cols),
				rows: departments.rows,
				filteredRows: departments.rows
			}
		}
		return null;
	}
	
	componentDidUpdate(prevProps, prevState) {
		const departments = this.props.departments.departments;
		if (!this.state.initialized && departments) {
			this.setState({
				initialized: true,
				cols: Departments.formattersToFunctions(departments.cols),
				rows: departments.rows,
				filteredRows: departments.rows
			});
			return
		}
		if (this.props.filter !== prevProps.filter) {
			this.setState({
				filteredRows: Departments.filterRows(this.state.rows, this.state.cols, this.props.filter)
			});
		}		
	}

    render() {
        let departments = this.props.error ? <p>Departments can't be loaded!</p> : <Spinner />;

        if (this.state.initialized) {
            departments =
                <Table
                    title="Departments"
                    conf={{ emptyTableMessage: 'No departments found' }}
                    rows={this.state.filteredRows}
                    cols={this.state.cols}
                    isEmpty={this.state.rows.length === 0}
                    onSetFilter={
						(search, selected) => this.props.onSetFilter(Departments.buildFilter(search, selected))
					} />;
        }

        return (
            <div
                className={classes.TableContainer}>
                {departments}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        departments: state.departments,
        error: state.departments.error,
        isAuthenticated: state.auth.isAuthenticated,
        filter: state.departments.filter
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitDepartments: () => dispatch({
            type: actionTypes.S_INIT_DEPARTMENTS
        }),
        onSetFilter: (filter) => dispatch({
			type: actionTypes.R_SET_DEPARTMENTS_FILTER,
			filter: filter
		})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
