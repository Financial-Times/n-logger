include n.Makefile

build: $(shell find src -type f)
	@echo "Building…"
	@rm -rf dist
	@babel -d dist src

unit-test: build
	@echo "Unit Testing…"
	@mocha --require test/setup --recursive --reporter spec test

test: verify unit-test
