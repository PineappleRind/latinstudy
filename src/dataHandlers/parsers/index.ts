/* Export these as endings and vocab because:
To find a parser, ParserManager uses the ID of the 
fetched JSONResource, which is either endings or vocab. 

And, for the same reason, even though these are
classes, they're exported as lowercase. */
export { EndingParser as endings } from './EndingParser.js';
export { VocabParser as vocab } from './VocabParser.js';