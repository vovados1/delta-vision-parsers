import type { Parser, ParserConfig } from "../parsers/types"
import type { Storage } from "../storage/types"

export function createParser(
  ParserClass: new (config: ParserConfig) => Parser,
  config: ParserConfig,
  storage: Storage
): Parser {
  const parser = new ParserClass({
    ...config,
    onDatapoint: (datapoint) => {
      storage.writeDatapoint(parser.exchangeName, config.pair, datapoint)
    },
  })

  return parser
}
