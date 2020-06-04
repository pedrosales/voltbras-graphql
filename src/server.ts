import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import Person from './models/Person';
import Station from './models/Station';
import mongoose from 'mongoose';
import ExoplanetsAPI from './services/exoplanets.serice';
//import schema from './schema';

const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
  }

  type Mass {
    value: Float!,
    unit: String!
  }

  type Exoplanet {
    name: String!,
    mass: Mass,
    hasStation: Boolean
  }

  type Query {
    people: [Person]!
    exoplanets: [Exoplanet]!
    suitablePlanets: [Exoplanet]!
  }

  input PersonInput {
    name: String
  }

  type Mutation {
    createPerson(name: String!) : Person
    installStation(name: String!): Boolean
    uninstallStation(name: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    people: async () => await Person.find({}),
    exoplanets: async (source, args, { dataSources }) => {
      return await dataSources.exoplanetsAPI.getExoplanets() as any[];
    },
    suitablePlanets: async (source, args, { dataSources }) => await dataSources.exoplanetsAPI.suitablePlanets() as any[],
  },
  Mutation: {
    createPerson: async (source, args) => {
      const person = await Person.create({ name: args.name });
      return person;
    },
    installStation: async (source, args) => {
      const station = await Station.create({ name: args.name });
      return station != null;
    },
    uninstallStation: async (source, args) => {
      const uninstall = await Station.findOneAndDelete({ name: args.name });
      return uninstall != null;
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    exoplanetsAPI: new ExoplanetsAPI()
  }),
  playground: true
}) as any;

const app = express();
app.use('*', cors());
server.applyMiddleware({ app: app });

mongoose.connect('mongodb+srv://pedro:luao9673@cluster0-exkvv.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'graphql' });

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);