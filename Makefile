install:
	npm install

test:
	next-build-tools verify
	mocha tests
