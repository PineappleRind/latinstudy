echo Building TypeScript...
bunx tsc
echo Rollup-ing...
npx rollup -c
echo "Minifying..."
uglifyjs -c -m -o build/bundle.min.js build/bundle.js
echo "Done."