import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Toolbar from './Toolbar';

configure({ adapter: new Adapter() });

describe('Toolbar', () => {
	it('Render not authenticated', () => {
		const wrapper = shallow (
	        <Toolbar 
				isAuth={false}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Render authenticated', () => {
		const wrapper = shallow (
	        <Toolbar 
				isAuth={true}
				/>
		);
		
		expect(wrapper).toMatchSnapshot();
	});
});
