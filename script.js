// Titles: https://omdapi.com/?s=thor&page=1&apikey=fc1fef96
// details: https://www.omdapi.com/?i=tt3896198&apikey=fc1fef96

// https://www.omdbapi.com/?apikey=f779596&s=thor => results in thor movies 
// https://www.omdbapi.com/?apikey=f779596&s=thor&page=2 => results in thor movies page 2
// https://www.omdbapi.com/?apikey=f779596&s=fast => results in every movie with fast in it
// http://www.omdbapi.com/?i=tt2705436&apikey=fc1fef96 => resukts for spiderman and similar

// http://www.omdbapi.com/?apikey=[yourkey]&

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

//Load movies from API
async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?apikey=f779596&s=${searchTerm}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response === "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim()
    // console.log(searchTerm);
    if(searchTerm.length > 0) {
        // show the dropdown
        searchList.classList.remove('hide-search-list');
        //fetch the matching titles
        loadMovies(searchTerm);
    } else {
        //hide the dropdown if the box is empty
        searchList.classList.add('hide-search-list');
    }
}
// wired up via onkeyup="findMovies()" on the <input>

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx< movies.length; idx++){
        let movieListItem = document.createElement('div')
        // console.log(movieListItem)
        movieListItem.dataset.id = movies[idx].imdbID; 
        //setting movie id in data id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
                <div class="search-item-thumbnail">
                    <img src="${moviePoster}"      onerror="this.src='image_not_found.png';" alt=""  >
                </div>
                <div class="search-item-info">
                    <h3>${movies[idx].Title}</h3>
                    <p>${movies[idx].Year}</p>
                </div>
                `;
                searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchlistMovies = searchList.querySelectorAll('.search-list-item');
    searchlistMovies.forEach(movie => {
        //When the user clicks this particular movie in the dropdown, run the following async function.
        movie.addEventListener('click', async() => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = " ";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster :
                "image_not_found.png"
            }" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">${details.Year}</li>
                <li class="rated">${details.Rated}</li>
                <li class="released">${details.Released} </li>
            </ul>
            <p class="genre"><b>Genre: </b> ${details.Genre}</p>
            <p class="writer"><b>Writer: </b>${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot: </b>${details.Plot}</p>
            <p class="language"><b>Language: </b>${details.Language}</p>
            <p class="awards"><b><i class ="fas fa-award"></i></b>${details.Awards}</p>
            <!-- Starts editing css here -->
        </div>
    
    `;
}

window.addEventListener('click',(event) => {
    if(event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
})