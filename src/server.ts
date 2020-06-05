import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { loadSchemaSync, addResolversToSchema, GraphQLFileLoader } from 'graphql-tools';
import { join } from 'path';
import ExoplanetsAPI from './services/exoplanets.service';
import resolvers from './graphql/resolvers/exoplanet.resolver';

dotenv.config();
const mongodbPassword = process.env.MONGODB_CLUSTER_PASSWORD;

const schema = loadSchemaSync(join(__dirname, 'graphql', 'schemas', 'exoplanet.graphql'), { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

const server = new ApolloServer({
  schema: schemaWithResolvers,
  dataSources: () => ({
    exoplanetsAPI: new ExoplanetsAPI()
  }),
  playground: true
}) /* tinha problema de Type porque o @types/express tava pegando
 de um lugar bizarro, fiz um yarn add --dev @types/express
 e ele pegou do lugar mais canônico, e resolveu o problema dos types */;

const app = express();
app.use('*', cors())
server.applyMiddleware({ app });

mongoose.connect(`mongodb+srv://pedro:${mongodbPassword}@cluster0-exkvv.gcp.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'review' });

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);