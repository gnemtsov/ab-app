import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Form from '../../components/UI/Form/Form';
import * as actionTypes from "../../store/actionTypes";

class Auth extends Component {
    render() {
        const authRedirect = this.props.isAuthenticated ? <Redirect to="/" /> : null;

        return (
            <div>
                {authRedirect}
                <Form
                    title="Please, authenticate"
                    submitted={this.props.onAuth}
                    api="/auth/login" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { isAuthenticated: state.auth.isAuthenticated };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (tokens) => dispatch({
            type: actionTypes.S_LOGIN,
            tokens: tokens
        })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);