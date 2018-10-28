import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Icon from './Icon';

configure({ adapter: new Adapter() });

describe('Icon', () => {
	it('Renders correctly', () => {
		const wrapper = shallow(<Icon name="test" />);
		expect(wrapper).toMatchSnapshot();
	});
})