import { BaseParser } from "../BaseParser"
import type { DataPoint, ParserConfig } from "../types"

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
          args: [`orderbook.1.${this.getPairName()}`],
        })
      )
      config.onOpen?.()
    }

    super({ ...config, onOpen })
  }

  transformer(data: ByBitDatapoint): DataPoint {
    return {
      bid: Number(data.data.b[0][0]),
      ask: Number(data.data.a[0][0]),
      bidQty: Number(data.data.b[0][1]),
      askQty: Number(data.data.a[0][1]),
      timestamp: data.ts,
    }
  }

  getPairName(): string {
    return this.config.pair.replace("/", "").toUpperCase()
  }

  filter(msg: unknown): boolean {
    const obj = msg as { type?: string }
    return obj?.type === "snapshot"
  }
}
