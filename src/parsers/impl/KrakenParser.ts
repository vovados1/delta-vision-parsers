import { BaseParser } from "../BaseParser"
import type { ParserConfig } from "../types"

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
          pair: [this.config.pair],
          subscription: {
            name: "spread",
          },
        })
      )
      config.onOpen?.()
    }

    super(
      { ...config, onOpen },
      (data) => {
        return {
          bid: Number(data[1][0]),
          ask: Number(data[1][1]),
          bidQty: Number(data[1][3]),
          askQty: Number(data[1][4]),
          timestamp: Number(data[1][2]),
        }
      },
      (msg) => {
        const obj = msg as object | Array<KrakenDatapoint>
        return Array.isArray(obj)
      }
    )
  }
}
