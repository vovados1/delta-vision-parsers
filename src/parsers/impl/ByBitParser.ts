import { BaseParser } from "../BaseParser"
import type { ParserConfig } from "../types"

interface ByBitDatapoint {
  topic: string
  ts: number
  type: string
  cts: number
  data: {
    s: string
    b: string[][]
    a: string[][]
    u: number
    seq: number
  }
}

export class ByBitParser extends BaseParser<ByBitDatapoint> {
  public static readonly EXCHANGE_NAME = "ByBit"

  protected readonly WS_URL = `wss://stream.bybit.com/v5/public/spot`

  constructor(config: ParserConfig) {
    const onOpen = () => {
      if (!this.ws) return
      this.ws.send(
        JSON.stringify({
          op: "subscribe",
          args: [`orderbook.1.${this.config.pair}`],
        })
      )
      config.onOpen?.()
    }

    super(
      { ...config, onOpen },
      (data) => ({
        bid: Number(data.data.b[0][0]),
        ask: Number(data.data.a[0][0]),
        bidQty: Number(data.data.b[0][1]),
        askQty: Number(data.data.a[0][1]),
        timestamp: data.ts,
      }),
      (msg) => {
        const obj = msg as { type?: string }
        return obj?.type === "snapshot"
      }
    )
  }
}
