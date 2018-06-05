import React, { Component } from 'react';

import axios from 'axios';
import AbForm from 'react-ab-form';

import Aux from '../../../hoc/Auxillary/Auxillary';
import Spinner from '../Spinner/Spinner';
import Icon from '../Icon/Icon';
import classes from './Form.css';

export class Form extends Component {

    state = { fields: null }

    componentDidMount() {
        axios.get(this.props.api)
            .then(result => this.setState({ fields: result.data }));
    }

    render() {
        let form = <Spinner />;

        if (this.state.fields !== null) {
            const data = {
                conf: {
                    className: classes.Form,
                    infoIcon: <Icon name="info" width="26" height="26" stroke="#666666" />,
                    submitHandler:
                        values => axios.post(this.props.api, values)
                            .then(response => this.props.submitted(response.data))
                },
                fields: this.state.fields
            }

            form = <AbForm data={data} />;
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