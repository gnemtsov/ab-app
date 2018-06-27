import React, { Component } from 'react';

import classes from './Toolbar.css';
import Button from '../../UI/Button/Button';

export default class Toolbar extends Component {

    conf = { 
        toolbarOffset: 30
    }

    state = {
        windowScrollY: 0,
        toolbarHeight: 0
    }

    constructor(props) {
        super(props);
        this.refToolbar = React.createRef();
        this.state.windowScrollY = window.scrollY;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.updateScrollY);
        this.setState({ toolbarHeight: this.refToolbar.current.offsetHeight });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.updateScrollY);
    }

    updateScrollY = () => this.setState({ windowScrollY: window.scrollY })

    render() {
        let buttons = [];

        const {
            toolbarOffset
        } = this.conf;

        const {
            windowScrollY,
            toolbarHeight
        } = this.state;

        const {
            show,
            defaultTop,
            boundaryTop,
            boundaryBottom,
            defaultSortHandler,
            csvExportHandler,
            selectAllHandler
        } = this.props;

        let toolbarTop = defaultTop;
        if (windowScrollY > boundaryTop - toolbarOffset  && windowScrollY < boundaryBottom - toolbarHeight - toolbarOffset * 2) {
            toolbarTop += windowScrollY - boundaryTop + toolbarOffset;
        }

        if (typeof defaultSortHandler === 'function') {
            buttons.push(
                <Button
                    key="defaultSort"
                    clicked={defaultSortHandler}>
                    {defaultSortHandler.icon || '\u21C5'}
                </Button>
            );
        }

        if (typeof csvExportHandler === 'function') {
            buttons.push(
                <Button
                    key="csvExport"
                    clicked={csvExportHandler}>
                    {csvExportHandler.icon || 'csv'}
                </Button>
            );
        }

        if (typeof selectAllHandler === 'function') {
            buttons.push(
                <Button
                    key="selectAll"
                    clicked={selectAllHandler}>
                    {selectAllHandler.icon || '\u273D'}
                </Button>
            );
        }

        return (
            <div
                className={classes.Container}>
                <div
                    ref={this.refToolbar}
                    className={classes.Toolbar + (show ? ' ' + classes.Show : '')}
                    style={{ top: toolbarTop + 'px' }}>
                    {buttons}
                </div>
            </div>
        );
    }
}
