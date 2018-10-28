import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from './Button';

configure({ adapter: new Adapter() });

describe('Button', () => {
	it('Renders correctly when disabled', () => {
		const wrapper = shallow(<Button disabled />);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Renders correctly when not disabled', () => {
		const wrapper = shallow(<Button />);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Renders correctly with className when disabled', () => {
		const wrapper = shallow(<Button className="test" disabled />);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Renders correctly with className when not disabled', () => {
		const wrapper = shallow(<Button className="test" />);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Renders correctly with children', () => {
		const wrapper = shallow(<Button>test</Button>);
		expect(wrapper).toMatchSnapshot();
	});
})