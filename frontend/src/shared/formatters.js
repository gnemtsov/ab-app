import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

export const departmentLinker = (col, row) =>
    <Link to={`/edit?d_id=${row.d_id}`}>
        {row.d_title}
    </Link>;

export const date = (col, row) => moment(row[col.name]).format('DD/MM/YYYY').toString();