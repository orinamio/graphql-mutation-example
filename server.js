const express = require('express'),
  graphqlHTTP = require('express-graphql'),
  schema = require('./src/schema.js');

const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true 
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`GraphQL API server running at localhost:${PORT}`);

