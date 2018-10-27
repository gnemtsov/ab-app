'use strict';

const fs = jest.genMockFromModule('fs');

let mockFiles = {};
fs.__setMockFiles = newMockFiles => {
	mockFiles = newMockFiles;
}

fs.existsSync = path => mockFiles[path] !== undefined;
fs.readFileSync = path => mockFiles[path];

module.exports = fs;

