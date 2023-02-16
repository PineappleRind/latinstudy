# latinstudy

Helps to study latin declensions/vocabulary
- For my latin course because when you're looking for something specific, the book feels big, cluttered, and cumbersome to flip through (and I don't like Quizlet)
- Made by me for me, but if you want to use it, it's hosted [here](https://pineapplerind.xyz/latinstudy)

## Running locally 
- use scripts/build.sh to build and scripts/run.sh to run (you may need to chmod +x if permission denied)
- here's what the script does if you for some reason don't want to run it:
- - compile TypeScript to build/ts 
- - use rollup or a similar tool to bundle the files to build/bundle.js
- - use uglify or a similar tool to minify the bundle to build/bundle.min.js
- - run using python `http.server` (just serves static files)

*current version: 0.1*

*author: PineappleRind*

*(Henle Latin, Christian/Classical)*

## Docs
To build documentation, run scripts/docs.sh. Documentation is in the .gitignore because it's not part of the project :)
 
## Guide to the codebase
> A simple index of files and folders. Real docs coming soon (see issue #2)
- `css`: css style files
- `data`: json data for endings, vocab, etc
- `scripts`: shell scripts for local development
- `src`: main logic
- - `components`: visual components such as popups
- - `dataHandlers`: code for dealing with data: fetches the data and parses it
- - `quiz`: main code for the quiz
- - - `components`: components specific to the quiz
- - - `Initializer, Formulator, WalkthroughMan, Grader`: logic dealing with the quiz itself, per-step
- - - `formulators`: helpers for `Formulator`
- - - `walkthroughHelpers`: helpers for `WalkthroughMan`
- - `view`: main code for the view section
- - - `loader`: main code for this section. split this into multiple files later