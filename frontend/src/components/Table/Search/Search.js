import React, { Component } from 'react';

import FormElement from '../../Form/FormElement/FormElement';

import classes from './Search.css';

export default class Search extends Component {
	buildFilter(search) {
		return {
			d_title: search
		};
	}
	
	static useFilter(filter, row) {
		if (!filter) {
			return true;
		}
		
		for (const key in filter) {
			if (!filter.hasOwnProperty(key)) {
				continue;
			}
			
			if (!row[key] || row[key].indexOf(filter[key]) < 0) {
				return false;
			}
		}
		return true;
	}
	
	render() {
		return (
			<div className={classes.Search}>
				<FormElement
					key={this.props.id + '_search'}
					inputChanged={data => this.props.setFilter(this.buildFilter(data.target.value))}
					message={''}
					placeholder={'search'}
					label={'search'}
					type={'String'} />
			</div>
		);
	}
}
