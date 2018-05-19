import React from 'react';

import classes from './FormElement.css';

const FormElement = (props) => {
    let element = [];
    let inputClasses = [classes.Input];

    if (props.message.length) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.type) {

        case 'String':
            element.push(
                <label
                    key={props.id + '_label'}
                    className={classes.Label}
                    htmlFor={props.id}>
                    {props.label}
                </label>
            );
            element.push(
                <div key={props.id + '_input'}>
                    <input
                        type="text"
                        className={inputClasses.join(' ')}
                        id={props.id}
                        placeholder={props.placeholder}
                        value={props.value}
                        required={props.required ? true : false}
                        onChange={props.changed} />

                    <div
                        className={classes.Message}>
                        {props.message}
                    </div>
                </div>
            );
            break;

        case 'Boolean':
            element.push(
                <label
                    key={props.id + '_label'}
                    className={classes.Label}
                    htmlFor={props.id}>
                    {props.label}
                </label>
            );
            element.push(
                <div key={props.id + '_input'}>
                    <input
                        type="checkbox"
                        className={inputClasses.join(' ')}
                        id={props.id}
                        value={props.value ? 'on' : 'off'}
                        onChange={props.changed} />
                    <div
                        className={classes.Message}>
                        {props.message}
                    </div>
                </div>
            );
            break;

        /* 
                case ('textarea'):
                    inputElement = <textarea
                        className={inputClasses.join(' ')}
                        {...props.elementConfig}
                        value={props.value}
                        onChange={props.changed} />;
                    break;
                case ('select'):
                    inputElement = (
                        <select
                            className={inputClasses.join(' ')}
                            value={props.value}
                            onChange={props.changed}>
                            {props.elementConfig.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.displayValue}
                                </option>
                            ))}
                        </select>
                    );
                    break; */
        default:
            element = 'Undefined';
    }

    return element;

};

export default FormElement;