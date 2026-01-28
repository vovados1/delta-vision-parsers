export interface MessageBroker {
  produce(message: unknown, key?: string): Promise<void>
}
