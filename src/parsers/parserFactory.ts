import type { Parser, ParserConfig } from "./types"
import type { MessageBroker } from "../message-broker/types"

export function createParser(
  ParserClass: new (config: ParserConfig) => Parser,
  config: ParserConfig,
  messageBroker: MessageBroker
): Parser {
  const parser = new ParserClass({
    ...config,
    onDatapoint: (datapoint) => {
      messageBroker.produce(datapoint, `${parser.exchangeName.toLowerCase()}_${config.pair}`)
    },
  })

  return parser
}
