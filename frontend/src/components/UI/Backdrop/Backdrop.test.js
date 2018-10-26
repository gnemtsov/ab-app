import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Backdrop from './Backdrop';

configure({ adapter: new Adapter() });

describe('Backdrop', () => {
	it('Renders correctly when shown', () => {
		const wrapper = shallow(<Backdrop show />);
		expect(wrapper).toMatchSnapshot();
	});
	it('Renders correctly when hidden', () => {
		const wrapper = shallow(<Backdrop />);
		expect(wrapper).toMatchSnapshot();
	});
})