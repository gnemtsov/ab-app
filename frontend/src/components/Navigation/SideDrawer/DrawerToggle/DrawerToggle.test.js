import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DrawerToggle from './DrawerToggle';

configure({ adapter: new Adapter() });

describe('DrawerToggle', () => {
	it('Basic render test', () => {
		const wrapper = shallow (
	        <DrawerToggle />
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Click', () => {
		const mockClicked = jest.fn(() => {});
		
		const wrapper = shallow(
			<DrawerToggle
				clicked={mockClicked} />
		);
		
		wrapper.simulate('click');
		
		expect(mockClicked.mock.calls.length).toBe(1);
	})
});
