import React from 'react';
import { Link } from "react-router-dom";

import classes from './Toolbar.css';
import whiteLogo from '../../../assets/images/abapp-logo-white.png';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked} />
        <Link to='/'>
            <img className={classes.Logo} src={whiteLogo} alt="AB-APP logo" />
        </Link>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} />
        </nav>
    </header>
);

export default toolbar;