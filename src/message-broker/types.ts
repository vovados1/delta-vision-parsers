import type { DataPoint } from "../parsers/types"

export interface MessageBroker {
  produceDatapoint(datapoint: DataPoint): Promise<void>
}
