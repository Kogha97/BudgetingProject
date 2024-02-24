import mongoose from 'mongoose'

export default async function connect(){
    try {
        
        await mongoose.connect(process.env.DB_URI);
        console.log('connected to database');

    } catch (error) {
        console.log('error connecting to database:', error.message)
    }
}