import React from 'react';

import classes from './Paginator.css';
import Buttona from '../../UI/Button/Button';

const Paginator = (props) => {
    const { tp, cp, pageClickHandler } = props;
    let paginator = null;

    if (tp !== undefined && tp > 0) {
        let buttons = [];
        buttons.push(
            <Buttona
                key={`pback`}
                disabled={cp === 1}
                clicked={(cp === 1 ? null : event => pageClickHandler(event, 'back'))}>
                &larr;
                </Buttona>
        );

        const isDots = (i, tp, cp) =>
            i > 1 &&
            i < tp &&
            (i > cp + 1 || i < cp - 1) &&
            (cp > 4 || i > 5) &&
            (cp < tp - 3 || i < tp - 4);
        let flag;
        for (let i = 1; i <= tp; i++) {
            const dots = isDots(i, tp, cp) && (isDots(i - 1, tp, cp) || isDots(i + 1, tp, cp));
            if (flag && dots) {
                flag = false;
                buttons.push(
                    <Buttona
                        key={`p${i}`}
                        className={classes.Dots}
                        disabled={true}>
                        ...
                </Buttona>
                );
            } else if (!dots) {
                flag = true;
                buttons.push(
                    <Buttona
                        key={`p${i}`}
                        disabled={i === cp}
                        clicked={(i === cp ? null : event => pageClickHandler(event, i))}>
                        {i}
                    </Buttona>
                );

            }
        }

        buttons.push(
            <Buttona
                key={`pforward`}
                disabled={cp === tp}
                clicked={(cp === tp ? null : event => pageClickHandler(event, 'forward'))}>
                &rarr;
                </Buttona>
        );
        paginator =
            <div className={classes.Paginator}>
                {buttons}
            </div>
    }

    return paginator;
}

export default Paginator;