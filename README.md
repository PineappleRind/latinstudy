# latinstudy

Helps to study latin declensions/vocabulary
- For my latin course because when you're looking for something specific, the book feels big, cluttered, and cumbersome to flip through (and I don't like Quizlet)
- Made by me for me, but if you want to use it, it's hosted [here](https://pineapplerind.xyz/latinstudy)

*current version: 0.1*

*author: PineappleRind*

*(Henle Latin, Christian/Classical)*

## Running locally 
- use the Runner to run, over at [scripts/build.sh](https://github.com/PineappleRind/latinstudy/blob/main/scripts/build.sh) (you may need to chmod +x if permission denied)
- run it with the `--help` flag for advanced usage

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

## Commits
Commits should have a list of changes in their description.

An example change:

`fs: move types to their own files`

The left descriptor can be one of `build, refactor, fs, opt, feat, rm`. 

Additional information should be directly under the change and should have "———" 3 em dashes at the beginning, to differentiate it from the other changes.

Example description:

```
build: run script does not build anymore

fs: move dataHandlers/index.ts to dataHandlers/DataHandler.ts
—— classes should not be in the index (except root)
fs: Endings.ts -> EndingParser.ts (same with vocab)

feat: begin MagicValue parser
```

You don't actually need to follow this, it's just a guideline I follow for consistency. :)
