import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Search from './Search';

configure({ adapter: new Adapter() });

describe('Search', () => {
	it('Basic render test', () => {
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class' },
			{ name: 'age', title: 'Age' },
			{ name: 'gender', title: 'Gender' }
		];
		
		const wrapper = shallow (
	        <Search
				id = {"search"}
				cols={cols}
				 />
		);
		
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Options', () => {
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class' },
			{ name: 'age', title: 'Age' },
			{ name: 'gender', title: 'Gender' }
		];
		
		const wrapper = shallow (
	        <Search
				id = {"search"}
				cols={cols}
				 />
		);
		
		expect(wrapper.state('options')).toEqual({
			'Pet name': 'name',
			'Animal class': 'class',
			'Age': 'age',
			'Gender': 'gender'
		});
	});
	
	it('Change search input', () => {
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class' },
			{ name: 'age', title: 'Age' },
			{ name: 'gender', title: 'Gender' }
		];
		
		const mockOnSetFilter = jest.fn(filter => {});
		
		const wrapper = shallow (
	        <Search
				id = {'search'}
				cols={cols}
				onSetFilter={mockOnSetFilter}
				 />
		);
		const formElements = wrapper.find('FormElement');
		formElements.get(0).props.inputChanged({
			target: {
				value: '14'
			}
		});
		formElements.get(1).props.inputChanged({
			target: {
				value: 'Age'
			}
		});
		
		expect(wrapper.state('search')).toBe('14');
		expect(wrapper.state('selected')).toEqual({title: 'Age', name: 'age'});
		
		expect(mockOnSetFilter.mock.calls[1][0]).toEqual({
			'age': '14'
		});
	});
	
	it('buildFilter', () => {
		const wrapper = shallow (
	        <Search
				id = {'search'}
				cols={[]}
				 />
		);
		
		expect(wrapper.instance().buildFilter('Molly', {title: 'Pet name', name: 'name'})).toEqual({
			name: 'Molly'
		});
	})
});
