import React, { Component } from 'react';

import axios from 'axios';
import AbForm from 'react-ab-form';

import Aux from '../../../hoc/Auxillary/Auxillary';
import Spinner from '../Spinner/Spinner';
import Icon from '../Icon/Icon';
import classes from './Form.css';

export class Form extends Component {

    state = {
        saved: false,
        fields: null
    }

    componentDidMount() {
        axios.get(this.props.api)
            .then(result => this.setState({ fields: result.data }));
    }

    submitHandler = (values) => {
        //if server responds with error it will be catched by AbForm component
        return axios.post(this.props.api, values)
            .then(response => {
                if (typeof this.props.submitted === 'function') {
                    return this.props.submitted(response.data);
                } else {
                    return false; //don't clear form by default
                }
            });
    }

    render() {
        let form = <Spinner />;

        if (this.state.fields !== null) {
            const conf = {
                className: classes.Form,
                submitHandler: this.submitHandler,
                infoIcon: <Icon name="info" width="26" height="26" stroke="#666666" />
            };
            if (this.props.buttonText !== undefined) {
                conf.buttonText = this.props.buttonText;
            }
            if (this.props.doneText !== undefined) {
                conf.doneText = this.props.doneText;
            }

            const fields = this.state.fields;

            form = <AbForm data={{ conf, fields }} />;
        }

        return (
            <Aux>
                <h1>{this.props.title}</h1>
                {form}
            </Aux>
        );
    }
}

export default Form;