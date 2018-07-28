import React from 'react';

import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from './Table';

configure({ adapter: new Adapter() });

describe('Table', () => {

    const snapshoot = (name, conf, cols, rows) => {
        const wrapper = render(
            <Table
                {...conf}
                cols={cols}
                rows={rows} />
        );
        it(name, () => {
            expect(wrapper).toMatchSnapshot();
        });
    }

    let conf = {};
    let cols = [
        { name: 'name', title: 'Pet name' },
        { name: 'class', title: 'Animal class' },
        { name: 'age', title: 'Age' },
        { name: 'gender', title: 'Gender' }
    ];
    let rows = [
        { name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
        { name: 'Molly', class: 'Cat', age: 15, gender: 'female' },
        { name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
        { name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
        { name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
        { name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
        { name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
    ];

    snapshoot('Basic render test', conf, cols, rows);

    cols = [
        { name: 'name', title: 'Pet name' },
        { name: 'class', title: 'Animal class', sortOrder: 1, sortDirection: 'ASC' },
        { name: 'age', title: 'Age', sortOrder: 2, sortDirection: 'ASC' },
        { name: 'gender', title: 'Gender' }
    ];
    snapshoot('With sorting', conf, cols, rows);

    conf = {
        rowsPerPage: 2,
        selectable: true
    };
    snapshoot('With pagination', conf, cols, rows);

    rows = [];
    snapshoot('With no data', conf, cols, rows);


});