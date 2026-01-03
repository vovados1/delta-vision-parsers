import { DataPoint } from "../parsers/types"

export interface Storage {
  writeDatapoint(exchange: string, pair: string, datapoint: DataPoint): Promise<void>
  deleteDatapoint(exchange: string, pair: string, datapoint: DataPoint): Promise<void>
}
