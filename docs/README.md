# Studier Documentation
Hastily ported from the old [Craft](https://www.craft.do/s/0Ovp6OfdLI8cAu). I used it to help me wrap my head around all the logic.

It's a little out of date and will be used as a reference when I implement TypeDoc <sup>I should have started with TypeDoc :|</sup>
# Table of contents
todo...

# Index
- Initialize Switcher
- Initialize QuizInitializer
- Initialize ViewLoader
- Fetch `endings.json`
- Fetch `vocab.json`
- Once finished, begin

# dataHandlers

## dataHandlers/DataHandler

- Root data handler class.
- Fetches data and parses it:
   - fetch both endings/vocab in an array
   - send both to Parser, which determines what needs to be parsed based on endings/vocab types

## dataHandlers/Parser

This class is basically just a wrapper around EndingParser and VocabParser.

It has one function: parse.

# Quiz

## quiz/**Initializer**

- Instantiate event listeners for settings
   - Deal with selecting declensions
      - Each button should have a target and a value
      - Target determines where the value gets written
   - Onclick event for quiz beginning
      - Write to settings with what user chose
      - Initialize formulator with fetched data

## quiz/**Formulator**

Initialize

- enable declensions based on bitfield
- generate a question for each generated declension
   - using Quiz.formulators.declensions
- initialize WalkthroughMan with the generated questions

## quiz/formulators/**declensions**

- Receive declension number and full data
- For each ending ( like `[type, ending] = ["m/s/nom", "us"]` )
   - Send type to [`formatQuestionString()`](#formatquestionstring) , creating a string based on type, like "masculine singular nominative"
- Generate HTML for the formatted question string and answer, using [`generateQuestionHTML()`](#generatequestionhtml)
- Store information in a `QuizQuestion` and add it to the question list
- Return the question list

### `generateQuestionHTML()`

- Create a title element to store question
- Create input element for entering text
- Create a header to explain question type
- Create a wrapper (.animator-inner) for Animator
- Append all elements to wrapper and return it

### `formatQuestionString()`

- Split type into information components
   - m/s/nom: [gender, gnumber, $case] = ["m", "s", "nom"]
- map each component using the map to expand contractions
   - return

## quiz/formulators/**vocab**

- Takes list of vocab and amount to generate
- If amount is 0, make amount the length of the vocab
- Shuffle the vocab list
- For as many as the user wants,
   - get a random vocab word from the vocab JSON
   - then create a QuizQuestion with HTML generated from [`generateVocabHTML()`](#generatevocabhtml)
- return all generated questions

### `generateVocabHTML()`

- create a title
   - the title is the how the word itself appears in the dictionary
- create an input
- create a header for question type
- create a wrapper (.animator-inner) for Animator
- append all elements to wrapper
- return wrapper

## quiz/walkthroughHelpers/**Animator**

Animator helps with cool, fluid animations when the content of the quiz changes.

Summary of what Animator does when Animator.animateTo is called:

- Calculates the dimensions of `newHTML`.
- Hides `outer` and animates its width/height to the dimensions of `newHTML`.
- After `delay` milliseconds, `outer` 's inner content is replaced with `newHTML` , and `outer` is unhidden.

# quiz/**WalkthroughMan**

This is one chonker of a module.

There must be an easier way to do much of this logic but I certainly can't think of it.

Ready?

## Breakdown

### Constructor

- Declare all needed variables, and initialize required classes (Grader and Animator).

### Initialize

- Shuffles the questions.
- Sets next event to "Grade", or "Next", depending on immediateGrade.
- Sets current question indicator to 1, and total question indicator to questions length.

### toQuestion

# Guide to the JSON

The JSON may look complicated and verbose at first glance, but it's actually all a brilliant code the logic uses to decipher what Latin is.

First, here's some shared information for all files.

## JSON: Magic Values™

Magic Values™ is a system that converts encoded keys to object structures.

### Example: pipe notes

Pipe notes are one type of encoding. Here's an example:

```javascript
{
  "-/p/gen": "nostrī|objective,nostrum|partitive"
}
```

Other information may differ based on JSON type, so select the file you're trying to understand.

[vocab.json](#vocabjson) | [endings.json](#endingsjson)

## vocab.json

This file contains all of the vocabulary words.

Let's look at a few examples, and hopefully you'll understand more as we go on :)

### Example: 1st declension noun

```json
{
  "word": "copi-a",
  "type": "noun",
  "declension: "1",
  "gender": "f",
  "translation": ["supply", "abundance"]
}
```

Not much information is included in a word. That's because the rest is inferred by dataHandlers/Parser! Isn't that amazing?!

#### Inferring the case

   Let's use our example word to determine the genitive. Parser looks at the word stem (text before `-`) and the declension. The 1st declension's genitive ending is æ, so Parser takes `copi` and adds `æ` . → `copiæ` !

#### Inferring the dictionary entry

   For the 1st declension, this is really simple.

      - Infer the nominative (using [above method](https://docs.craft.do/editor/d/c613f7a7-9b37-4593-abf5-0d63bed3e51e/9601b2ae-59a5-4b2d-afe1-82935e65e72a/x/B0062547-E890-4B28-8E9B-E01E979F45C8)).
      - Get declension-specific genitive.
      - Join using `,` .
      - → `copia, -æ` !

As you saw above, it's really not that hard! For the third declension, however, it gets harder.

### Example: 3rd declension noun

```json
{
   "word": "lūx",
   "type": "noun",
   "declension": "3",
   "gender": "f",
   "translation": "light",
   "genitive": "lūc-is"
}
```

#### Inferring the case

   Here, our data is helping us! It gave us both the word AND its genitive. Thank you :) (headpat)

   From here, it's simple:

   - remove -is from the genitive
   - add on the declension ending for the case we're looking for

   For an example, let's say we're trying to figure out the plural accusative:

   - 3rd declension feminine plural accusative ending = ::ēs::
   - ::lūc::/is + ::ēs:: = ::lūcēs:: !

#### Inferring the dictionary entry

   Since our data ever-so-kindly allowed us to see the genitive, this is easy as pie (but we do have to remove the - from the genitive).

   - `word` + `,`  + `genitive` = **lūx, lūcis**

### Example: 1st/2nd declension adjective

```json
{
   "word": "bon-us",
   "type": "adjective",
   "declension": "1/2",
   "translation": "good"
}
```

#### Inferring the gender/case

   1st/2nd declension adjectives are easy because they are basically a combination of 1st and 2nd declension nouns!

   So, if we wanted to infer the feminine singular dative;

   - 1st declension feminine singular dative ending = ::æ::
   - Adjective stem = ::bonus:: - ::us:: = ::bon::
   - ::bon:: + ::æ:: = **::bonæ::**!

#### Inferring the dictionary entry

   Since we know it's of the declension 1 or 2, add `, a, um`

   So: `bonus` + `, a, um`  = ::bonus, a, um::

> For adjectives that take a specific case, the `takesCase` property is used. Read more below!

### Final example: preposition

```json
{
   "word": "cum",
   "type": "preposition",
   "takesCase": "abl",
   "translation": "with"
}
```

#### Inferring the dictionary entry

Parser looks at the `takesCase` property and adds ", w. abl" (or whatever the `takesCase` property is).

## endings.json

### What's it used for?

The endings file contains case endings, verb endings, and personal pronouns. It's used for auto-conjugate, auto-decline, and for viewing/quizzing on.

### How it's parsed

It isn't! The pronouns section though has some [pipe notes](#example-pipe-notes) and [other encodings](#json-magic-values™).