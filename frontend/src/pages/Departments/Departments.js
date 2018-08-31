import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Table from '../../containers/Table/Table';
import * as actionTypes from "../../store/actionTypes";

import classes from './Departments.css';

export class Departments extends Component {
    componentDidMount() {
        this.props.onInitDepartments();
    }

    render() {
        let departments = this.props.error ? <p>Departments can't be loaded!</p> : <Spinner />;

        if (this.props.departments) {
            departments =
                <Table
                    title="Departments"
                    conf={{ emptyTableMessage: 'No departments found' }}
                    setFilter={this.props.onSetFilter}
                    filter={this.props.filter}
                    {...this.props.departments} />;
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
	let {departments, filter} = state.departments;
	
    return {
        departments: departments,
        filter: filter,
        error: state.departments.error,
        isAuthenticated: state.auth.isAuthenticated
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
