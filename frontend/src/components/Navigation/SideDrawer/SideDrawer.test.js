import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SideDrawer from './SideDrawer';

configure({ adapter: new Adapter() });

describe('SideDrawer', () => {
	it('Render closed, not authenticated', () => {
		const wrapper = shallow (
	        <SideDrawer 
				open={false}
				isAuth={false}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Render closed, authenticated', () => {
		const wrapper = shallow (
	        <SideDrawer 
				open={false}
				isAuth={true}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Render opened, not authenticated', () => {
		const wrapper = shallow (
	        <SideDrawer 
				open={true}
				isAuth={false}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Render opened, authenticated', () => {
		const wrapper = shallow (
	        <SideDrawer 
				open={true}
				isAuth={true}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
});
