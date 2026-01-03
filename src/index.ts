import dotenv from "dotenv"
import { BinanceParser } from "./parsers/impl/BinanceParser"
import { createParser } from "./parsers/parserFactory"
import { InfluxStorage } from "./storage/InfluxStorage"

dotenv.config({ path: ".env.local" })

const parser = createParser(
  BinanceParser,
  { pair: "btcusdt" },
  new InfluxStorage(
    String(process.env.INFLUXDB_URL),
    String(process.env.INFLUXDB_TOKEN),
    String(process.env.INFLUXDB_ORG_NAME)
  )
)

parser.connect()
