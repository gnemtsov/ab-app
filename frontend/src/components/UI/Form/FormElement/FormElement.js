import React from 'react';

import classes from './FormElement.css';

import Icon from '../../Icon/Icon';
import ReactTooltip from 'react-tooltip';

const FormElement = (props) => {
    let inputClasses = [classes.Input];
    if (props.message.length) {
        inputClasses.push(classes.Invalid);
    }

    //input
    let inputField = [];
    switch (props.type) {

        case 'String':
            inputField.push(
                <input
                    key={props.id + '_input'}
                    type="text"
                    className={inputClasses.join(' ')}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    required={props.required ? true : false}
                    onChange={props.changed} />
            );
            break;

        case 'Boolean':
            inputField.push(
                <input
                    key={props.id + '_input'}
                    type="checkbox"
                    className={inputClasses.join(' ')}
                    id={props.id}
                    checked={Boolean(props.value)}
                    onChange={props.changed} />
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
            inputField.push(<span key={props.id + '_unrecognized'}>Unrecognized field type</span>);
    }

    //icon with description
    if (props.description !== undefined && props.description.length) {
        inputField.push(
            <Icon
                key={props.id + '_infoIcon'}
                data-tip={props.description}
                name="info"
                width="26"
                height="26"
                stroke="#666666" />
        );

        inputField.push(
            <ReactTooltip
                key={props.id + '_ReactTooltip'}
                type="info"
                place="right"
                className={classes.Tooltip} />
        );
    }

    //validators' messages container
    inputField.push(
        <div
            key={props.id + '_validatorMessage'}
            className={classes.Message}>
            {props.message}
        </div>
    );

    return [
        <label
            key={props.id + '_label'}
            className={classes.Label}
            htmlFor={props.id}>
            {props.label + (props.required ? '*' : '')}
        </label>,
        <div
            key={props.id + '_inputContainer'}
            className={classes.inputContainer}>
            {inputField}
        </div>
    ];
};

export default FormElement;