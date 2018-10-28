import React from 'react';

import configureStore from 'redux-mock-store';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Departments from './Departments';

configure({ adapter: new Adapter() });

describe('Departments', () => {
	it('Renders correctly when error', () => {
		const mockStore = configureStore();
		const store = mockStore({
			departments: {
				error: "error"
			},
			auth: {
				isAuthenticated: true
			}
		}); 
		
		const wrapper = render(
			<Departments store={store} />
		);
		expect(wrapper).toMatchSnapshot();
	});

	it('Renders correctly when no error', () => {
		const mockStore = configureStore();
		const store = mockStore({
			departments: {
				error: false,
				departments: {
					rows: [],
					cols: []
				},
				filter: null
			},
			auth: {
				isAuthenticated: true
			}
		}); 
		
		const wrapper = render(
			<Departments store={store} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});

