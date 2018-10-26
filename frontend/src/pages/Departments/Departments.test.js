import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Departments from './Departments';

configure({ adapter: new Adapter() });

describe('Departments', () => {
    it('TODO', () => {
        expect(true).toBe(true);
    });

    /*const snapshoot = (name, departments, onSetFilter, error) => {
        const wrapper = render(
            <Departments
                departments={departments}
                onSetFilter={onSetFilter}
                error={error} />
        );
        it(name, () => {
            expect(wrapper).toMatchSnapshot();
        });
    }
    
    let departments = {
		departments: {
			cols: [
				{ name: 'name', title: 'Pet name' },
				{ name: 'class', title: 'Animal class' },
				{ name: 'age', title: 'Age' },
				{ name: 'gender', title: 'Gender' }
			],
			rows: [
				{ name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
				{ name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
				{ name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
				{ name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
				{ name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
				{ name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
				{ name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
			]
		},
		filter: null
	};
	let onSetFilter = () => {};
	let error = undefined;
	
	snapshoot('With data and no error', departments, onSetFilter, error);
	
	error = true;
	snapshoot('With data and error', departments, onSetFilter, error);
	
	error = false;
	departments.departments = null;
	snapshoot('With no data and no error', departments, onSetFilter, error);
	
	error = true;
	snapshoot('With no data and error', departments, onSetFilter, error);*/
});

