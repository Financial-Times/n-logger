.PHONY: test

clean:
	git clean -fxd

install:
	@echo "Installing…"
	@npm install

build: $(shell find src -type f)
	@echo "Building…"
	@rm -rf build
	@babel -d build src

verify:
	@echo "Verifying…"
	@find ./src ./test -type f -exec lintspaces -e .editorconfig -i js-comments {} + &&\
	eslint -c ./.eslintrc.json ./src ./test

unit-test: build
	@echo "Unit Testing…"
	@mocha --require test/setup --recursive --reporter spec test

test: verify unit-test
