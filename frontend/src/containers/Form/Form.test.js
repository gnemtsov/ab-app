import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Form from './Form';

configure({ adapter: new Adapter() });

describe('Form', () => {
	it('Renders correctly before loading', () => {
		const conf = {
			buttonText: ['Add', 'Adding..'],
			doneText: 'Department was added!'
		};
        const wrapper = shallow (
            <Form
                conf={conf}
                title="New department"
                api="/departments/add" />
        );
		expect(wrapper).toMatchSnapshot();
	});
	it('Renders correctly after loading', () => {
		const conf = {
			buttonText: ['Add', 'Adding..'],
			doneText: 'Department was added!'
		};
        const wrapper = shallow (
            <Form
                conf={conf}
                title="New department"
                api="/departments/add" />
        );
		return Promise.resolve(wrapper)
			.then(
				() => {
					wrapper.update();
					expect(wrapper).toMatchSnapshot();
				}
			);
	});
});

