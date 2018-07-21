import React from 'react';

import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from './Table';

configure({ adapter: new Adapter() });

describe('Table', () => {

    const conf = {
        selectable: true
    }

    const cols = [
        { name: 'name', title: 'Pet name' },
        { name: 'class', title: 'Animal class' },
        { name: 'age', title: 'Age' },
        { name: 'gender', title: 'Gender' }
    ]

    const rows = [
        { name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
        { name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
        { name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
        { name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
        { name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
        { name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
        { name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
    ]

    const snapshoot = () => {
        it(`Basic render test`, () => {
            const wrapper = render(
                <Table
                    {...conf}
                    cols={cols}
                    rows={rows}
                />
            );
            expect(wrapper).toMatchSnapshot();
        });
    }

    snapshoot();
});
