.PHONY: test

clean:
	git clean -fxd

install:
	npm install


build:
	rm -rf dist/
	mkdir dist
	babel src --out-dir dist


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
	nbt bottle $(version)

