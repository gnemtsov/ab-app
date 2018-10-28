import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Spinner from './Spinner';

configure({ adapter: new Adapter() });

describe('Spinner', () => {
	it('Renders correctly', () => {
		const wrapper = shallow(<Spinner />);
		expect(wrapper).toMatchSnapshot();
	});
})