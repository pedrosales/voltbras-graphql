import mongoose, { Schema } from 'mongoose';

const Station = new Schema({
    name: String
});

export default mongoose.model('Station', Station);