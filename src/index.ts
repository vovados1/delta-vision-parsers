import { BinanceParser } from "./parsers/impl/BinanceParser"
import { ByBitParser } from "./parsers/impl/ByBitParser"
import { OkxParser } from "./parsers/impl/OkxParser"
import { CoinbaseParser } from "./parsers/impl/CoinbaseParser"
import { KrakenParser } from "./parsers/impl/KrakenParser"

const binanceParser = new BinanceParser({
  pair: "btcusdt",
  onDatapoint: (datapoint) => {
    console.log("Binance", datapoint)
  },
})

// binanceParser.connect()

const byBitParser = new ByBitParser({
  pair: "BTCUSDT",
  onDatapoint: (datapoint) => {
    console.log("ByBit", datapoint)
  },
})

// byBitParser.connect()

const okxParser = new OkxParser({
  pair: "BTC-USDT",
  onDatapoint: (datapoint) => {
    console.log("Okx", datapoint)
  },
})

// okxParser.connect()

const coinbaseParser = new CoinbaseParser({
  pair: "BTC-USD",
  onDatapoint: (datapoint) => {
    console.log("Coinbase", datapoint)
  },
})

// coinbaseParser.connect()

const krakenParser = new KrakenParser({
  pair: "BTC/USD",
  onDatapoint: (datapoint) => {
    console.log("Kraken", datapoint)
  },
})

krakenParser.connect()
