import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Paginator from './Paginator';

configure({ adapter: new Adapter() });

describe('Paginator', () => {
	for (let tp=0; tp <= 10; tp++) {
		for (let cp=-1; cp <= tp; cp++) {
			it(`Renders correctly, Total = ${tp}, Current = ${cp}`, () => {
				const wrapper = shallow(<Paginator tp={tp} cp={cp} />);
				expect(wrapper).toMatchSnapshot();
			});
		}
	}
})