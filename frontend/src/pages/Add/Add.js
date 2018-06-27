import React from 'react';
import Form from '../../containers/Form/Form';

import classes from './Add.css';

export default () => {
    const conf = {
        buttonText: ['Add', 'Adding..'],
        doneText: 'Department was added!'
    }
    return (
        <div
            className={classes.FormContainer}>
            <Form
                conf={conf}
                title="New department"
                submitted={true}
                api="/departments/add" />
        </div>
    );
};