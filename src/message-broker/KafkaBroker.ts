import { Kafka, type Consumer, type Producer } from "kafkajs"
import type { MessageBroker } from "./types"

export class KafkaBroker implements MessageBroker {
  protected readonly client: Kafka
  // Implementing consumer (just in case)
  protected consumer: Consumer
  protected producer: Producer

  constructor(
    private readonly clientId: string,
    private readonly brokers: string[],
    private readonly topic: string
  ) {
    this.client = new Kafka({ clientId, brokers })
    this.connect()
  }

  async connect() {
    this.consumer = this.client.consumer({ groupId: "kafka-broker-group" })
    this.producer = this.client.producer()

    // Connecting only to producer because it's the only thing needed for parsers
    await this.producer.connect()
  }

  async produce(message: unknown, key?: string) {
    await this.producer.send({ topic: this.topic, messages: [{ value: JSON.stringify(message), key }] })
  }
}
