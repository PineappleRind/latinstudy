# Data documentation

How the data is stored and categorized.

## Contents

In this folder you'll find endings.json and vocab.json.

### `endings.json`

- Endings for all 5 noun declensions
- Endings for all 4 conjugations (indicative mood only)
- Declensions for all personal pronouns (1st/2nd/3rd person)

### `vocab.json`

- A long array of words. A word will look like this:
  ```json
  {
    "word": "trāns",
    "type": "preposition",
    "lesson": 16,
    "dictionary": "prep. w. acc",
    "translation": "across"
  }
  ```
  Where `lesson` is which lesson the word is first shown in the Henle Latin book.

Strings are used for "comments" and are stripped out before being served on the API.

If there is an asterisk before the translation, that translation was added by me and not in the book to aid people guessing translations in the quiz.

- When contributing, don't mess up the formatting! Because I'm proud of it...and it also helps with readability and categorization. <sub>"oh, but `endings.json` isn't 'readable', you have all these silly abbreviations" fair but still</sub>

## Ending String (`endings.json`)

I think it's best to start with an example.

`conjugation > 1 > a/i/fut/s/3`

This string denotes the 1st conjugation active indicative future tense singular third p<ruby>
erson ending<rt>quite the mouthful isn't it</rt></ruby>. You'll see something like this as a key. The property is the ending itself.

The order goes like this for declensions:

[gender](#gender)/[number](#grammatical-number)/[case](#case)

And like this for conjugations:

[voice](#voice)/[mood](#mood)/[tense](#tense)/[number](#grammatical-number)/[person](#person)

### Abbreviations

#### Case

| case       | representation |
| ---------- | -------------- |
| nominative | nom            |
| genitive   | gen            |
| dative     | dat            |
| accusative | acc            |
| ablative   | abl            |

#### Gender

| gender    | representation |
| --------- | -------------- |
| masculine | m              |
| feminine  | f              |
| neuter    | n              |

#### Grammatical number

| number   | representation |
| -------- | -------------- |
| singular | s              |
| plural   | p              |

#### Mood

<!-- > Currently, only indicative is supported -->

| mood       | representation |
| ---------- | -------------- |
| indicative | i              |

<!--| imperative     | im  | -->
<!--| subjunctive    | s   | -->
<!--| gerund         | g   | -->
<!--| supine         | sp  | -->
<!--| participle     | p   | -->

#### Tense

| tense          | representation |
| -------------- | -------------- |
| present        | pre            |
| imperfect      | imp            |
| future         | fut            |
| perfect        | per            |
| pluperfect     | plu            |
| future perfect | ftp            |

#### Person

Self-explanatory, a number from 1-3

#### Voice

| voice   | representation |
| ------- | -------------- |
| active  | a              |
| passive | p              |




TODO support multiple genders. Latin...