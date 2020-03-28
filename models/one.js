var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/one", { useNewUrlParser: true ,  useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;

module.exports.data = require("./two")