import { RESTDataSource } from 'apollo-datasource-rest';
import Station from '../models/Station';
import { Exoplanet } from '../types';

class ExoplantesAPI extends RESTDataSource {
    baseURL = 'https://api.arcsecond.io/';

    // não entendi o uso dessa query
    // mas fiz ela ser usada em suitablePlanets
    async getExoplanets(page: number = 1, size: number = 10): Promise<Exoplanet[]> {
        try {
            const { results } = await this.get<{ results: any[] }>('exoplanets', { page, page_size: size });

            const stations = await Station.find({
                // find the stations that are present in this request
                $or: results.map(planet => ({
                    planetName: planet.name
                }))
            });

            return results.map(({ name, mass }) => ({
                name,
                mass: this.normalizeMass(mass?.value, mass?.unit),
                hasStation: stations.map(station => station.planetName).includes(name),
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async suitablePlanets(pages: number = 10): Promise<Exoplanet[]> {
        try {
            // porque em vez de usarmos o mais "low-level" this.get
            // não usamos um método que já tá meio pronto pra gente que é o
            // getExoplanets?
            // ---
            // também do jeito que foi feito as requests tão sendo feitas sequencialmente
            // podemos fazê-las em paralelo para aumentar bastante a velocidade

            // Array.from({ length: 5 }) é como range(5)
            const exoplanetsRequests = Array.from({ length: pages }).map((_, i) => this.getExoplanets(i+1))

            // esperamos todas elas em paralelo
            const exoplanetsResponses = await Promise.all(exoplanetsRequests);

            // exoplanetsResponses é uma lista de listas de planetas
            // Exoplanet[][], precisamos "achatar" essa lista de listas
            // em uma lista grande com todos os elementos (.flat)
            // ---
            // também precisamos verificar se os planetas são "suitable" (.filter)
            return exoplanetsResponses.flat().filter(this.isPlanetSuitable);
        } catch (error) {
            console.log(error);
        }
    }

    private isPlanetSuitable(planet: Exoplanet): boolean {
        return planet.mass > 25
    }

    private normalizeMass(value?: number, unit?: string): number {
        if (unit !== 'M_jup') return 0;
        return value || 0;
    }
}

export default ExoplantesAPI;