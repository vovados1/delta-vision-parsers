import { BaseParser } from "../BaseParser"
import type { DataPoint, ParserConfig } from "../types"

type KrakenDatapoint = [number, string[], string, string]

export class KrakenParser extends BaseParser<KrakenDatapoint> {
  public static readonly EXCHANGE_NAME = "Kraken"

  protected readonly WS_URL = `wss://ws.kraken.com`

  constructor(config: ParserConfig) {
    const onOpen = () => {
      if (!this.ws) return
      this.ws.send(
        JSON.stringify({
          event: "subscribe",
          pair: [this.getPairName()],
          subscription: {
            name: "spread",
          },
        })
      )
      config.onOpen?.()
    }

    super({ ...config, onOpen })
  }

  transformer(data: KrakenDatapoint): DataPoint {
    return {
      bid: Number(data[1][0]),
      ask: Number(data[1][1]),
      bidQty: Number(data[1][3]),
      askQty: Number(data[1][4]),
      timestamp: Date.now(),
    }
  }

  getPairName(): string {
    return this.config.pair.toUpperCase()
  }

  filter(msg: unknown): boolean {
    const obj = msg as object | Array<KrakenDatapoint>
    return Array.isArray(obj)
  }
}
