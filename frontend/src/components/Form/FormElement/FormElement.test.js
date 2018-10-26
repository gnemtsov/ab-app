import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FormElement from './FormElement';

configure({ adapter: new Adapter() });

describe('FormElement', () => {
	it('select', () => {
		const wrapper = render(
			<FormElement
				type='String'
				value='Test'
				id='test'
				value='1'
				allowedValues={['1', '2', '3']}
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('select change', () => {
		let flag = false;
		const wrapper = mount(
			<FormElement
				type='String'
				value='Test'
				id='test'
				value='1'
				allowedValues={['1', '2', '3']}
				message=''
				inputChanged={() => {flag = true;}}
			/>
		);
		wrapper.find('select').simulate('change');
		expect(flag).toEqual(true);
	});
	
	it('radio', () => {
		const wrapper = render(
			<FormElement
				type='String'
				value='Test'
				id='test'
				value='1'
				allowedValues={['1', '2']}
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('text', () => {
		const wrapper = render(
			<FormElement
				type='String'
				value='Test'
				id='test'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
	
	it('password', () => {
		const wrapper = render(
			<FormElement
				type='String'
				value='Test'
				noEcho
				id='test'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
	
	it('checkbox', () => {
		const wrapper = render(
			<FormElement
				type='Boolean'
				id='test'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
	
	it('number', () => {
		const wrapper = render(
			<FormElement
				type='Number'
				id='test'
				value={5}
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
	
	it('date', () => {
		const wrapper = render(
			<FormElement
				type='Date'
				id='test'
				value='2005-05-05'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
	
	it('hidden', () => {
		const wrapper = render(
			<FormElement
				type='Hidden'
				id='test'
				value='hidden'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});	
	
	it('unrecognized', () => {
		const wrapper = render(
			<FormElement
				type='ABCD'
				id='test'
				message=''
				inputChanged={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();		
	});
});
