import React, { Component } from 'react';

import axios from 'axios';

import FormElement from './FormElement/FormElement';
import Button from './Button/Button';
import Spinner from '../Spinner/Spinner';

import classes from './Form.css';

export class Form extends Component {

    submitHandler = (event) => {
        event.preventDefault();
    }

    componentDidMount() {
        axios.get(this.props.source).then((result) => {
            let form = result.data;
            for (let key in form) {
                form[key].value = '';
                form[key].message = '';
                if (form[key].validators !== undefined) {
                    for (let name in form[key].validators) {
                        const params = [...form[key].validators[name].params];
                        const message = form[key].validators[name].message;
                        // eslint-disable-next-line no-new-func
                        form[key].validators[name] = new Function(...form[key].validators[name].creator);
                        form[key].validators[name].params = params;
                        form[key].validators[name].message = message;
                    }
                }
            }

            this.setState({
                ...form
            });
        });
    }


    inputChangedHandler = (event, key) => {
        let formField = {};
        formField[key] = {
            ...this.state[key],
            value: event.target.value
        };
        let field = formField[key];

        field.message = '';
        if (field.validators !== undefined) {
            for (let name in field.validators) {
                if (!field.validators[name](field.value, ...field.validators[name].params)) {
                    field.message = field.validators[name].message;
                    break;
                }
            }
        }

        this.setState({
            ...this.state,
            ...formField
        });
    }

    render() {
        let form = <Spinner />;
        let formElements = [];

        for (let key in this.state) {
            formElements.push(
                <FormElement
                    key={key}
                    id={key}
                    {...this.state[key]}
                    changed={(event) => this.inputChangedHandler(event, key)}
                />
            );
        }

        if (formElements.length) {
            form =
                <form
                    className={classes.Form}
                    onSubmit={null}>
                    {formElements}
                    <span></span>
                    <div><Button btnType="Primary">Submit</Button></div>
                </form >;
        }

        return form;
    }
}

export default Form;