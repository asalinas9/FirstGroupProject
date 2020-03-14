// Links for HTML file
// <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-database.js"></script>
//button with id #search-button
//form with id #search-input
//table with id #searchterm-table

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
$("#search-btn").on("click", function(event) {
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


  // Clears all of the text-boxes
  $("#search-input").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var searchTerm = childSnapshot.val().searchterm;

  // Log search term Info
  console.log(searchTerm);


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(searchTerm),

  );

  // Append the new row to the table
  $("#searchterm-table > tbody").append(newRow);
});

