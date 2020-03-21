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
// 1. get links to create buttons and append to each comic
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
    var bookLink = "";

    if (results.number_of_total_results > 0) {
    //loops through results array
    for (var i = 0; i < results.length; i++) {

      //finds exact comic title and gives it to exactComic variable to be used in eBay API call
      exactComic = results[i].name;

      //creates div to hold info from API
      var comicDiv = $("<div>");

      //gives class to comicDiv
      comicDiv.addClass("each-comic");

      //creates <p> tag to hold name of comics
      var comicTitle = $("<h5>");

      //!!!---NEEDS TO BE FIXED, DOESN'T DISPLAY NAME ON PAGE---!!!
      comicTitle.text(results[i].name);

      //gives line break so name of comic isn't covered by picture of comic
      var brk = $("</br>");

      //creates <img> tag to hold images of the comic searched
      var comicImage = $("<img>")
      comicImage.attr("src", results[i].image.thumb_url);

      //creates <p> tag to hold number of issues for each title
      var comicIssuesNumber = $("<p>");

      //gives class to comicIssuesNumber
      comicIssuesNumber.addClass("issues-number");

      comicIssuesNumber.text("Number of Issues:" + results[i].count_of_issues);

      var comicDetails = $("<a>");
      comicDetails.attr("href", results[i].site_detail_url);
      comicDetails.addClass("comic-info")
      comicDetails.text("Click Here for more Info about This Title")

      searchListings(exactComic);

      //creates <p> tag to hold link to eBay
      var comicBookLink = $("<a>");
      //comicBookLink.attr("href", "https://www.ebay.com");
      comicBookLink.addClass("buy-book")
      console.log(comicBookLink);
      comicBookLink.text("Click Here to Buy!");

      //appends the title(s), line break, and image(s) of comic(s) searched
      comicDiv.append(comicTitle);
      comicDiv.append(brk);
      comicDiv.append(comicImage);
      comicDiv.append(brk);
      comicDiv.append(comicIssuesNumber);
      comicDiv.append(comicBookLink);
      comicDiv.append(brk);
      comicDiv.append(brk);
      comicDiv.append(comicDetails);


      //appends comicDiv to comic div already in HTML
      $("#comic-div").append(comicDiv);

    }

  } else {

    var noResultsDiv = $("<div>");

    var noResults = $("<h3>");

    noResults.text("Sorry, no results were found. Please try again!");

    noResultsDiv.append(noResults);
    console.log(noResultsDiv);

    $("#comic-div").append(noResultsDiv);

  }


  });
}


//-------------------------eBay API AJAX Call + append to HTML-------------------------------------------------------------



function searchListings(title) {
  // Querying the ebay api for the selected title, the ?app_id parameter is required, but can equal anything
  var EbayQueryURL = "https://open.api.ebay.com/shopping?callname=FindProducts&responseencoding=JSON&appid=TannerMi-ComicBoo-PRD-ad10d2f82-a53d4b9a&siteid=0&version=967&QueryKeywords=" + title;


  $.ajax({
    url: EbayQueryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console

    //parses response and sets it to text variable
    var text = JSON.parse(response)
    console.log(text);

    //looks through text.Ack to see if the value is Success, then look through text.Product array
    if (text.Ack === "Success") {

      //loops through text.Product array
      for (var i = 0; i < text.Product.length; i++) {

        //sets productObject button to text.Product at the index 0
        var productObject = text.Product[0];

        //sets itemLink variable to the value of productObject.DetailsURL
        var itemLink = productObject.DetailsURL;

        bookLink = itemLink
        console.log(bookLink);
        $(document).find(".buy-book").attr("href", bookLink)
      }

    } else {

      $(document).find(".buy-book").attr("href", "#")
      bookLink = "#";
      //console.log(bookLink)

    }


  });

}
