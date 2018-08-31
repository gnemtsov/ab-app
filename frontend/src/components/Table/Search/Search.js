import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormElement from '../../Form/FormElement/FormElement';
import * as actionTypes from '../../../store/actionTypes';

import classes from './Search.css';

class Search extends Component {
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
					inputChanged={data => this.props.onSetFilter(this.buildFilter(data.target.value))}
					message={''}
					placeholder={'search'}
					label={'search'}
					type={'String'} />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
    return {
        onSetFilter: (filter) => dispatch({
			type: actionTypes.R_SET_DEPARTMENTS_FILTER,
			filter: filter
		})
    }
}

export default connect(null, mapDispatchToProps)(Search);
