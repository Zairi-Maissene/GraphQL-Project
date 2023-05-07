import { PubSub } from 'graphql-yoga';
import { createPubSub } from 'graphql-yoga';
import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import {schema} from './schema'
import {db} from './context/context'
const yoga = createYoga({
schema
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
});