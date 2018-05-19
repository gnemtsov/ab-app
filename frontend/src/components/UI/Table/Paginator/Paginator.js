import React from 'react';

import classes from './Paginator.css';
import Button from '../../Form/Button/Button';

const Paginator = (props) => {
    let paginator = [];

    const tp = props.totalPages;
    const cp = props.currentPage;

    paginator.push(
        <Button
            key={`pback`}
            disabled={cp === 1}
            clicked={(cp === 1 ? null : event => props.pageClickHandler(event, 'back'))}>
            &larr;
                </Button>
    );

    let flag;
    for (let i = 1; i <= tp; i++) {
        const dots = i > 1 && i < tp && (i > cp + 1 || i < cp - 1) && (cp > 4 || i > 5) && (cp < tp - 3 || i < tp - 4);
        if (flag && dots) {
            flag = false;
            paginator.push(
                <button
                    key={`p${i}`}
                    disabled={true}>
                    ...
                </button>
            );
        } else if (!dots) {
            flag = true;
            paginator.push(
                <Button
                    key={`p${i}`}
                    disabled={i === cp}
                    clicked={(i === cp ? null : event => props.pageClickHandler(event, i))}>
                    {i}
                </Button>
            );

        }
    }

    paginator.push(
        <Button
            key={`pforward`}
            disabled={cp === tp}
            clicked={(cp === tp ? null : event => props.pageClickHandler(event, 'forward'))}>
            &rarr;
                </Button>
    );

    return (
        <div className={classes.Paginator}>
            {paginator}
        </div>
    );
}

export default Paginator;