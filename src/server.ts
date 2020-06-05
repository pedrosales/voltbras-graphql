import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import Station from './models/Station';
import mongoose from 'mongoose';
import ExoplanetsAPI from './services/exoplanets.service';
//import schema from './schema';


import { loadSchemaSync, addResolversToSchema, GraphQLFileLoader } from 'graphql-tools';

import resolvers from './graphql/resolvers/exoplanet.resolver';
import { join } from 'path';

dotenv.config();
const mongodbPassword = process.env.MONGODB_CLUSTER_PASSWORD;

const schema = loadSchemaSync(join(__dirname, 'graphql', 'schemas', 'exoplanet.graphql'), { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
// const typeDefs = gql`
//   type Mass {
//     value: Float!,
//     unit: String!
//   }

//   type Exoplanet {
//     name: String!,
//     mass: Mass,
//     hasStation: Boolean
//   }

//   type Query {
//     exoplanets: [Exoplanet]!
//     suitablePlanets: [Exoplanet]!
//   }

//   type Mutation {
//     installStation(name: String!): Boolean
//     uninstallStation(name: String!): Boolean
//   }
// `;

// const resolvers = {
//   Query: {
//     exoplanets: async (source, args, { dataSources }) => {
//       return await dataSources.exoplanetsAPI.getExoplanets() as any[];
//     },
//     suitablePlanets: async (source, args, { dataSources }) => await dataSources.exoplanetsAPI.suitablePlanets() as any[],
//   },
//   Mutation: {
//     installStation: async (source, args) => {
//       const station = await Station.create({ name: args.name });
//       return station != null;
//     },
//     uninstallStation: async (source, args) => {
//       const uninstall = await Station.findOneAndDelete({ name: args.name });
//       return uninstall != null;
//     },
//   }
// }

const server = new ApolloServer({
  schema: schemaWithResolvers,
  dataSources: () => ({
    exoplanetsAPI: new ExoplanetsAPI()
  }),
  playground: true
}) as any;

const app = express();
app.use('*', cors());
server.applyMiddleware({ app: app });

mongoose.connect(`mongodb+srv://pedro:${mongodbPassword}@cluster0-exkvv.gcp.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'graphql' });

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);