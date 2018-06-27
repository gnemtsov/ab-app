import React from 'react';

import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Paginator from './Paginator';

configure({ adapter: new Adapter() });


describe('<Paginator />', () => {
    it(`0 (0 total)`, () => {
        const wrapper = shallow(<Paginator tp={0} cp={0} />);
        expect(wrapper).toMatchSnapshot();
    });

    it(`5 (10 total)`, () => {
        const wrapper = render(<Paginator tp={10} cp={5} />);
        expect(wrapper).toMatchSnapshot();
    });



});
