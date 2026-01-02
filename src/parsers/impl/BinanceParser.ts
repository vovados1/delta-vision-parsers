import { BaseParser } from "../BaseParser"
import { ParserConfig } from "../types"

interface BinanceDatapoint {
  u: number
  s: string
  b: string
  B: string
  a: string
  A: string
}

export class BinanceParser extends BaseParser<BinanceDatapoint> {
  public static readonly EXCHANGE_NAME = "Binance"

  protected readonly WS_URL = `wss://stream.binance.com:9443/ws/${this.config.pair}@bookTicker`

  constructor(config: ParserConfig) {
    super(config, (data, timestamp) => ({
      bid: Number(data.b),
      ask: Number(data.a),
      bidQty: Number(data.B),
      askQty: Number(data.A),
      timestamp,
    }))
  }
}
