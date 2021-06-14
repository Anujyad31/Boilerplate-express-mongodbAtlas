var mongoose = require('mongoose');
const config =require('config');

//Set up default mongoose connection (by taking mongoURI from default.json)
var mongoDB = config.get('mongoURI');

//making connectDB method that is being exported and used in server.js
const connectDB = async () => {
	try {
		await mongoose.connect(mongoDB,()=>{
            console.log("MongoDB connected");
        })

	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;