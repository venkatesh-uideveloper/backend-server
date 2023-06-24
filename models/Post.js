const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  //   text: {
  //     type: String,
  //     required: true,
  //   },
  name: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },

  // avatar: {
  // 	type: String,
  // },
  // likes: [
  // 	{
  // 		user: {
  // 			type: Schema.Types.ObjectId,
  // 			ref: 'users',
  // 		},
  // 	},
  // ],
  // comments: [
  // 	{
  // 		user: {
  // 			type: Schema.Types.ObjectId,
  // 			ref: 'users',
  // 		},
  // 		text: {
  // 			type: String,
  // 			required: true,
  // 		},
  // 		name: {
  // 			type: String,
  // 		},
  // 		avatar: {
  // 			type: String,
  // 		},
  // 		date: {
  // 			type: Date,
  // 			default: Date.now,
  // 		},
  // 	},
  // ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post", PostSchema);
