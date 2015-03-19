require.config({
	paths: {
		a: "a",
		b: "b"
	},
	shim: {
		a: {
			deps: ["b"]
		}
	}
});