import React from 'react';

import appLogo from '../../assets/images/aberp-logo-black.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={appLogo} alt="AppLogo" />
    </div>
);

export default logo;