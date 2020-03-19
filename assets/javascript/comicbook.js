// --------------------------------------------------------------ON PAGE LOAD---------------------------------------------
//empties previous comics, displays any previour search terms
$("#comic-div").empty();
$("#buybook-div").empty();
var pastsearch = JSON.parse(localStorage.getItem("pastsearch"));

if (Array.isArray(pastsearch)) {
  renderpastsearch(pastsearch)
};

//----------------------------------------------- create the list of past search terms to display----------------------------------------------------------------------

function renderpastsearch(list) {
  $("#searchterm-display").empty(); // empties out the html

  // render our past seaqrch terms to the page
  for (var i = 0; i < list.length; i++) {
    // Create a new variable that will hold a "<p>" tag.
    // Then set the search term "value" as text to this <p> element.
    var searchitem = $("<button>");
    searchitem.attr("class", "pastsearch");
    searchitem.attr("data-name", list[i]);
    searchitem.text(list[i]);
    // Add the button and to do item to the to-dos div
    $("#searchterm-display").append(searchitem);
  }
}
//--------------------------------ON CLICK SEARCH BUTTON FUNTCION-----------------------------------------------------------------------------------------

// Button for adding Search term, putting search term in array in local storage
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  // Grabs user input
  var searchTerm = $("#search-input").val().trim();

  // Load the search terms from localstorage.
  // We need to use JSON.parse to turn the string retrieved from an array into a string
  var pastsearch = JSON.parse(localStorage.getItem("pastsearch"));

  // Checks to see if the pastsearch exists in localStorage and is an array currently
  // If not, set a local list variable to an empty array
  // Otherwise list is our current list of searchterms
  if (!Array.isArray(pastsearch)) {
    pastsearch = [];
  }

  pastsearch.push(searchTerm);
  renderpastsearch(pastsearch);

  // Save the serch terms into localstorage.
  localStorage.setItem("pastsearch", JSON.stringify(pastsearch));

  $("#comic-div").empty();
  //runs searchComics function with calls to APIs
  searchComics(searchTerm);
  // Clears all of the text-boxes
  $("#search-input").val("");
});


//-----------------------------------Searches Past terms when clicked on----------------------------------------------------------------------------
$(document).on("click", ".pastsearch", function () {

  var searchTerm = $(this).attr("data-name")
  console.log(searchTerm)
  $("#comic-div").empty()
  searchComics(searchTerm);
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------








//------------------------------------------------------------ ajax call to comicbook + ebay APIs--------------------------------------------

//----------------------------------things left to do:
// 1. get URL, API key fro comic book URL and insert below - line 92
// 2. figure out which search terms we need to use and insert into fuction name and query url. "title" is used as a placeholder for now - line 87, 92
// 3. fill in "consturcting html containing comic information" section with relevant api data attributes - line 92+
// 4. update variable names in append function to match cariable created in step 3 - line 101 - 108
// 5. repeat for eBay API section (does it have to be the same search parameters as the first api? I'm confused) - lines 119, 128-129, 133
// 6. pray it works *fingers crossed emoji*
//--------------------------------------------------------------------------------------------------------------------------------





function searchComics(title) {



  //----------------------------------------------Comic Book API AJAX Call + append to HTML-------------------------------------------------

  // Querying the comicbooks api for the selected title, the ?app_id parameter is required, but can equal anything
  var ComicQueryURL = "https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/volumes/?api_key=6e5fe8ff3f6af8b73f1c2e7248c561c6e17d0feb&format=json&sort=name:asc&filter=name:" + title;
  $.ajax({
    url: ComicQueryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);

    // Constructing HTML containing the comic information

    //creates variable to hold the results array from the API response 
    var results = response.results;
    var exactComic = "";

    //loops through results array
    for (var i = 0; i < results.length; i++) {

      //finds exact comic title and gives it to exactComic variable to be used in eBay API call
      exactComic = results[i].name;

      //creates div to hold info from API
      var comicDiv = $("<div>");

      //creates <p> tag to hold name of comics
      var comicTitle = $("<h3>");

      //floats results to left to add them side by side

      //!!!---NEEDS TO BE FIXED, DOESN'T DISPLAY NAME ON PAGE---!!!
      comicTitle.text(results[i].name);

      //gives line break so name of comic isn't covered by picture of comic
      var brk = $("</br>");

      //creates <img> tag to hold images of the comic searched
      var comicImage = $("<img>")
      comicImage.attr("src", results[i].image.thumb_url);

      //appends the title(s), line break, and image(s) of comic(s) searched
      comicDiv.css("float", "left")
      comicDiv.css("margin-left", "15px")
      comicDiv.append(comicTitle);
      comicDiv.append(brk);
      comicDiv.append(comicImage);


      //appends comicDiv to comic div already in HTML

      $("#comic-div").append(comicDiv);

    }


  });
}


//-------------------------eBay API AJAX Call + append to HTML-------------------------------------------------------------


function searchListings(title) {
  // Querying the ebay api for the selected title, the ?app_id parameter is required, but can equal anything
  var EbayQueryURL = "https://open.api.ebay.com/shopping?callname=FindProducts&responseencoding=JSON&appid=TannerMi-ComicBoo-PRD-ad10d2f82-a53d4b9a&siteid=0&version=967&QueryKeywords=comicTitle" + title + "&AvailableItemsOnly=true";


  $.ajax({
    url: EbayQueryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);



    // Constructing HTML link/button containing link to buy book on ebay  
    // var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");

    // Empty the contents of the buybook-div, append the new buy book link
    $("#buybook-div").empty();
    $("#buybook-div").append(//goToArtist
    );
  });

}
