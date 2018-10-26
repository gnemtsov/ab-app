import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Edit from './Edit';

configure({ adapter: new Adapter() });

describe('Edit', () => {
	it('Renders correctly', () => {
		const wrapper = shallow(<Edit location={{search: "?d_id=test"}} />);
		expect(wrapper).toMatchSnapshot();
	});
})
