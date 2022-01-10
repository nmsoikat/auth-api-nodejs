const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Please provide your username"],
      minLength: [3, "Username supported minimum 3 character"],
      maxLength: [20, "Username supported maximum 20 character"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please provide your email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        8,
        "A user password must have more or equal than 8 character",
      ],
      select: false
    },
  },
  { timeStamps: true }
);


// Document Middleware
UserSchema.pre('save', async function(next){
  //if we do user save but no need to save or (bcrypt) the pass again
  if(!this.isModified('password')){
    next();
  }

  const salt = await bcryptjs.genSalt(12);
  this.password = await bcryptjs.hash(this.password, salt)
})


// Instance Method // all doc available
UserSchema.methods.matchPassword = async function(inputPassword) {
  return await bcryptjs.compare(inputPassword, this.password)
}

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
