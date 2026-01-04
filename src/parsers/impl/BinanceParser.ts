import { BaseParser } from "../BaseParser"
import type { DataPoint, ParserConfig } from "../types"

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

  protected readonly WS_URL = `wss://stream.binance.com:9443/ws/${this.getPairName()}@bookTicker`

  constructor(config: ParserConfig) {
    super(config)
  }

  transformer(data: BinanceDatapoint): DataPoint {
    return {
      bid: Number(data.b),
      ask: Number(data.a),
      bidQty: Number(data.B),
      askQty: Number(data.A),
      timestamp: Date.now(),
    }
  }

  getPairName() {
    return this.config.pair.replace("/", "").toLowerCase()
  }
}
