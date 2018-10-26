import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Modal from './Modal';

configure({ adapter: new Adapter() });

describe('Modal', () => {
	it('Renders correctly when hidden', () => {
		const wrapper = shallow(<Modal/>);
		expect(wrapper).toMatchSnapshot();
	});
	it('Renders correctly when shown', () => {
		const wrapper = shallow(<Modal show />);
		expect(wrapper).toMatchSnapshot();
	});
	it('Renders correctly with children', () => {
		const wrapper = shallow(<Modal show>test</Modal>);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('modalClosed', () => {
		const mockModalClosed = jest.fn(() => {});
		const wrapper = mount(<Modal show modalClosed={mockModalClosed}>test</Modal>);
		wrapper.find('backdrop').simulate('click');
		expect(mockModalClosed.mock.calls.length).toBe(1);
	});
})