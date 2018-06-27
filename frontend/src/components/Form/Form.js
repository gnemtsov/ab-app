import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import Button from '../UI/Button/Button';
import FormElement from './FormElement/FormElement';
import classes from './Form.css';

export default class AbForm extends Component {

    formClasses = [classes.Form]

    static defaultProps = {
        infoIcon: <div className={classes.DefaultInfoIcon}></div>,
        layout: 'horizontal',
        doneText: 'Done!',
        className: '',
        doneTextDuration: 2000,
        buttonText: ['Submit', 'Sending...']
    }

    static propTypes = {
        infoIcon: PropTypes.node,
        layout: PropTypes.oneOf(['horizontal', 'inline']),
        doneText: PropTypes.string,
        className: PropTypes.string,
        submitHandler: PropTypes.func.isRequired,
        doneTextDuration: PropTypes.number,
        buttonText: PropTypes.array,
        fields: PropTypes.array.isRequired
    }

    state = {
        sending: false,
        saved: false,
        fields: []
    }

    constructor(props) {
        super(props);

        const { layout, className, fields } = props;
        this.formClasses.push(layout === 'inline' ? classes.Inline : classes.Horizontal);
        this.formClasses.push(className);

        this.state.fields = fields.map((field) => { //-------> setup form fields in state
            this.setFieldDefaultValue(field, field.value);
            field.message = '';

            if (field.validators === undefined) {
                field.validators = [];
            } else {
                field.validators = field.validators.map((validator) => {
                    let f =
                        typeof validator.f === 'function' ?
                            validator.f :
                            // eslint-disable-next-line no-new-func
                            new Function("return " + validator.f)();                   
                    f.params = validator.params || [];
                    f.message = validator.message || '';
                    if(f.params.length){
                        f.message = f.message.replace(/%([0-9]+)%/g, (...args) => f.params[Number(args[1])]);
                    }
                    return f;
                });
            }

            return field;
        });
    }

    isFormReady = () => {
        for (const { required, value, message } of this.state.fields) {
            if ((required && value === '') || message !== '') {
                return false;
            }
        }
        return true;
    }

    setFieldDefaultValue = (field, value) => {
        const shouldClear = value === undefined || value === null;
        switch (field.type) {
            case 'Boolean':
                field.value = shouldClear ? false : value;
                break;
            case 'Date':
                field.value = shouldClear ? moment() : moment(value);
                break;
            default:
                field.value = shouldClear ? '' : value;
        }
        return field;
    }

    inputChangedHandler = (data, name) => {
        const i = this.state.fields.findIndex(field => name === field.name);
        const { type, validators } = this.state.fields[i];

        let stateValue;
        let validateValue;
        switch (type) {
            case 'Boolean':
                stateValue = data.target.checked;
                validateValue = data.target.checked;
                break;
            case 'Date':
                stateValue = data;
                validateValue = data.format('YYYY-MM-DD').toString();
                break;
            default:
                stateValue = data.target.value;
                validateValue = data.target.value;
        }

        let message = '';
        for (const f of validators) {
            if (!f(validateValue, ...f.params)) {
                message = f.message;
                break;
            }
        }

        let field = {
            ...this.state.fields[i],
            message: message,
            value: stateValue
        }

        this.setState((prevState, props) => {
            prevState.fields[i] = field;
            return { fields: prevState.fields };
        })
    }

    submitHandler = (event) => {
        event.preventDefault();

        this.setState({ sending: true });

        const values = {};
        for (const { type, name, value } of this.state.fields) {
            switch (type) {
                case 'Date':
                    values[name] = value.format('YYYY-MM-DD').toString();
                    break;
                default:
                    values[name] = value;
            }
        }

        this.props.submitHandler(values)
            .catch(error => {
                const errorField = error.response.data.field;
                this.setState(prevState => {
                    const i = prevState.fields.findIndex(field => errorField.name === field.name);
                    prevState.fields[i] = {
                        ...prevState.fields[i],
                        message: errorField.message
                    };
                    return {
                        sending: false,
                        fields: prevState.fields
                    };
                })
            })
            .then(result => {
                if (typeof result === 'function') {
                    return result();
                } else {
                    this.setState(prevState => {
                        let fields = prevState.fields;
                        if (result === true) { //clear form fields
                            fields = fields.map(field => this.setFieldDefaultValue(field, null));
                        }
                        return {
                            saved: true,
                            sending: false,
                            fields: fields
                        };
                    });
                    this.timerId = setTimeout(
                        () => this.setState({ saved: false }),
                        this.props.doneTextDuration
                    );
                }
            });
    }

    componentWillUnmount() {
        clearTimeout(this.timerId);
    }

    render() {
        const {
            infoIcon,
            layout,
            doneText,
            buttonText
        } = this.props;

        //form elements
        let formElements = [];
        for (const field of this.state.fields) {
            let element =
                <FormElement
                    key={field.name}
                    id={field.name}
                    infoIcon={infoIcon}
                    layout={layout}
                    {...field}
                    inputChanged={(data) => this.inputChangedHandler(data, field.name)} />

            if (layout === 'inline') {
                element =
                    <div
                        className={classes.FormElement}>
                        {element}
                    </div>;
            }

            formElements.push(element);
        }

        //form button
        const doneTextClasses = [classes.DoneText];
        if (this.state.saved) {
            doneTextClasses.push(classes.Visible);
        }
        let button =
            <div
                key='SubmitButton'
                className={classes.SubmitButton}>
                <Button
                    type="Submit"
                    disabled={this.state.sending || !this.isFormReady()}>
                    {this.state.sending ? buttonText[1] : buttonText[0]}
                </Button>
                <span className={doneTextClasses.join(' ')}>{doneText}</span>
            </div>;

        return ([
            <form
                key="AbForm"
                className={this.formClasses.join(' ')}
                onSubmit={this.submitHandler}>
                {formElements}
                {button}
            </form >,
            <ReactTooltip
                key="ReactTooltip"
                type="info"
                place="right"
                className={classes.Tooltip} />
        ]);
    }
}
