import React from 'react';

import configureStore from 'redux-mock-store';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter } from "react-router-dom";

import Auth from './Auth';

configure({ adapter: new Adapter() });

describe('Auth', () => {
	it('Renders correctly when authenticated', () => {
		const mockStore = configureStore();
		const store = mockStore({
			auth: {
				isAuthenticated: true
			}
		}); 
		
		const wrapper = render(
			<BrowserRouter>
				<Auth store={store}/>
			</BrowserRouter>
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Renders correctly when not authenticated', () => {
		const mockStore = configureStore();
		const store = mockStore({
			auth: {
				isAuthenticated: false
			}
		}); 
		
		const wrapper = render(
			<BrowserRouter>
				<Auth store={store}/>
			</BrowserRouter>
		);
		expect(wrapper).toMatchSnapshot();
	});
})

