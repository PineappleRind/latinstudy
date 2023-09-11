# latinstudy

Helps to study latin declensions/vocabulary
- For my latin course because when you're looking for something specific, the book feels big, cluttered, and cumbersome to flip through (and I don't like Quizlet)
- Made by me for me, but if you want to use it, it's hosted [here](https://pineapplerind.xyz/latinstudy)

*current version: 0.1*

*author: PineappleRind*

*(Henle Latin, Christian/Classical)*

## Running locally 
All commands listed can be replaced with your favorite package manager :)
1. `bun i` — install dependencies 
2. `bun dev` — run "dev" script
3. `open localhost:5173` — open in browser!

## Guide to the codebase
- `README.md`: you are here
- `static`: static assets that will not be processed by Svelte
- `src`: main ui/logic
- - `components`: reusable components or functionality extracted from pages/layouts
- - `routes`: each page and its logic
- - - `api`: backend api routes
- - - `quiz`: quiz-related routes 
- - - `view`: learn-related routes
- - `types`: shared types between api/routes
- - `utils`: reusable functions 
