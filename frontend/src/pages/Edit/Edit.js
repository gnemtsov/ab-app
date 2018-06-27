import React from 'react';
import Form from '../../containers/Form/Form';

import classes from './Edit.css';

export default (props) => {
    const conf = {
        buttonText: ['Save', 'Saving..']
    }

    return (
        <div
            className={classes.FormContainer}>
            <Form
                conf={conf}
                title="Edit department"
                api={"/departments/edit" + props.location.search} />
        </div>
    );
};