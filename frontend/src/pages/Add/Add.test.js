import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Add from './Add';

configure({ adapter: new Adapter() });

describe('Add', () => {
	it('Renders correctly', () => {
		const wrapper = shallow(<Add />);
		expect(wrapper).toMatchSnapshot();
	});
})
