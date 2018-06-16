import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Icon from '../../components/UI/Icon/Icon';
import axios from 'axios';

import classes from './errorBoundary.css';

class ErrorBoundary extends Component {
    state = {}

    reportError = () => {
        //const { errorType, error, state } = this.state;
        if (process.env.NODE_ENV !== "development") {  //TODO report errors in production environment
            return;
        }
    }

    componentWillMount() {
        this.resInterceptor = axios.interceptors.response.use(
            res => res,
            error => {
                this.setState({
                    errorType: 'server',
                    error: error
                }, this.reportError);
                return Promise.reject(error);
            }
        );
    }

    componentWillUnmount() {
        axios.interceptors.response.eject(this.resInterceptor);
    }

    componentDidCatch(error, info) {
        this.setState({
            errorType: 'client',
            error,
            info
        }, this.reportError);
    }

    errorConfirmedHandler = () => {
        this.setState(prevState => {
            delete prevState.errorType;
            return prevState;
        });
    }

    render() {
        let modal = null;
        let message = '';
        if (this.state.errorType !== undefined) {
            message =
                process.env.NODE_ENV === "development" ?
                    `Oops, we've got a ${this.state.errorType}-side error!\n See developer console for details...` :
                    `Something went wrong!`;
            modal =
                <Modal
                    show={true}
                    modalClosed={this.errorConfirmedHandler}>
                    <div className={classes.Container}>
                        <Icon width='48' height='48' name='alert-octagon' stroke='red' />
                        <span className={classes.Message}>{message}</span>
                    </div>
                </Modal>;
        }

        let children = this.props.children;
        if (this.state.error !== undefined) {
            children = '{Broken component}';
        }

        return (
            <React.Fragment>
                {modal}
                {children}
            </React.Fragment>
        );
    }
}

export default ErrorBoundary;