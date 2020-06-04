import Station from '../../models/Station';

const resolvers = {
    Query: {
        exoplanets: async (source, args, { dataSources }) => {
            return await dataSources.exoplanetsAPI.getExoplanets() as any[];
        },
        suitablePlanets: async (source, args, { dataSources }) => await dataSources.exoplanetsAPI.suitablePlanets() as any[],
    },
    Mutation: {
        installStation: async (source, args) => {
            const station = await Station.create({ name: args.name });
            return station != null;
        },
        uninstallStation: async (source, args) => {
            const uninstall = await Station.findOneAndDelete({ name: args.name });
            return uninstall != null;
        },
    }
};

export default resolvers;