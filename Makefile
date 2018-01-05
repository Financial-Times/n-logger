node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

build: $(shell find src -type f)
	@echo "Building…"
	@rm -rf dist
	@babel -d dist src

unit-test: build
	@echo "Unit Testing…"
	@mocha --require test/setup --recursive --exit --reporter spec test

test: verify unit-test
