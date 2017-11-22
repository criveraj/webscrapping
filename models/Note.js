// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Note schema
var NoteSchema = new Schema({
    noteText: {
    type: String
  }
});

// Since Mongoose will automatically save the ObjectIds of the notes
// I will refer to them in the Article model

// model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
