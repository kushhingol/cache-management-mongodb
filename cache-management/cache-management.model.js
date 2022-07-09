const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const utilsService = require("../_helpers/utils")

const schema = new Schema({
  key: { type: String, unique: true, required: true },
  value: { type: Object, required: true },
  expiresAt: {
    type: Date,
    default: function () {
      return utilsService.getExpirationTime();
    },
  },
});


schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.value;
  },
});

module.exports = mongoose.model("Cache", schema);
