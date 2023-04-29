import { PubSub } from 'graphql-yoga';
import { createPubSub } from 'graphql-yoga';
import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import {schema} from './schema'
const yoga = createYoga({
  schema,
})

const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
});
