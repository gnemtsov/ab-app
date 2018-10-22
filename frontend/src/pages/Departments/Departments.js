import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Table from '../../components/Table/Table';
import * as actionTypes from "../../store/actionTypes";

import classes from './Departments.css';

export class Departments extends Component {	
    componentDidMount() {
        this.props.onInitDepartments();
    }

    render() {
        let departments = this.props.error ? <p>Departments can't be loaded!</p> : <Spinner />;

        if (this.props.departments.departments) {
            departments =
                <Table
                    title="Departments"
                    csvExport={true}
                    conf={{ emptyTableMessage: 'No departments found', selectable: true }}
                    rows={this.props.departments.departments.rows}
                    cols={this.props.departments.departments.cols}
                    filter={this.props.departments.filter}
                    onSetFilter={this.props.onSetFilter} />;
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
