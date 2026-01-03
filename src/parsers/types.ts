export interface DataPoint {
  bid: number
  ask: number
  bidQty: number
  askQty: number
  timestamp: number
}

export interface Parser {
  get datapoint(): DataPoint | null
  get exchangeName(): string
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export interface ParserConfig {
  pair: string
  onOpen?: () => void | Promise<void>
  onClose?: () => void | Promise<void>
  onError?: (error: Event) => void | Promise<void>
  onDatapoint?: (datapoint: DataPoint) => void | Promise<void>
}
