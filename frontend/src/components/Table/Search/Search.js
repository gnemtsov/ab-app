import React, { Component } from 'react';
import memoize from 'memoize-one';

import FormElement from '../../Form/FormElement/FormElement';

import classes from './Search.css';

// TODO: search by multiple options
class Search extends Component {
	state = {
		search: "",
		selected: null, // {title, name}
		options: {} // {title0: name0, title1: name1, ...}
	}
	
	constructor(props) {
		super(props);
		
		// Build new options from columns
		const options = {};
		props.cols.forEach( col => options[col.title] = col.name);
		
		const key = Object.keys(options)[0];
		const selected = {
			title: key,
			name: options[key]
		};
		
		this.state = {
			...this.state,
			options,
			selected
		};
	}
	
	buildFilter = memoize(
		(search, option) => {
			if (search === "" || !option) {
				return null;
			}
			
			const filter = {};
			filter[option.name] = search;
			
			return filter;
		}
	);
	
	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			this.props.onSetFilter(this.buildFilter(this.state.search, this.state.selected));
		}
	}
	
	render() {
		return (
			<div className={classes.Search}>
				<FormElement
					id={this.props.id + '_search'}
					key={this.props.id + '_search'}
					inputChanged={data => this.setState({search: data.target.value})}
					message={''}
					placeholder={'search'}
					label={'search'}
					type={'String'}
					labelStyle={{
						gridArea: 'input-label',
						leftText: true
					}}
					bodyStyle={{
						gridArea: 'input'
					}} />
				<FormElement
					id={this.props.id + '_select'}
					key={this.props.id + '_select'}
					inputChanged={data => {
						this.setState({selected: {title: data.target.value, name: this.state.options[data.target.value]}})
					}}
					message={''}
					label={'search by'}
					allowedValues={Object.keys(this.state.options)}
					type={'String'}
					labelStyle={{
						gridArea: 'option-label',
						leftText: true
					}}
					bodyStyle={{
						gridArea: 'option'
					}} />
			</div>
		);
	}
}

export default Search;
