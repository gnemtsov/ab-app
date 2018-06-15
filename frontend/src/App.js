import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import Departments from './containers/Departments/Departments';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actionTypes from "./store/actionTypes";

import classes from './App.css';

const asyncAdd = asyncComponent(() => {
    return import('./containers/Add/Add');
});

const asyncEdit = asyncComponent(() => {
    return import('./containers/Edit/Edit');
});

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignin();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/auth" component={Auth} />
                <Route path="/add" render={() => <p className={classes.UnAuthMessage}>Please, authenticate to add departments.</p>} />
                <Route path="/edit" render={() => <p className={classes.UnAuthMessage}>Please, authenticate to edit departments.</p>} />
                <Route path="/" exact render={() => <p className={classes.UnAuthMessage}>Please, authenticate to see departments list.</p>} />
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/logout" component={Logout} />
                    <Route path="/add" component={asyncAdd} />
                    <Route path="/edit" component={asyncEdit} />
                    <Route path="/" exact component={Departments} />
                    <Redirect to="/" />
                </Switch>
            );
        }

        return (
            <div>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignin: () => dispatch({
            type: actionTypes.S_TRY_AUTO_SIGNIN
        })
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
