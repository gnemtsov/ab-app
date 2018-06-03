import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxillary/Auxillary';
import Spinner from '../../components/UI/Spinner/Spinner';
import AbTable from 'react-ab-table';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from "../../store/actionTypes";
import axios from 'axios';

export class Departments extends Component {
    componentDidMount() {
        this.props.onInitDepartments();
    }

    render() {

        let departments = this.props.error ? <p>Departments can't be loaded!</p> : <Spinner />;

        if (this.props.departments) {
            departments = <AbTable data={this.props.departments} />;
        }

        return (
            <Aux>
                {departments}
            </Aux>
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Departments, axios));