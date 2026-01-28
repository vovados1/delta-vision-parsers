import dotenv from "dotenv"
import { Kafka } from "kafkajs"
import { BinanceParser } from "./parsers/impl/BinanceParser"
import { ByBitParser } from "./parsers/impl/ByBitParser"
import { CoinbaseParser } from "./parsers/impl/CoinbaseParser"
import { KrakenParser } from "./parsers/impl/KrakenParser"
import { OkxParser } from "./parsers/impl/OkxParser"
import { createParser } from "./parsers/parserFactory"
import type { Parser, ParserConfig } from "./parsers/types"
import { KafkaBroker } from "./message-broker/KafkaBroker"

dotenv.config({ path: ".env.local" })

const kafka = new Kafka({
  clientId: String(process.env.KAFKA_CLIENT_ID),
  brokers: String(process.env.KAFKA_BROKERS).split(","),
})
const producer = kafka.producer()

producer.connect().then(() => {
  producer
    .send({
      topic: "data-topic",
      messages: [{ value: "Hello KafkaJS user!" }],
    })
    .then(() => {
      producer.disconnect()
    })
})

const parsersPool: Record<string, new (config: ParserConfig) => Parser> = {
  binance: BinanceParser,
  bybit: ByBitParser,
  coinbase: CoinbaseParser,
  kraken: KrakenParser,
  okx: OkxParser,
}

// Parse `exchange` and `pairs` from command line arguments
const exchange = process.argv.find((arg) => arg.startsWith("--exchange="))?.split("=")[1] as keyof typeof parsersPool
// `pairs` should look like `btc/usdt,eth/usdt,sol/usdt`
const pairs = process.argv
  .find((arg) => arg.startsWith("--pairs="))
  ?.split("=")[1]
  .split(",")

if (!exchange || !pairs) {
  console.error("Exchange and pairs are required")
  process.exit(1)
}

// Initialize Kafka (1 WS connection per exchange/process)
const messageBroker = new KafkaBroker(
  String(process.env.KAFKA_CLIENT_ID),
  String(process.env.KAFKA_BROKERS).split(","),
  String(process.env.KAFKA_TOPIC_NAME)
)

// Create and connect parsers for each pair
pairs.forEach((pair) => {
  const parser = createParser(parsersPool[exchange], { pair }, messageBroker)
  parser.connect()
})
