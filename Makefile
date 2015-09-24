.PHONY: test

clean:
	git clean -fxd

install:
	npm install

verify:
	obt verify --esLintPath .eslintrc

unit-test:
	mocha --recursive test

test: verify unit-test

