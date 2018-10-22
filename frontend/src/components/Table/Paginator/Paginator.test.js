import React from 'react';

import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Paginator from './Paginator';

configure({ adapter: new Adapter() });

describe('Paginator', () => {
    const snapshoot = (tp, cp) => {
        const wrapper = render(<Paginator tp={tp} cp={cp} />);
        it(`Total = ${tp}, Current = ${cp}`, () => {
            expect(wrapper).toMatchSnapshot();
        });
    }

    snapshoot(0, 0);
    snapshoot(1, -1);
    snapshoot(1, 1);
    snapshoot(2, 2);
    snapshoot(3, 1);

    for (let cp = 1; cp <= 10; cp++) {
        snapshoot(10, cp);
    }
});
