
const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

async function getShowsByTerm(query) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const resObj = await axios.get(`https://api.tvmaze.com/search/shows`, {params: {q:query}} );
  const output = [];
  for (let obj of resObj.data){
    const loopObj = {};
    loopObj["id"] = obj.show.id; 
    loopObj["name"] = obj.show.name; 
    loopObj["summary"] = obj.show.summary; 
    try{
      loopObj["image"] = obj.show.image.medium;
    }
    catch{
      loopObj["image"] = "https://tinyurl.com/tv-missing";
    }
    output.push(loopObj);
  }
  return output;
};

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}"
              alt="${show.name}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
};

async function searchForShowAndDisplay() {
  let term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  $("#search-query").val("");
};

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShow(id) { 
  const resObj = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const output = [];
  for (let show of resObj.data){
    const loopObj = {};
    loopObj["id"]= show.id;
    loopObj["season"]= show.season;
    loopObj["number"]= show.number;
    loopObj["name"]= show.name;
    output.push(loopObj);
  }
  return output;
};

function populateEpisodes(episodesObj) { 
  $episodesArea.empty();
  $episodesArea.append("<h2>List of episode names</h2> <br>")
  for (let episode of episodesObj){
    const $episode = $(
      `<li>${episode.name} (Season ${episode.season}, number ${episode.number})</li>`);
      $episodesArea.append($episode);
  }
  $episodesArea.show();
 };

$showsList.on("click", ".Show-getEpisodes", async function(evt){
  evt.preventDefault();
  showId = $(this).parent().parent().parent().data().showId;
  episodesObj = await getEpisodesOfShow(showId);
  console.log(episodesObj);
  populateEpisodes(episodesObj); //... in process
});



