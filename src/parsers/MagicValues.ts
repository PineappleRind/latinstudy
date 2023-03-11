// Todo: this should not be imported anywhere

export type MagicValue = {
  data: string[],
  notes: string[]
}

/**
 * MagicValues is a class for parsing Magic Values.
 * Magic Values are a special kind of encoded string that encode useful information.
 * Currently only Pipe Notes are supported.
 */

export class MagicValueParser {
  /** Characters to look for when parsing different things. */
  chars = {
    DATA_SEP: ",",
    PIPE_NOTES: "|"
  };

  /** All this does so far is parse pipe notes. */
  parse(data): MagicValue {
    let out: MagicValue = { data: [], notes: [] };
    let values = data.split(this.chars.DATA_SEP);
    for (const el of values) {
      let split = el.split(this.chars.PIPE_NOTES),
        value = split[0];
      out.data.push(value);
      if (split[1]) out.notes.push(split[1])
    }
    return out;
  }
}