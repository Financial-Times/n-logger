include n.Makefile

build: $(shell find src -type f)
	@echo "Building…"
	@rm -rf build
	@babel -d build src

unit-test: build
	@echo "Unit Testing…"
	@mocha --require test/setup --recursive --reporter spec test

test: verify unit-test
