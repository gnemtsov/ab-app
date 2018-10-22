import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from './Form';

configure({ adapter: new Adapter() });

describe('Form', () => {
    const snapshoot = (name, conf, title, submitted, api) => {
        const wrapper = render(
            <Table
                conf={conf}
                title={title}
                api={api} />
        );
        it(name, () => {
            expect(wrapper).toMatchSnapshot();
        });
    }

    let conf = {
        buttonText: ['Add', 'Adding..'],
        doneText: 'Department was added!'
    };
    let title = "New department";
    let submitted = true;
    let api = "/departments/add";
    snapshoot('Basic render test', conf, title, submitted, api); 
});

