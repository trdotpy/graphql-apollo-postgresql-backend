import { DataSource } from 'typeorm'

export type Context = {
  connectDB: DataSource
  userId: number | undefined
}
