/*
	quiz/index.ts exports all classes from quiz. These classes
	are part of a process, so they successively import each other.
	Initializer imports Formulator, Formulator imports WalkthroughMan, 
	and so on.

	This triggers a circular dependency warning, because: 
	quiz/index.ts -> quiz/Initializer.ts -> quiz.index.ts

	But those classes don't all import each other, so it's not really
	a problem... 

	If anyone knows a better way to do this, please let me know by
	opening an issue. Thank you :)
*/
const onwarn = (warning) => {
  if (warning.code === "CIRCULAR_DEPENDENCY") return;
  console.warn(`(!) ${warning.message}`);
};

module.exports = {
  input: "build/ts/index.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "latinstudier",
    file: "build/bundle.js",
  },
  onwarn,
};
