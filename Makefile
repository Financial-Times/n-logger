install:
	npm install

test:
	jshint main.js --config .jshintrc
	mocha tests
