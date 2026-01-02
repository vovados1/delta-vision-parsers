import { BinanceParser } from "./parsers/impl/BinanceParser"

const binanceParser = new BinanceParser({
  pair: "btcusdt",
  onDatapoint: (datapoint) => {
    console.log(datapoint)
  },
})

binanceParser.connect()
