import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from './Table';

configure({ adapter: new Adapter() });

describe('Table', () => {
	it('Basic render test', () => {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class' },
			{ name: 'age', title: 'Age' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = render (
	        <Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('With sorting', () => {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = render (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('With pagination', () => {
	    const conf = {
			rowsPerPage: 2,
			selectable: true
		};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = render (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('With no data', () => {
	    const conf = {
			rowsPerPage: 2,
			selectable: true
		};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [];
		const filter = null;
		
		const wrapper = render (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('multiSort', () => {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class' },
			{ name: 'age', title: 'Age', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' }
		];
		const filter = null;
		const result = [
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' }
		];
		const sortParams = [{ name: 'age', dir: 'ASC' }];
		
		const wrapper = mount(
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper.instance().multiSort(rows, sortParams)).toEqual(result);
	});
	
	it('filterRows', () => {
		const conf={};
		const filter = {d_id: '1'};
		const cols = [
			{name: 'd_id', title: 'ID'},
			{name: 'd_title', title: 'Title'},
		];
		const rows = [
			{d_id: 1, d_title: 'a'},
			{d_id: 2, d_title: 'b'},
			{d_id: 10, d_title: 'c'}
		];
		const result = [
			{d_id: 1, d_title: 'a'},
			{d_id: 10, d_title: 'c'}			
		];
		
		const wrapper = mount(
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		
		expect(wrapper.instance().filterRows(rows, cols, filter)).toEqual(result);
	});
	
	it('Change sorting', () => {
	    const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);
		expect(wrapper.find('tbody tr')).toHaveLength(7);
		
		const thPetName = wrapper.find('thead th').at(0);
		thPetName.simulate('mousedown'); // sort ASC
		
		const tNames = wrapper.find('tbody tr td:first-child');
		let ascNames = ['Bonnie', 'Buddy', 'Coco', 'Jack', 'Max', 'Molly', 'Oscar'];
		for (let i = 0; i<ascNames.length; i++)
			expect(tNames.at(i).text()).toEqual(ascNames[i]);
			
		thPetName.simulate('mousedown'); // sort DESC
		let descNames = ascNames.reverse();
		for (let i = 0; i<descNames.length; i++)
			expect(tNames.at(i).text()).toEqual(descNames[i]);		
	});
	
	it('Selection: Single mouse click', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(4).simulate('mousedown', {});
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i == 4);
		}
	});

	it('Selection: Multiple mouse clicks', () => {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(4).simulate('mousedown', {});
		wRows.at(2).simulate('mousedown', {});
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i == 2);
		}
	});

	it('Selection: Multiple mouse+ctrl click', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(4).simulate('mousedown', {ctrlKey: true});
		wRows.at(2).simulate('mousedown', {ctrlKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i == 4 || i == 2);
		}
	});

	it('Selection: shift from lower to higher', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(4).simulate('mousedown', {shiftKey: true});
		wRows.at(2).simulate('mousedown', {shiftKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i >= 2 && i <= 4);
		}
	});

	it('Selection: shift from higher to lower', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(2).simulate('mousedown', {shiftKey: true});
		wRows.at(4).simulate('mousedown', {shiftKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i >= 2 && i <= 4);
		}
	});

	it('Selection: multiple shifts 1 -> 3 -> 5 ', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(1).simulate('mousedown', {shiftKey: true});
		wRows.at(3).simulate('mousedown', {shiftKey: true});
		wRows.at(5).simulate('mousedown', {shiftKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i >= 1 && i <= 5);
		}
	});

	it('Selection: multiple shifts 1 -> 5 -> 3', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(1).simulate('mousedown', {shiftKey: true});
		wRows.at(5).simulate('mousedown', {shiftKey: true});
		wRows.at(3).simulate('mousedown', {shiftKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i >= 1 && i <= 2);
		}
	});

	it('Selection: shift 1-5, ctrl 3', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(1).simulate('mousedown', {shiftKey: true});
		wRows.at(5).simulate('mousedown', {shiftKey: true});
		wRows.at(3).simulate('mousedown', {ctrlKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i >= 1 && i <= 5 && i !== 3);
		}
	});

	it('Selection: shift 1-6, ctrl 3, shift 5', () =>  {
		const conf = {};
		const cols = [
			{ name: 'name', title: 'Pet name' },
			{ name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
			{ name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
			{ name: 'gender', title: 'Gender' }
		];
		const rows = [
			{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
			{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
			{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
			{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
			{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
			{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
			{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
		];
		const filter = null;
		
		const wrapper = mount (
			<Table
				{...conf}
				cols={cols}
				rows={rows}
				filter={filter} />
		);

		let wRows = wrapper.find('tbody tr');
		wRows.at(1).simulate('mousedown', {shiftKey: true});
		wRows.at(6).simulate('mousedown', {shiftKey: true});
		wRows.at(3).simulate('mousedown', {ctrlKey: true});
		wRows.at(5).simulate('mousedown', {shiftKey: true});
		
		wRows = wrapper.find('tbody tr');	

		for(let i=0; i<wRows.length; i++) {
			expect(wRows.at(i).hasClass('Selected')).toEqual(i == 1 || i == 2 || i == 6);
		}
	});
});
