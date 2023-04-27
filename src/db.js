import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://db/admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
            user: 'root',
            pass: 'example',
            //useMongoClient: true,
            //auth: { "authSource": "admin" }
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Print db stats
        const dbStats = await mongoose.connection.db.stats();
        console.log(`MongoDB stats: ${JSON.stringify(dbStats)}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


export default connectDB;