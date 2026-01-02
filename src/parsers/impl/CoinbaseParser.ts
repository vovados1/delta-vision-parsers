import { BaseParser } from "../BaseParser"
import { ParserConfig } from "../types"

interface CoinbaseDatapoint {
  type: string
  sequence: number
  product_id: string
  price: string
  open_24h: string
  volume_24h: string
  low_24h: string
  high_24h: string
  volume_30d: string
  best_bid: string
  best_ask_size: string
  best_ask: string
  best_bid_size: string
  side: string
  time: string
  trade_id: number
  last_size: string
}

export class CoinbaseParser extends BaseParser<CoinbaseDatapoint> {
  public static readonly EXCHANGE_NAME = "Coinbase"

  protected readonly WS_URL = `wss://ws-feed.exchange.coinbase.com`

  constructor(config: ParserConfig) {
    const onOpen = () => {
      if (!this.ws) return
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: [this.config.pair],
          channels: ["ticker"],
        })
      )
      config.onOpen?.()
    }

    super(
      { ...config, onOpen },
      (data) => ({
        bid: Number(data.best_bid),
        ask: Number(data.best_ask),
        bidQty: Number(data.best_bid_size),
        askQty: Number(data.best_ask_size),
        timestamp: Date.parse(data.time),
      }),
      (msg) => {
        const obj = msg as { type: string }
        return obj?.type === "ticker"
      }
    )
  }
}
