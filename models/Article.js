// Require mongoose
var mongoose = require("mongoose");
// Schema class with Mongoose
var Schema = mongoose.Schema;

// Article schema
var ArticleSchema = new Schema({
   title: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
  
  saved:{
    type: Boolean,
    required: true
  },

  // Array to save the notes to the article, ref refers to the Note model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

//  Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
