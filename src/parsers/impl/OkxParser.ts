import { BaseParser } from "../BaseParser"
import type { ParserConfig } from "../types"

interface OkxDatapoint {
  arg: {
    channel: string
    instId: string
  }
  data: {
    asks: string[][]
    bids: string[][]
    ts: string
    seqId: number
  }[]
}

export class OkxParser extends BaseParser<OkxDatapoint> {
  public static readonly EXCHANGE_NAME = "Okx"

  protected readonly WS_URL = `wss://ws.okx.com:8443/ws/v5/public`

  constructor(config: ParserConfig) {
    const onOpen = () => {
      if (!this.ws) return
      this.ws.send(
        JSON.stringify({
          op: "subscribe",
          args: [
            {
              channel: "bbo-tbt",
              instId: this.config.pair,
            },
          ],
        })
      )
      config.onOpen?.()
    }

    super(
      { ...config, onOpen },
      (data) => ({
        bid: Number(data.data[0].bids[0][0]),
        ask: Number(data.data[0].asks[0][0]),
        bidQty: Number(data.data[0].bids[0][1]),
        askQty: Number(data.data[0].asks[0][1]),
        timestamp: Number(data.data[0].ts),
      }),
      (msg) => {
        const obj = msg as { data?: { asks: string[][] }[] }
        return !!obj?.data?.[0]?.asks
      }
    )
  }
}
