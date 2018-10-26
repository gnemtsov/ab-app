import React from 'react';

import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Form from './Form';

configure({ adapter: new Adapter() });

describe('Form', () => {
	it('render', () => {
		const fields = [
			{
				"name":"d_id",
				"type":"Hidden",
				"table":"departments",
				"allowedValues":null,
				"required":false,
				"validators":[
					{
						"name":"numType",
						"message":"Value must a number",
						"f":"value => /^-?[0-9]*$/.test(value)"
					},
					{
						"name":"numMin",
						"message":"Value must be greater than %0%",
						"params":[-2147483648],
						"f":"(value, min) => value >= min"
					},
					{
						"name":"numMax",
						"message":"Value must be smaller than %0%",
						"params":[2147483647],
						"f":"(value, max) => value <= max"
					}
				]
			},
			{
				"name":"d_title",
				"label":"Title",
				"value":"Test title",
				"type":"String",
				"placeholder":"Department title",
				"validators": [
					{
						"name":"strMax",
						"message":"String must be shorter or equal to %0% characters",
						"params":[128],
						"f":"(value, max) => value.length <= max"
					},
					{
						"name":"strMinMax",
						"message":"Title must be bigger than %0% and smaller than %1% chars",
						"params":[6,64],
						"f":"(value, min, max) => value.length >= min && value.length <= max"
					}
				],
				"table":"departments",
				"required":true,
				"allowedValues":null
			},
			{
				"name":"d_head",
				"label":"Head",
				"type":"String",
				"value":"Test head",
				"placeholder":"Department head's name",
				"validators":[
					{
						"name":"strMax",
						"message":"String must be shorter or equal to %0% characters",
						"params":[128],
						"f":"(value, max) => value.length <= max"
					},
					{
						"name":"strMinMax",
						"message":"Head must be bigger than %0% and smaller than %1% chars",
						"params":[3,32],
						"f":"(value, min, max) => value.length >= min && value.length <= max"
					}
				],
				"table":"departments",
				"required":true,
				"allowedValues":null
			},
			{
				"name":"d_size",
				"label":"Size",
				"value":"13",
				"placeholder":"Department size",
				"validators":[
					{
						"name":"numType",
						"message":"Value must a number",
						"f":"value => /^-?[0-9]*$/.test(value)"
					},
					{
						"name":"numMin",
						"message":"Value must be greater than %0%",
						"params":[0],
						"f":"(value, min) => value >= min"
					},
					{
						"name":"numMax",
						"message":"Value must be smaller than %0%",
						"params":[255],
						"f":"(value, max) => value <= max"
					},
					{
						"name":"numMin",
						"message":"There must be at least %0% computers",
						"params":[5],
						"f":"(value, min) => value >= min"
					}
				],
				"table":"departments",
				"required":true,
				"type":"Number",
				"allowedValues":null
			},
			{
				"name":"d_created",
				"label":"Created",
				"type":"Date",
				"value":"2018-05-01",
				"placeholder":"Department creation date",
				"table":"departments",
				"required":true,
				"allowedValues":null,
				"validators":[
					{
						"name":"strIsDate",
						"message":"Value must be a date",
						"f":"value => /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(value)"
					},
					{
						"name":"dateMin",
						"message":"Date must be bigger than %0%",
						"params":["1000-01-01"],
						"f":"(value, min) => new Date(value) >= new Date(min)"
					},
					{
						"name":"dateMax",
						"message":"Date must be less than %0%",
						"params":["9999-12-31"],
						"f":"(value, max) => new Date(value) <= new Date(max)"
					}
				]
			}
		];
		const wrapper = render(
			<Form
				fields={fields}
				submitHandler={() => {}}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	
	it("shouldn't submit empty form", () => {
		const fields = [
			{
				"name":"d_id",
				"type":"Hidden",
				"table":"departments",
				"allowedValues":null,
				"required":false,
				"validators":[
					{
						"name":"numType",
						"message":"Value must a number",
						"f":"value => /^-?[0-9]*$/.test(value)"
					},
					{
						"name":"numMin",
						"message":"Value must be greater than %0%",
						"params":[-2147483648],
						"f":"(value, min) => value >= min"
					},
					{
						"name":"numMax",
						"message":"Value must be smaller than %0%",
						"params":[2147483647],
						"f":"(value, max) => value <= max"
					}
				]
			},
			{
				"name":"d_title",
				"label":"Title",
				"value":"Test title",
				"type":"String",
				"placeholder":"Department title",
				"validators": [
					{
						"name":"strMax",
						"message":"String must be shorter or equal to %0% characters",
						"params":[128],
						"f":"(value, max) => value.length <= max"
					},
					{
						"name":"strMinMax",
						"message":"Title must be bigger than %0% and smaller than %1% chars",
						"params":[6,64],
						"f":"(value, min, max) => value.length >= min && value.length <= max"
					}
				],
				"table":"departments",
				"required":true,
				"allowedValues":null
			},
			{
				"name":"d_head",
				"label":"Head",
				"type":"String",
				"value":"Test head",
				"placeholder":"Department head's name",
				"validators":[
					{
						"name":"strMax",
						"message":"String must be shorter or equal to %0% characters",
						"params":[128],
						"f":"(value, max) => value.length <= max"
					},
					{
						"name":"strMinMax",
						"message":"Head must be bigger than %0% and smaller than %1% chars",
						"params":[3,32],
						"f":"(value, min, max) => value.length >= min && value.length <= max"
					}
				],
				"table":"departments",
				"required":true,
				"allowedValues":null
			},
			{
				"name":"d_size",
				"label":"Size",
				"value":"13",
				"placeholder":"Department size",
				"validators":[
					{
						"name":"numType",
						"message":"Value must a number",
						"f":"value => /^-?[0-9]*$/.test(value)"
					},
					{
						"name":"numMin",
						"message":"Value must be greater than %0%",
						"params":[0],
						"f":"(value, min) => value >= min"
					},
					{
						"name":"numMax",
						"message":"Value must be smaller than %0%",
						"params":[255],
						"f":"(value, max) => value <= max"
					},
					{
						"name":"numMin",
						"message":"There must be at least %0% computers",
						"params":[5],
						"f":"(value, min) => value >= min"
					}
				],
				"table":"departments",
				"required":true,
				"type":"Number",
				"allowedValues":null
			},
			{
				"name":"d_created",
				"label":"Created",
				"type":"Date",
				"value":"2018-05-01",
				"placeholder":"Department creation date",
				"table":"departments",
				"required":true,
				"allowedValues":null,
				"validators":[
					{
						"name":"strIsDate",
						"message":"Value must be a date",
						"f":"value => /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(value)"
					},
					{
						"name":"dateMin",
						"message":"Date must be bigger than %0%",
						"params":["1000-01-01"],
						"f":"(value, min) => new Date(value) >= new Date(min)"
					},
					{
						"name":"dateMax",
						"message":"Date must be less than %0%",
						"params":["9999-12-31"],
						"f":"(value, max) => new Date(value) <= new Date(max)"
					}
				]
			}
		];
		const wrapper = mount(
			<Form
				fields={fields}
				buttonText={["Add", "Adding"]}
				submitHandler={() => {flag=false}}
			/>
		);
		
		expect(wrapper.instance().isFormReady()).toEqual(true);
		
		wrapper.find('input#d_title').simulate('change', {target: {value: ''} });
		
		expect(wrapper.instance().isFormReady()).toEqual(false);
	});
});
