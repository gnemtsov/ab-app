import React from 'react';

import appLogo from '../../assets/images/abapp-logo-black.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={appLogo} alt="AppLogo" />
    </div>
);

export default logo;