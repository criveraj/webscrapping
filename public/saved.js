
$(document).ready(function() {
    
    var articleContainer = $(".article-container");
    // Managing the On Click events
    $(document).on("click", ".btn.delete", deleteArticle);
    $(document).on("click", ".btn.notes", getArticleNotes);
    $(document).on("click", ".btn.save", saveNote);
    $(document).on("click", ".btn.note-delete", deleteNote);

    
    getSavedArticles();
  
    //Function to get the saved Articles from the DB
    function getSavedArticles () {
      // Empty the article container, run an AJAX request for any saved articles
      articleContainer.empty();
      $.get("/saved").then(function(data) {
        
        if (data && data.length) {
          renderArticles(data);
        }
      });
    }
  
    // Function to render the Articles
    function renderArticles(articles) {
      
      var articlePanels = [];
      for (var i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
      }
      articleContainer.append(articlePanels);
    }
  
    // Function to create the panels wjere the articles will go
    function createPanel(article) {
      
      var panel = $(
        [
          "<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
          "<a class='article-link' target='_blank' href='" + article.link + "'>",
          article.title,
          "</a>",
          "<a class='btn btn-danger delete'>",
          "Delete From Saved",
          "</a>",
          "<a class='btn btn-info notes'>Article Notes</a>",
          "</h3>",
          "</div>",
          "<div class='panel-body'>",
          article.title,
          "</div>",
          "</div>"
        ].join("")
      );
      
      panel.data("_id", article._id);
      return panel;
    }
    
    // Function to render the notes of the Article
    function renderNotesList(data) {
      console.log("rendering notes");
      var notesToRender = [];
      
        console.log(data.notes);
        data.notes.notes.map(function(value){
          console.log(value);
          var currentNote = $(
            [
              "<li class='list-group-item note'>",
              value.noteText,
              "<button class='btn btn-danger note-delete'>x</button>",
              "</li>"
            ].join("")
          );
         console.log(currentNote)
          currentNote.children("button").data("_id", value._id);
          notesToRender.push(currentNote);
          console.log("notes to render: " +notesToRender) 
        })
   
      //  }
      $(".note-container").append(notesToRender);
    }
  

  // Function to get the Article Notes and render them
    function getArticleNotes() {
      console.log(" in get Artticle Notes");
      var currentArticle = $(this).parents(".panel").data();
      
      $.get("/notes/" + currentArticle._id).then(function(data) {
        console.log("notes of article: "+ currentArticle._id + "are" + data);
        var modalText = [
          "<div class='container-fluid'>",
          "<h4>Notes For Article: ",
          currentArticle._id,
          "</h4>",
          "<hr />",
          "<ul class='list-group note-container'>",
          "</ul>",
          "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
          "<button class='btn btn-success save'>Save Note</button>",
          "</div>"
        ].join("");
        
        bootbox.dialog({
          message: modalText,
          closeButton: true
        });
        var noteData = {
          _id: currentArticle._id,
          notes: data || []
        };
        console.log("note Data" + noteData);
        $(".btn.save").data("article", noteData);
        renderNotesList(noteData);
      });
    }
  
    // Function to save the notes
    function saveNote() {
      var noteData;
      var newNote = $(".bootbox-body textarea").val().trim();
      
      if (newNote) {
        noteData = {
          noteText: newNote
        };
        $.post("/notes/" + $(this).data("article")._id, noteData).then(function() {
          // When complete, close the modal
          bootbox.hideAll();
        });
      }
    }
  
    // Function to delete the notes
    function deleteNote() {
      
      var noteToDelete = $(this).data("_id");
      
      $.ajax({
        url: "/notes/" + noteToDelete,
        method: "DELETE"
      }).then(function() {
        // When done, hide the modal
        bootbox.hideAll();
      });
    }

    // Function to delete Articles
    function deleteArticle() {
      var articleToDelete = $(this).parents(".panel").data();
    
      $.ajax({
        method: "DELETE",
        url: "/articles/" + articleToDelete._id
      }).then(function(data) {
  
        if (data === "article deleted") {
            getSavedArticles();
        }
      });
    }
  });

  
  