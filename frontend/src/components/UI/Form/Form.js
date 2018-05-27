import React, { Component } from 'react';

import axios from 'axios';
import AbForm from 'react-ab-form';

import Spinner from '../Spinner/Spinner';
import Icon from '../Icon/Icon';
import classes from './Form.css';

export class Form extends Component {

    submitHandler = (event) => {
        axios.post(this.props.api).then((result) => {
            console.log(result.data);
        });
    }

    componentDidMount() {
        axios.get(this.props.api).then((result) => {
            this.setState({
                ...result.data
            });
        });
    }

    render() {
        let form = <Spinner />;

        if (this.state !== null) {
            const infoIcon = <Icon name="info" width="26" height="26" stroke="#666666" />;

            form =
                <AbForm
                    data={this.state}
                    className={classes.Form}
                    infoIcon={infoIcon} />;
        }

        return form;
    }
}

export default Form;