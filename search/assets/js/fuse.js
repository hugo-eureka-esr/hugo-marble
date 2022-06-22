import Fuse from "js/fuse/fuse.esm.min.js";

function search() {
  // get search query
  var url = new URL(window.location.href);
  var q = url.searchParams.get("q");
  var input = document.getElementById("search-input");
  input.value = q;

  // fetch search index
  fetch("/search/index.json").then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Can not fetch search index: " + response.status
      );
      return;
    }
    response
      .json()
      .then(function (pages) {
        var fuse = new Fuse(pages, {
          keys: ["title", "contents", "authors", "categories", "tags"],
        });
        var result = fuse.search(q);
        if (result.length > 0) {
          populateResults(q, result);
          console.log(result);
        } else {
          document.getElementById("search-results").innerHTML =
            '<div classs="my-8"><span id="search-results-empty">No matches found</span></div>';
        }
      })
      .catch(function (err) {
        console.log("Can not fetch search index: ", err);
      });
  });
}

function populateResults(query, results) {
  var searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  results.forEach(function (value, key) {
    console.log(key);
    console.log(value);
    var contents = value.item.contents;
    var title = value.item.title;
    var summary = value.item.summary;
    var permalink = value.item.permalink;

    var output = `<div id="search-result-${key}" class="my-8">
    <a href="${permalink}" class="no-underline">
    <h3 class="mt-0">${title}</h3>
    </a>
    <div>
    ${summary}
    </div>
    </div>`;
    searchResults.innerHTML += output;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  search();
});
