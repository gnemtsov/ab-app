import React from 'react';

import configureStore from 'redux-mock-store';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Logout from './Logout';

configure({ adapter: new Adapter() });

describe('Logout', () => {
	it('Renders correctly', () => {
		const mockStore = configureStore();
		const store = mockStore({}); 
		
		const wrapper = shallow(<Logout store={store}/>);
		expect(wrapper).toMatchSnapshot();
	});
	
	/*it('Dispatches logout', () => {
		const mockStore = configureStore();
		const store = mockStore({}); 
		
		const wrapper = shallow(<Logout store={store}/>);
		return Promise.resolve(wrapper)
			.then(
				() => {
					wrapper.update();
					console.log(store.getActions());
				}
			);	
	});*/
})
