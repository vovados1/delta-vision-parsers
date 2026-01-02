import { DataPoint, Parser, ParserConfig } from "./types"

export abstract class BaseParser<TInput> implements Parser {
  public static readonly EXCHANGE_NAME: string

  protected ws: WebSocket | undefined = undefined
  protected abstract readonly WS_URL: string
  protected currentDatapoint: DataPoint | null = null

  constructor(
    protected readonly config: ParserConfig,
    protected readonly transformer: (data: TInput, _timestamp: number) => DataPoint
  ) {
    this.config = config
    this.transformer = transformer
  }

  get datapoint(): DataPoint | null {
    return this.currentDatapoint
  }

  async connect(): Promise<void> {
    if (this.ws) throw new Error("WebSocket already connected")

    const ws = new WebSocket(this.WS_URL)

    if (this.config.onOpen) ws.addEventListener("open", this.config.onOpen)
    if (this.config.onError) ws.addEventListener("error", this.config.onError)
    if (this.config.onClose) ws.addEventListener("close", this.config.onClose)
    if (this.config.onDatapoint) ws.addEventListener("message", this.onMessage)

    this.ws = ws
  }

  async disconnect(): Promise<void> {
    if (!this.ws) throw new Error("WebSocket not connected")

    if (this.config.onOpen) this.ws.removeEventListener("open", this.config.onOpen)
    if (this.config.onError) this.ws.removeEventListener("error", this.config.onError)
    if (this.config.onClose) this.ws.removeEventListener("close", this.config.onClose)
    if (this.config.onDatapoint) this.ws.removeEventListener("message", this.onMessage)

    this.ws.close()
    this.ws = undefined
  }

  onMessage = (e: MessageEvent) => {
    const data: TInput = JSON.parse(e.data as string)
    const datapoint = this.transformer(data, e.timeStamp)
    this.config.onDatapoint?.(datapoint)
    this.currentDatapoint = datapoint
  }
}
