import React, { Component } from 'react';
import axios from 'axios';

import ErrorBoundary from '../../hoc/errorBoundary/errorBoundary';
import Spinner from '../../components/UI/Spinner/Spinner';
import Icon from '../../components/UI/Icon/Icon';
import FormComponent from '../../components/Form/Form';

import classes from './Form.css';

export class Form extends Component {
    conf = {
        className: classes.Form,
        infoIcon: <Icon name="info" width="26" height="26" stroke="#666666" />
    }

    state = {}

    constructor(props) {
        super(props);

        let { conf, fields } = props;

        this.conf = {
            ...this.conf,
            ...conf,
            submitHandler: this.submitHandler
        }

        this.state = { fields }
    }

    componentDidMount() {
        if (this.state.fields === undefined) {
            axios.get(this.props.api)
                .then(result => this.setState({ fields: result.data }));
        }
    }

    submitHandler = (values) => {
        //if the server responds with error, it will be catched by AbForm component
        return axios.post(this.props.api, values)
            .then(response => {
                if (typeof this.props.submitted === 'function') {
                    return () => this.props.submitted(response.data);
                } else {
                    return this.props.submitted; //don't clear form by default
                }
            });
    }

    render() {
        let form = <Spinner />;

        if (this.state.fields !== undefined) {
            form = <FormComponent {...this.conf} {...this.state} />;
        }

        return (
            <React.Fragment>
                <h1>{this.props.title}</h1>
                <ErrorBoundary>{form}</ErrorBoundary>
            </React.Fragment>
        );
    }
}

export default Form;