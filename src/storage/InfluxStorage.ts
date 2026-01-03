import { InfluxDB, Point, type WriteApi } from "@influxdata/influxdb-client"
import { DeleteAPI } from "@influxdata/influxdb-client-apis"
import type { DataPoint } from "../parsers/types"
import type { Storage } from "./types"

export class InfluxStorage implements Storage {
  private readonly client: InfluxDB
  private readonly writeApi: WriteApi
  private readonly deleteApi: DeleteAPI

  private readonly bucket: string = "orderbook_data"

  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly org: string
  ) {
    this.client = new InfluxDB({ url, token })
    this.writeApi = this.client.getWriteApi(org, this.bucket, "ms", {
      flushInterval: 5000,
      batchSize: 100,
      writeSuccess: console.log,
    })
    this.deleteApi = new DeleteAPI(this.client)
  }

  async writeDatapoint(exchange: string, pair: string, datapoint: DataPoint): Promise<void> {
    const point = new Point(exchange)
      .tag("pair", pair)
      .floatField("bid", datapoint.bid)
      .floatField("ask", datapoint.ask)
      .floatField("bidQty", datapoint.bidQty)
      .floatField("askQty", datapoint.askQty)
      .timestamp(datapoint.timestamp)

    this.writeApi.writePoint(point)
  }

  async deleteDatapoint(exchange: string, pair: string, datapoint: DataPoint): Promise<void> {
    const predicate = `_measurement="${exchange}" AND pair="${pair}"`

    // Create a small time window around the datapoint's timestamp
    // InfluxDB deletes by time range, so we add ±1ms buffer
    const timestamp = new Date(datapoint.timestamp)
    const startTime = new Date(timestamp.getTime() - 1)
    const endTime = new Date(timestamp.getTime() + 1)

    await this.deleteApi.postDelete({
      org: this.org,
      bucket: this.bucket,
      body: {
        start: startTime.toISOString(),
        stop: endTime.toISOString(),
        predicate,
      },
    })
  }
}
