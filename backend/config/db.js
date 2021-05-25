const mongoose = require("mongoose");
module.exports = {
	connectDb: async (url) => {
		try {
			await mongoose.connect(url, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			});
		} catch (error) {
			if (error) throw new Error(error.message);
		}
	},
};
