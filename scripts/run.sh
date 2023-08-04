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
│     -b ${DIM}${BOLD}disable building$RESET                   │
│     -s ${DIM}${BOLD}serve files on port 8000$RESET           │
╰───────────────────────────────────────────╯"
    exit 0
fi

if [[ $1 != "-"*"r"* ]]
then
    echo Building...
    bun build ./src/index.ts --sourcemap external --outdir ./build --splitting --minify
else
    echo Building skipped
fi

if [[ $1 == "-"*"s"* ]]; then
    python3 -m http.server
fi