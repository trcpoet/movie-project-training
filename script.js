// // Titles: https://omdapi.com/?s=thor&page=1&apikey=fc1fef96
// // details: https://www.omdapi.com/?i=tt3896198&apikey=fc1fef96

// // https://www.omdbapi.com/?apikey=f779596&s=thor => results in thor movies 
// // https://www.omdbapi.com/?apikey=f779596&s=thor&page=2 => results in thor movies page 2
// // https://www.omdbapi.com/?apikey=f779596&s=fast => results in every movie with fast in it
// // http://www.omdbapi.com/?i=tt2705436&apikey=fc1fef96 => resukts for spiderman and similar

// // http://www.omdbapi.com/?apikey=[yourkey]&
// const apiKey = 'f779596';


// const movieSearchBox = document.getElementById('movie-search-box');
// const searchList = document.getElementById('search-list');
// const resultGrid = document.getElementById('result-grid');

// //Load movies from API
// async function loadMovies(searchTerm){
//     const URL = `https://www.omdbapi.com/?apikey=f779596&s=${searchTerm}`;
//     const res = await fetch(`${URL}`);
//     const data = await res.json();
//     // console.log(data.Search);
//     if(data.Response === "True") displayMovieList(data.Search);
// }

// function findMovies(){
//     let searchTerm = (movieSearchBox.value).trim()
//     // console.log(searchTerm);
//     if(searchTerm.length > 0) {
//         // show the dropdown
//         searchList.classList.remove('hide-search-list');
//         //fetch the matching titles
//         loadMovies(searchTerm);
//     } else {
//         //hide the dropdown if the box is empty
//         searchList.classList.add('hide-search-list');
//     }
// }
// // wired up via onkeyup="findMovies()" on the <input>

// function displayMovieList(movies){
//     searchList.innerHTML = "";
//     for(let idx = 0; idx< movies.length; idx++){
//         let movieListItem = document.createElement('div')
//         // console.log(movieListItem)
//         movieListItem.dataset.id = movies[idx].imdbID; 
//         //setting movie id in data id
//         movieListItem.classList.add('search-list-item');
//         if(movies[idx].Poster != "N/A")
//             moviePoster = movies[idx].Poster;
//         else 
//             moviePoster = "image_not_found.png";

//         movieListItem.innerHTML = `
//                 <div class="search-item-thumbnail">
//                     <img src="${moviePoster}"      onerror="this.src='image_not_found.png';" alt=""  >
//                 </div>
//                 <div class="search-item-info">
//                     <h3>${movies[idx].Title}</h3>
//                     <p>${movies[idx].Year}</p>
//                 </div>
//                 `;
//                 searchList.appendChild(movieListItem);
//     }
//     loadMovieDetails();
// }

// function loadMovieDetails() {
//     const searchlistMovies = searchList.querySelectorAll('.search-list-item');
//     searchlistMovies.forEach(movie => {
//         //When the user clicks this particular movie in the dropdown, run the following async function.
//         movie.addEventListener('click', async() => {
//             // Hide the dropdown
//             searchList.classList.add('hide-search-list');
//             // Clear the input
//             movieSearchBox.value = " ";

//             //fetch full details over https, injecting your api key
//             const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${apiKey}`);
//             const movieDetails = await result.json();
//             // console.log(movieDetails);
//             displayMovieDetails(movieDetails);
//         });
//     });
// }

// function displayMovieDetails(details) {
//     resultGrid.innerHTML = `
//         <div class="movie-poster">
//             <img src="${(details.Poster != "N/A") ? details.Poster :
//                 "image_not_found.png"
//             }" alt="movie poster">
//         </div>
//         <div class="movie-info">
//             <h3 class="movie-title">${details.Title}</h3>
//             <ul class="movie-misc-info">
//                 <li class="year">${details.Year}</li>
//                 <li class="rated">${details.Rated}</li>
//                 <li class="released">${details.Released} </li>
//             </ul>
//             <p class="genre"><b>Genre: </b> ${details.Genre}</p>
//             <p class="writer"><b>Writer: </b>${details.Writer}</p>
//             <p class="actors"><b>Actors: </b>${details.Actors}</p>
//             <p class="plot"><b>Plot: </b>${details.Plot}</p>
//             <p class="language"><b>Language: </b>${details.Language}</p>
//             <p class="awards"><b><i class ="fas fa-award"></i></b>${details.Awards}</p>
//             <!-- Starts editing css here -->
//         </div>
    
//     `;
// }

// window.addEventListener('click',(event) => {
//     if(event.target.className != "form-control") {
//         searchList.classList.add('hide-search-list');
//     }
// })

const sortSelect  = document.getElementById('sort-select');
let   lastResults = [];   // will hold the raw array from OMDb

const apiKey = 'f779596';
const form    = document.getElementById('search-form');
const input   = document.getElementById('search-input');
const reset   = document.getElementById('reset-button');
const cardsEl = document.getElementById('movies-container');

// 1) Search handler
form.addEventListener('submit', async e => {
  e.preventDefault();
  const term = input.value.trim();
  if (!term) return;


  // 2) Fetch up to 6 movies
  const url  = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(term)}`;
  //fetch(url) initiates an HTTP GET request to the OMDb API endpoint you constructed.
  const res  = await fetch(url);
  //res.json() reads the rae response body() (a JSON string) and parses it into a JavaScript object.
  const data = await res.json();
//Why separate steps?
// await fetch gives you the response headers and status.
// await res.json() gives you the actual data payload.




  // 3) Render cards or “no results”
  if (data.Response === 'True') {
    //STORE the results for sorting
    lastResults = data.Search;
//lastResults = data.Search;
//data.Search is the array of movie summaries ({ Title, Year, imdbID, Poster, Type }).
//We store the entire array in lastResults so that later, when the user picks a sort option, we have the original data to reorder—without hitting the API again.

// displayMovies(lastResults);
// Invokes your helper function that:
// Takes the first six items from the array (slice(0,6)).
// Creates a <div class="movie-card"> for each.
// Fills in an <img>, <h3>, and <p>.
// Appends those to cardsEl.
// Result: The user sees six movie cards laid out in your grid.
    //RENDER THE FIRST 6
    displayMovies(lastResults);
  } else cardsEl.innerHTML = '<p class="no-results">No results found.</p>';
});

// 4) Reset handler
reset.addEventListener('click', () => {
  input.value = '';
  cardsEl.innerHTML = '';
  sortSelect.value = ''; //resets the sort dropdown
});


//Sorting logic — run whenever the user picks a sort order
// 1) Watch for when the user picks a sort option
//addEventListener('change', …) means “run this code any time the dropdown’s value changes.”
sortSelect.addEventListener('change', () => 
// 2) If we haven’t done a search yet, there’s nothing to reorder
// lastResults.length is zero until you’ve stored at least one API result.
//return here stops the function early—no sorting happens.
{
  if (!lastResults.length) return;

  // Shallow copy so we don’t mutate the original
  // 3) Make a fresh copy of the movies array
  const sorted = [...lastResults];
  //The spread operator ([...]) clones the array.
  //Why not sort lastResults directly? So we keep the original order untouched—useful if the user switches back to “<no sort>.”

  //4) Check which direction was selected
  if (sortSelect.value === 'year-asc') {
    //Old → New: earliest year first
    sorted.sort((a, b) => 
      parseInt(a.Year) - parseInt(b.Year)
  );
  }
    //New → Old: latest year first
  else if (sortSelect.value === 'year-desc') {
    sorted.sort((a, b) => 
      parseInt(b.Year) - parseInt(a.Year)
  );
  }
  else {
    // “<empty>” selection: restore original order
    //5) If they pick the “no sort” placeholder, show original order
    return displayMovies(lastResults);
  }
  // Re-render the cards in sorted order
  // 6) Finally, redraw the cards in the new order
  displayMovies(sorted);
});


// 5) Build and append movie cards
function displayMovies(movies) {

  //Clear display area: so old cards don't hang around. Setting .innerHTML = '' wipes out every child of the container, giving you a fresh canvas.
  cardsEl.innerHTML = '';

  //Grab only the first six. .slice(0, 6) makes a new array containing items at indexes 0 through 5.
  movies.slice(0, 6).forEach(m => {

    // Build a card wrapper
    //We create a <div> in memory (not yet on the page) and give it the CSS class movie-card, so it automatically picks up your styling (background, padding, shadows, hover effects).
    const card = document.createElement('div');
    card.className = 'movie-card';

    //Choose a poster image
    const poster = m.Poster !== 'N/A'
      ? m.Poster
      : 'image_not_found.png';

    //Fill the card’s HTML
    card.innerHTML = `
      <img 
        src="${poster}" 
        alt="${m.Title}" 
        onerror="this.src='image_not_found.png'" 
      />
      <h3>${m.Title}</h3>
      <p>${m.Year}</p>
    `;
    //Add the card to the page: appendChild moves our newly built <div> into the DOM under cardsEl. Repeat this for each of the six movies.
    cardsEl.appendChild(card);
  });
}


// Why practice this pattern?
// Separation of concerns:
// The rest of your code handles fetching and sorting.
// displayMovies only deals with rendering.

// Performance:
// Clearing once up front avoids expensive DOM operations per card.
// Creating elements in memory and then appending them minimizes reflows.

// Simplicity and readability:
// Using descriptive names (card, poster, movies.slice) makes the logic obvious at a glance.
// The template literal keeps your HTML structure clean and maintainable.

// By following these steps—clear, slice, create, fill, append—you get a robust, 
// reusable function that cleanly lays out your top six movie cards every time you invoke it.