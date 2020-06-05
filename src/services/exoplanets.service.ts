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

    async getExoplanets(page: number = 1, size: number = 10) {
        try {
            const result = await this.get('exoplanets', { page, page_size: size });

            return result.results.map(planet => {
                let mass = {
                    value: 0,
                    unit: ''
                };

                if (planet.mass != null && planet.mass.value != null) {
                    mass = { value: parseFloat(planet.mass.value), unit: planet.mass.unit };
                }

                return { name: planet.name, mass };
            });
        } catch (error) {
            console.log(error);
        }
    }

    async suitablePlanets(pages: number = 10) {
        try {
            // let planets;

            // if (page !== undefined && size !== undefined) {
            //     planets = await this.get('exoplanets', { page, page_size: size });
            // }
            // else {
            //     planets = await this.get('exoplanets');
            // }

            let allPlanets = [];
            let planets = await this.get('exoplanets');

            for (let i = 2; i <= pages; i++) {
                allPlanets = allPlanets.concat(planets.results);
                planets = await this.get('exoplanets', { page: i });
            }

            console.log(allPlanets.length);
            const suitPlantes = allPlanets.filter(planet => planet.mass?.value > 25);
            const stations = await Station.find({}) as any[];

            const result = suitPlantes.map(planet => {
                const hasStation = (stations.filter(x => x.name === planet.name)).length > 0;
                return { name: planet.name, mass: { value: parseFloat(planet.mass?.value), unit: planet.mass?.unit }, hasStation }
            });

            return result;
        } catch (error) {
            console.log(error);
        }
    }
}

export default ExoplantesAPI;