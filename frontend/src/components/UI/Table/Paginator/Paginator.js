import React from 'react';

import classes from './Paginator.css';

const Paginator = (props) => {
    let paginator = [];

    const tp = props.totalPages;
    const cp = props.currentPage;

    paginator.push(
        <button
            key={`pback`}
            className={(cp === 1 ? classes.Disabled : '')}
            onClick={(cp === 1 ? null : event => props.pageClickHandler(event, 'back'))}>
            &larr;
                </button>
    );

    let flag;
    for (let i = 1; i <= tp; i++) {
        const dots = i > 1 && i < tp && (i > cp + 1 || i < cp - 1) && (cp > 4 || i > 5) && (cp < tp - 3 || i < tp - 4);
        if (flag && dots) {
            flag = false;
            paginator.push(
                <button
                    key={`p${i}`}
                    className={classes.Disabled}>
                    ...
                </button>
            );
        } else if (!dots) {
            flag = true;
            paginator.push(
                <button
                    key={`p${i}`}
                    className={(i === cp ? classes.Active + ' ' + classes.Disabled : '')}
                    onClick={(i === cp ? null : event => props.pageClickHandler(event, i))}>
                    {i}
                </button>
            );

        }
    }

    paginator.push(
        <button
            key={`pforward`}
            className={(cp === tp ? classes.Disabled : '')}
            onClick={(cp === tp ? null : event => props.pageClickHandler(event, 'forward'))}>
            &rarr;
                </button>
    );

    return (
        <div>
            {paginator}
        </div>
    );
}

export default Paginator;