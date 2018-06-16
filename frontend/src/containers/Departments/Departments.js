import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Table from '../../components/UI/Table/Table';
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
    return {
        departments: state.departments.departments,
        error: state.departments.error,
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitDepartments: () => dispatch({
            type: actionTypes.S_INIT_DEPARTMENTS
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments);