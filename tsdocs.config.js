module.exports = {
	// See more options at https://tsdocs.xyz/pages/Guides/Options
	entryPoints: ["src/index.ts"], // Entry points, every project you want to include in the documentation should have exactly one entry point
	name: "latinstudy", // The name of your project
	out: "./docs", // Where to put the generated documentation
	exportMode: "simple",
	documentImports: true,
};
