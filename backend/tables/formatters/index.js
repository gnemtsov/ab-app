'use strict';

//IMPORTANT! Formatters' output is placed as HTML and must be safe!

module.exports.departmentLinker = {
    component: 'Link',
    to: {
        template: ['/edit?d_id=', 0],
        cols: ['d_id']
    },
    text: {
        template: [0],
        cols: ['d_title']
    }
};

module.exports.date = { //TODO write date formatter
    component: 'Link',
    to: {
        template: ['/edit?d_id=', 0],
        cols: ['d_id']
    },
    text: {
        template: [0],
        cols: ['d_title']
    }
};

module.exports.backendTestFormatter = (col, row) => `<b>${2 + 2}</b>`;