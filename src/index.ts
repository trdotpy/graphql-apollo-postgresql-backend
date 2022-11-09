import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import dotenv from 'dotenv'
import typeOrmConfig from './type-orm.config'
import { Context } from './types/Context'
import { auth } from './middleware/auth'

dotenv.config()

const bootServer = async () => {
  const connectDB = await typeOrmConfig.initialize()

  const server = new ApolloServer({
    schema,
    context: ({ req }): Context => {
      const token = req?.headers?.authorization
        ? auth(req.headers.authorization)
        : null
      return { connectDB, userId: token?.userId }
    },
  })

  server.listen(4000).then(({ url }) => {
    console.log('Listening on: ' + url)
  })
}

bootServer()
