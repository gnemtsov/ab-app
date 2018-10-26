import React from 'react';
import feather from './feather-sprite.svg';

const Icon = (props) => {
    let defaults = {
        width: 24,
        height: 24,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }

    const params = {
        ...defaults,
        ...props
    }

    return (
        <svg {...params}>
            <use xlinkHref={feather + '#' + props.name} />
        </svg>
    );
}

export default Icon;