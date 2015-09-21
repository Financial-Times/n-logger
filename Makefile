.PHONY: test

clean:
	git clean -fxd

install:
	npm install

verify:
	obt verify

unit-test:
	mocha

test: verify unit-test

