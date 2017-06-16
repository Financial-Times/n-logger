node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

unit-test:
	@echo "Unit Testing…"
	mocha --recursive --reporter spec test

unit-test-watch:
	@echo "Unit Testing (watching)…"
	mocha --recursive --reporter spec --watch test

test: verify unit-test
