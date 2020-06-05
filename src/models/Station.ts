import mongoose, { Schema, Document } from 'mongoose';

const StationSchema = new Schema({
    planetName: String
});

// agora vamos ter que uma estação
// é tipada com um .planetName string
interface Station extends Document {
    planetName: string;
}

export default mongoose.model<Station>('Station', StationSchema);