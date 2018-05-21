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

    isFormReady = () => {
        for (let key in this.state) {
            if ((this.state[key].required && this.state[key].value === '') || this.state[key].message !== '') {
                return false;
            }
        }
        return true;
    }

    componentDidMount() {
        axios.get(this.props.source).then((result) => {
            let form = result.data;

            for (let key in form) {
                let field = form[key];
                field.message = '';

                if (field.value === undefined) {
                    switch (field.type) {
                        case 'checkbox':
                            field.value = false;
                            break;
                        default:
                            field.value = '';
                    }
                }

                if (field.validators !== undefined) {
                    for (let name in field.validators) {
                        let params = [];
                        if (field.validators[name].params !== undefined && field.validators[name].params.length) {
                            params = [...field.validators[name].params];
                        }
                        const message = field.validators[name].message;
                        // eslint-disable-next-line no-new-func
                        field.validators[name] = new Function(...form[key].validators[name].creator);
                        field.validators[name].params = params;
                        field.validators[name].message = message;
                    }
                }
            }

            this.setState({
                ...form
            });
        });
    }


    inputChangedHandler = (event, key) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        console.log(key, value);

        let formField = {};
        formField[key] = {
            ...this.state[key],
            value: value
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
                    <div
                        className={classes.SubmitButton}>
                        <Button
                            btnType="Primary"
                            disabled={!this.isFormReady()}>
                            Submit
                        </Button>
                    </div>
                </form >;
        }

        return form;
    }
}

export default Form;