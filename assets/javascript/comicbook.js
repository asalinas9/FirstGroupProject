
// ---------------------------------------------------------------------------things needed in HTML file-------------------------------

// <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-database.js"></script>
//button with id #search-button
//form with id #search-input
//table with id #searchterm-table
//div with id #comic-div
//div within or near comic-div with id #buybook-div

//-----------------------------------------------------------------questions-----------------------------------------------------------------
// do we need to do anything special bc there are 2 different APIs? maybe create separate functions?



// --------------------------------------------------------------Firebase, adding search term to DB and pulling to HTML---------------------------------------------
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAD8D_DS1TRkJXkWT4g_Y57Itjw_oIcpwU",
  authDomain: "comic-book-search.firebaseapp.com",
  databaseURL: "https://comic-book-search.firebaseio.com",
  projectId: "comic-book-search",
  storageBucket: "comic-book-search.appspot.com",
  messagingSenderId: "167980205893",
  appId: "1:167980205893:web:1df86c3da4a161ef7da02c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
// Button for adding Search term
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  // Grabs user input
  var searchTerm = $("#search-input").val().trim();
  // Creates local "temporary" object for holding search term data
  var newSearch = {
    searchterm: searchTerm
  };
  // Uploads search term data to the database
  database.ref().push(newSearch);
  // Logs everything to console
  console.log(newSearch.searchterm);
  //
  //runs searchComics function with calls to APIs
  searchComics(searchTerm);
  // Clears all of the text-boxes
  $("#search-input").val("");
});

//Create Firebase event for adding search term  to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());
  // Store everything into a variable.
  var searchTerm = childSnapshot.val().searchterm;
  // Log search term Info
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(searchTerm),
  );
  // Append the new row to the table
  $("#searchterm-table > tbody").append(newRow);
});

//---------------------------------------------------------------------------------------------------------------------------------------end  of firebase functions---------








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
  var ComicQueryURL = "https://comicvine.gamespot.com/api/volumes/?api_key=6e5fe8ff3f6af8b73f1c2e7248c561c6e17d0feb&format=json&sort=name:asc&filter=name:" + title;
  $.ajax({
    url: ComicQueryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);

    // Constructing HTML containing the comic information

    //creates variable to hold the results array from the API response 
    var results = response.results;

    //loops through results array
    for (var i = 0; results.length; i++) {

      //creates div to hold info from API
      var comicDiv = $("<div>");

        //creates <p> tag to hold name of comics
        var comicTitle = $("<p>");

        //!!!---NEEDS TO BE FIXED, DOESN'T DISPLAY NAME ON PAGE---!!!
        comicTitle.attr("src", results[i].name);

        //gives line break so name of comic isn't covered by picture of comic
        var brk = $("</br>");

        //creates <img> tag to hold images of the comic searched
        var comicImage = $("<img>") 
        comicImage.attr("src", results[i].image.icon_url);

        //appends the title(s), line break, and image(s) of comic(s) searched
        comicDiv.append(comicTitle);
        comicDiv.append(brk);
        comicDiv.append(comicImage);
        
        //appends comicDiv to comic div already in HTML
        $("#comic-div").empty();
        $("#comic-div").append(comicDiv);
    }

  });

  //-------------------------eBay API AJAX Call + append to HTML-------------------------------------------------------------

  // Querying the ebay api for the selected title, the ?app_id parameter is required, but can equal anything
  var EbayQueryURL = "**ADD ebay api url here" + title + "**End ebay url with api key**";
  $.ajax({
    url: EbayQueryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);

    // Constructing HTML link/button containing link to buy book on ebay  
    var buyButton = $("<button>");
    buyButton.addClass("buyingButton");
    buyButton.text("Click here to buy!");

    // Empty the contents of the buybook-div, append the new buy book link
    $("#buybook-div").empty();
    $("#buybook-div").append(buyButton);
  });

}



