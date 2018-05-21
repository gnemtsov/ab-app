import React from 'react';

import classes from './FormElement.css';

import Icon from '../../Icon/Icon';
import ReactTooltip from 'react-tooltip';

const FormElement = (props) => {
    let formRow = [];

    //------->label
    formRow.push(
        <label
            key={props.id + '_label'}
            className={classes.Label}
            htmlFor={props.id}>
            {props.label + (props.required ? '*' : '')}
        </label>
    );

    //------->input
    let inputClasses = [];
    if (props.message.length) {
        inputClasses.push(classes.Invalid);
    }
    let inputField = [];
    switch (props.type) {

        case 'String':

            if (props.allowedValues !== undefined && props.allowedValues.length) {
                if (props.allowedValues.length === 2) { //radio buttons
                    let radios = props.allowedValues.map(
                        (value, index) =>
                            <label
                                key={props.id + '_radio' + index}
                                className={classes.InputRadioContainer}>
                                <input
                                    type="radio"
                                    className={classes.InputRadio}
                                    id={props.id + index}
                                    value={value}
                                    checked={value === props.value}
                                    onChange={props.changed} />
                                {value}
                            </label>
                    );
                    inputField = inputField.concat(radios);
                } else { //select
                    inputClasses.push(classes.Select);
                    inputField.push(
                        <select
                            key={props.id + '_select'}
                            className={inputClasses.join(' ')}
                            id={props.id}
                            required={props.required ? true : false}
                            value={props.value}
                            onChange={props.changed}>
                            {props.allowedValues.map((value, i) => <option key={i}>{value}</option>)}
                        </select>
                    );
                }
            } else { //input type="text"
                inputClasses.push(classes.InputText);
                inputField.push(
                    <input
                        key={props.id + '_input'}
                        type={props.noEcho ? "password" : "text"}
                        className={inputClasses.join(' ')}
                        id={props.id}
                        placeholder={props.placeholder}
                        value={props.value}
                        required={props.required ? true : false}
                        onChange={props.changed} />
                );
            }
            break;

        case 'Boolean': //checkbox
            inputField.push(
                <input
                    key={props.id + '_check'}
                    type="checkbox"
                    className={classes.InputCheck}
                    id={props.id}
                    checked={Boolean(props.value)}
                    onChange={props.changed} />
            );
            break;

        case 'Number': //input type="text"
            inputClasses.push(classes.InputText);
            inputField.push(
                <input
                    key={props.id + '_input'}
                    type={"text"}
                    className={inputClasses.join(' ')}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    required={props.required ? true : false}
                    onChange={props.changed} />
            );
            break;

        case 'Text': //textarea
            inputClasses.push(classes.Textarea);
            inputField.push(
                <textarea
                    key={props.id + '_textarea'}
                    className={inputClasses.join(' ')}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    required={props.required ? true : false}
                    onChange={props.changed} />
            );
            break;

        default:
            inputField.push(
                <span
                    key={props.id + '_unrecognized'}
                    className={classes.Unrecognized}>
                    Unrecognized field type
                </span>
            );
    }

    inputField.push(  //validators' messages container
        <div
            key={props.id + '_validatorMessage'}
            className={classes.Message}>
            {props.message}
        </div>
    );

    formRow.push(
        <div
            key={props.id + '_inputContainer'}
            className={classes.InputContainer}>
            {inputField}
        </div>
    );


    //------->info icon with description
    let infoIcon = [];
    if (props.description !== undefined && props.description.length) {
        infoIcon.push(
            <Icon
                key={props.id + '_infoIcon'}
                data-tip={props.description}
                name="info"
                width="26"
                height="26"
                stroke="#666666" />
        );

        infoIcon.push(
            <ReactTooltip
                key={props.id + '_ReactTooltip'}
                type="info"
                place="right"
                className={classes.Tooltip} />
        );
    }

    formRow.push(
        <div
            key={props.id + '_iconContainer'}
            className={classes.IconContainer}>
            {infoIcon}
        </div>
    );

    return formRow;
};

export default FormElement;