import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Toolbar from './Toolbar';

configure({ adapter: new Adapter() });

describe('Toolbar', () => {
	it(`Renders correctly`, () => {
		const wrapper = mount(<Toolbar />);
		expect(wrapper).toMatchSnapshot();
	});
})