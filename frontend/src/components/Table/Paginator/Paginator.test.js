import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

import Paginator from './Paginator';

describe('<Paginator />', () => {
    it(`0 (0 total)`, () => {
        const wrapper = shallow(<Paginator tp={0} cp={0} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it(`5 (10 total)`, () => {
        const wrapper = shallow(<Paginator tp={10} cp={5} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });



});
