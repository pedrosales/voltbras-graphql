import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
    name: 'Person',
    description: 'Define a Person Object',
    fields() {
        return {
            id: {
                type: GraphQLID,
                description: 'Unique ID',
                resolve: (person) => person.id
            },
            name: {
                type: GraphQLString,
                description: 'Person Name',
                resolve: (person) => person.name
            }
        }
    }
});