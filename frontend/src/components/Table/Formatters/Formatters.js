import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Formatter returns either:
// 1) string
// 2) object with JSX field and toString method

export const departmentLinker = (col, row) => {
		const jsx = <Link to={`/edit?d_id=${row.d_id}`}>
			{row.d_title}
		</Link>;
		return {
			JSX: jsx,
			toString: () => row.d_title.toString()
		}
	}

export const date = (col, row) => moment(row[col.name]).format('DD/MM/YYYY').toString();
