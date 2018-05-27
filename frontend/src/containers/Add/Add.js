import React from 'react';
import Form from '../../components/UI/Form/Form';

import classes from './Add.css';

export default () => {
    return (
        <div
            className={classes.FormContainer}>
            <Form
                title="New department"
                api="/departments/test" />
        </div>
    );
};