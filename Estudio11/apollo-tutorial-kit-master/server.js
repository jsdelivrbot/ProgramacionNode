import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Engine } from 'apollo-engine';

import schema from './data/schema';

const GRAPHQL_PORT = 4000;
const ENGINE_API_KEY = 'service:jvallejodagua-6736:44J84FGUDIBpGijFUdg_2g'; // TODO

const graphQLServer = express();

// The full new config
const engine = new Engine({
  engineConfig: {
    apiKey: ENGINE_API_KEY,
    stores: [
      {
        name: 'inMemEmbeddedCache',
        inMemory: {
          cacheSize: 20971520 // 20 MB
        }
      }
    ],
    queryCache: {
      publicFullQueryStore: 'inMemEmbeddedCache'
    }
  },
  graphqlPort: GRAPHQL_PORT
});

engine.start();

// This must be the first middleware
graphQLServer.use(engine.expressMiddleware());
graphQLServer.use(compression());
graphQLServer.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    // This option turns on tracing
    tracing: true
  })
);

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  tracing: true,
  cacheControl: true
}));

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
  )
);