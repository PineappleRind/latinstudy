BOLD=$(tput bold)
DIM="\x1b[2m"
CYAN="\x1b[36m"
RESET="\x1b[0m"

function command_exists {
    if command -v "$1" &> /dev/null; then 
        echo true
    else
        echo false
    fi
}

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then 
    echo "╭───────────────────────────────────────────╮
│  ${CYAN}${BOLD}LatinStudier Runner Help$RESET                 │
│     --help ${DIM}(-h) ${BOLD}prints this message$RESET       │
│     -r ${DIM}${BOLD}disable rollup$RESET                     │
│     -t ${DIM}${BOLD}disable typescript transpilation$RESET   │
│     -m ${DIM}${BOLD}disable minification$RESET                │
│     -s ${DIM}${BOLD}serve files on port 8000$RESET           │
╰───────────────────────────────────────────╯"
    exit 0
fi

if [ $(command_exists npx) == false ] && [ $(command_exists bunx) == false ]; then
    echo "You don't have npx or bunx installed! Make sure to install Bun (${CYAN}recommended${RESET}, https://bun.sh) or nodejs (https://nodejs.org)."
    exit
fi

if [[ $1 != "-"*"t"* ]]
then
    echo Building TypeScript...
    bunx tsc || npx tsc
else
    echo TypeScript build skipped
fi

if [[ $1 != "-"*"r"* ]]
then
    echo Rollup-ing...
    bunx rollup -c || npx rollup -c
else
    echo Rollup skipped
fi

if [[ $1 != "-"*"m"* ]]
then
    echo "Minifying..."
    if [ $(command_exists uglifyjs) == false ]; then
        echo "You don't have uglifyjs installed! Make sure to install dependencies with ${CYAN}npm -i${RESET}."
        exit
    fi
    uglifyjs -c -m -o build/bundle.min.js build/bundle.js
fi

if [[ $1 == "-"*"s"* ]]; then
    python3 -m http.server
fi