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

release:
ifeq ($(version),)
	@echo "Supply a release version, e.g. make release version=patch"
	exit 1
endif
	release-it $(version) -p -n

