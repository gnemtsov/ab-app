import React from 'react';
import Form from '../../components/UI/Form/Form';

import classes from './Edit.css';

export default (props) => {
    return (
        <div
            className={classes.FormContainer}>
            <Form
                title="Edit department"
                buttonText={['Save', 'Saving..']}
                submitted={() => true}
                api={"/departments/edit" + props.location.search} />
        </div>
    );
};