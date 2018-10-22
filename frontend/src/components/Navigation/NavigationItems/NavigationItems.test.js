import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter } from "react-router-dom";

import NavigationItems from './NavigationItems';

configure({ adapter: new Adapter() });

describe('NavigationItems', () => {
	it('render with authentication', () => {
		const wrapper = render(
			<BrowserRouter>
				<NavigationItems link="/" isAuthenticated>Departments</NavigationItems>
			</BrowserRouter>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('render without authentication', () => {
		const wrapper = render(
			<BrowserRouter>
				<NavigationItems link="/">Departments</NavigationItems>
			</BrowserRouter>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
});
