import { BinanceParser } from "./parsers/impl/BinanceParser"
import { ByBitParser } from "./parsers/impl/ByBitParser"

const binanceParser = new BinanceParser({
  pair: "btcusdt",
  onDatapoint: (datapoint) => {
    console.log("Binance", datapoint)
  },
})

binanceParser.connect()

const byBitParser = new ByBitParser({
  pair: "BTCUSDT",
  onDatapoint: (datapoint) => {
    console.log("ByBit", datapoint)
  },
})

byBitParser.connect()
