require('babel-register')({
	// just transpile the tests
	ignore: filename => {
		/* eslint-disable no-console */
		console.log(filename);
		console.log(!(/n-logger\/test/.test(filename)));
		return !(/n-logger\/test/.test(filename));
	}
});
