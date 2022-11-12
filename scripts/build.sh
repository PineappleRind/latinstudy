npx rollup src/index.js -o build/bundle.js
echo "Minifying..."
uglifyjs -c -m -o build/bundle.min.js build/bundle.js
echo "Done minifying."