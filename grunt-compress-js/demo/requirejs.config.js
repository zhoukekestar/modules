require.config({
	paths: {
		a: "a",
		bb: "b"
	},
	shim: {
		a: {
			deps: ["bb"]
		}
	}
});