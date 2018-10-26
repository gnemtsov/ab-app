import React from 'react';

import { configure, render, mount, shallow } from 'enzyme';
import createRouterContext from 'react-router-test-context';
import Adapter from 'enzyme-adapter-react-16';

import * as Formatters from './Formatters';

configure({ adapter: new Adapter() });

describe('Formatters', () => {
	it('Render departmentLinker', () => {
		const f = Formatters.departmentLinker({}, {d_id: 1, d_title: 'test title'});
		expect(f.JSX).toBeDefined();
		expect(f.toString).toBeDefined();
		expect(f.toString()).toBe('test title');
		
		const context = createRouterContext();
		const wrapper = shallow (
	        f.JSX,
			{ context }
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it('Formats date', () => {
		expect(Formatters.date({name: 'date'}, {date: '20151026T2030'})).toBe('26/10/2015');
		expect(Formatters.date({name: 'date'}, {date: '2016-10-26'})).toBe('26/10/2016');
		expect(Formatters.date({name: 'date'}, {date: '20171026'})).toBe('26/10/2017');
		expect(Formatters.date({name: 'date'}, {date: '2018-10-26T15:27:00.000Z'})).toBe('26/10/2018');
	})
});
