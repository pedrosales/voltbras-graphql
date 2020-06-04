import { RESTDataSource } from 'apollo-datasource-rest';
import Station from '../models/Station';

class ExoplantesAPI extends RESTDataSource {
    /**
     *
     */
    constructor() {
        super();
        this.baseURL = 'https://api.arcsecond.io/';
    }

    async getExoplanets() {
        const result = await this.get('exoplanets');

        return result.results.map(planet => {
            let mass = {
                value: 0,
                unit: ''
            };

            if (planet.mass != null && planet.mass.value != null) {
                mass = { value: parseFloat(planet.mass.value), unit: planet.mass.unit };
                return { name: planet.name, mass };
            }
        });
    }

    async suitablePlanets() {
        const planets = await this.get('exoplanets');

        const suitPlantes = planets.results.filter(planet => planet.mass?.value > 25);
        const stations = await Station.find({}) as any[];

        const result = suitPlantes.map(planet => {
            const hasStation = (stations.filter(x => x.name === planet.name)).length > 0;
            return { name: planet.name, mass: { value: parseFloat(planet.mass?.value), unit: planet.mass?.unit }, hasStation }
        });

        return result;
    }
}

export default ExoplantesAPI;