const mongoose = require("mongoose");
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, connectionOptions, (err) => {
    if(!err) {
        console.log('Database Connected!')
    } else{
        console.log(err)
    }
});
mongoose.Promise = global.Promise;

module.exports = {
    Cache: require("../cache-management/cache-management.model")
};
