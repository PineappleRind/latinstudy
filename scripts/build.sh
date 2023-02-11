echo Building TypeScript...
bunx tsc
echo Rollup-ing...
npx rollup -f iife build/ts/index.js -o build/bundle.js
echo "Minifying..."
uglifyjs -c -m -o build/bundle.min.js build/bundle.js
echo "Done."