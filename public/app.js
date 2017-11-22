$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $(".articles-container");
  $(document).on("click", ".btn.save", saveArticle);
  $(document).on("click", ".scrape-new", scrapeArticles);

  // Grab the articles as a json
   
  function scrapeArticles() {
    console.log('In Scrape Articles');
    // This function handles the user clicking any "scrape new article" buttons
    $.getJSON("/scrape", function(data) {
      
      console.log('Scrape Articles - getting JSon');
      displayArticles(data);
      
    });
  }; //End function scrape Articles

  function displayArticles(articles) {
      // Empty the article container
      console.log('in displayArticles fuction');
      articleContainer.empty();
      renderArticles(articles);
  }

  function renderArticles(articles) {
    console.log('in renderArticles fuction');
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articlePanels = [];
    
    // We pass each article JSON object to the createPanel function which returns a bootstrap
    // panel with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array,
    // append them to the articlePanels container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    console.log('...creating panels');
    // This functiont takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article panel
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.link + "'>",
        article.title,
        "</a>",
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.title,
        "</div>",
        "</div>"
      ].join("")
    );
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

});

function saveArticle() {
  console.log(" I enter saveArticle");

  var articleToSave = $(this).parents(".panel").data();
  articleToSave.saved = true;
  var thisId = articleToSave._id;

  console.log(articleToSave);
  
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: articleToSave
  }).then(function(data) {
    
    if (data.ok) {
      // This will reload the articles the user have not save
      console.log("article" + thisId + "saved")
      RenderArticlesNotSaved();
    }
  });
}

function RenderArticlesNotSaved() {
  // Empty the article container, run an AJAX request for any unsaved headlines
  articleContainer.empty();
  $.get("/articles?saved=false").then(function(data) {
    // If we have headlines, render them to the page
    if (data && data.length) {
      renderArticles(data);
    }
  });
}

