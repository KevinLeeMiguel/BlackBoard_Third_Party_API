var mongoose = require("mongoose");

var StudentSchema = new mongoose.Schema({
        studentId: String,
        names:String,
        email: String
});

module.exports = mongoose.model("Student",StudentSchema);