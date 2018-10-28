import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter } from "react-router-dom";

import NavigationItem from './NavigationItem';

configure({ adapter: new Adapter() });

describe('NavigationItem', () => {
	it('render with exact', () => {
		const wrapper = render(
			<BrowserRouter>
				<NavigationItem link="/" exact>Departments</NavigationItem>
			</BrowserRouter>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('render without exact', () => {
		const wrapper = render(
			<BrowserRouter>
				<NavigationItem link="/">Departments</NavigationItem>
			</BrowserRouter>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
});
