import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import FormElement from '../../Form/FormElement/FormElement';
import * as actionTypes from '../../../store/actionTypes';

import classes from './Search.css';

// TODO: search by multiple options
class Search extends Component {
	state = {
		search: "",
		selected: null, // {title, name}
		options: {} // {title0: name0, title1: name1, ...}
	}
	
	// TODO: separate (search) and (selected, options) to make memoize actually work
	static getDerivedStateFromProps = memoize(
		(props, state) => {
			// This method is needed to properly handle columns update.
			// Currently columns can't change.
			// This method may help to avoid problems in the future.
			
			// Build new options from columns
			const options = {};
			props.cols.forEach( col => options[col.title] = col.name);
			
			let selected = state.selected;
			// Previously selected column may disappear or no column could be selected
			if (!selected || !options[selected.title]) {
				// If it happens, first column will be selected
				// or none if there are no columns
				const keys = Object.keys(options);
				selected = keys.length > 0 ? {title: keys[0], name: options[keys[0]]} : null;
			}
			
			const search = state.search
			return {
				search,
				selected,
				options
			};
		}
	);
	
	buildFilter(search, option) {
		if (search === "" || !option) {
			return null;
		}
		
		const filter = {};
		filter[option.name] = search;
		
		return filter;
	}
	
	static useFilter(filter, cols, row) {
		if (!filter) {
			return true;
		}
		
		for (const key in filter) {
			if (!filter.hasOwnProperty(key)) {
				continue;
			}
			const col = cols.find(x => x.name === key);
			if (!col) {
				continue;
			}
						
			if (!row[key]) {
				return false;
			}
			const value = col.formatter ? col.formatter(col, row) : row[key];
			if (value.toString().indexOf(filter[key]) < 0) {
				return false;
			}
		}
		return true;
	}
	
	componentDidUpdate() {
		this.props.onSetFilter(
			this.buildFilter(this.state.search, this.state.selected)
		);
	}
	
	render() {
		return (
			<div className={classes.Search}>
				<FormElement
					key={this.props.id + '_search'}
					inputChanged={data => this.setState({search: data.target.value})}
					message={''}
					placeholder={'search'}
					label={'search'}
					type={'String'} />
				<FormElement
					key={this.props.id + '_select'}
					inputChanged={data => {
						this.setState({selected: {title: data.target.value, name: this.state.options[data.target.value]}})
					}}
					message={''}
					label={'search by'}
					allowedValues={Object.keys(this.state.options)}
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
