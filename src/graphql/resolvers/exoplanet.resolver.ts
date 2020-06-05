import Station from '../../models/Station';

const resolvers = {
    Query: {
        // não entendi porque havia o "as any[]", não era necessário
        // ---
        // podemos deixar mais curto sem o {} e o return, e sem o async/await também
        exoplanets: (source, { page, size }, { dataSources }) => dataSources.exoplanetsAPI.getExoplanets(page, size),
        suitablePlanets: (source, { pages }, { dataSources }) => dataSources.exoplanetsAPI.suitablePlanets(pages),
    },
    Mutation: {
        installStation: async (source, { planetName }) => await Station.create({ planetName }) != null,
        uninstallStation: async (source, { planetName }) => await Station.findOneAndDelete({ planetName }) != null,
    }
};

export default resolvers;