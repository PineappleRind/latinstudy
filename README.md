# latinstudy

Helps to study latin declensions/vocabulary
- For my latin course because when you're looking for something specific, the book feels big, cluttered, and cumbersome to flip through (and I don't like Quizlet)
- Made by me for me, but if you want to use it, it's hosted [here](https://pineapplerind.xyz/latinstudy)

## Running locally 
- use scripts/run.sh to build and run (you may need to `chmod +x scripts/run.sh` if permission denied)
- here's what the script does if you for some reason don't want to run it:
- - compile TypeScript to build/ts 
- - use rollup or a similar tool to bundle the files to build/bundle.js
- - use uglify or a similar tool to minify the bundle to build/bundle.min.js
- - run using python `http.server` (just serves static files)

*current version: 0.1*

*author: PineappleRind*

*(Henle Latin, Christian/Classical)*