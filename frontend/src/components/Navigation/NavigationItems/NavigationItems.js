import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Departments</NavigationItem>
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">Authenticate</NavigationItem>
            : [<NavigationItem key="n1" link="/add">Add</NavigationItem>,<NavigationItem  key="n2" link="/logout">Logout</NavigationItem>]}
    </ul>
);

export default navigationItems;