import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling everything
import 'regenerator-runtime/runtime'; // polyfilling async/await

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

// if(module.hot){
//   module.hot.accept();
// }

///////////////////////////////////////
const controlRecipes = async function () {
  const id = window.location.hash.slice(1);

  if(!id) return;

  try {
    // loading the recipe
    recipeView.renderSpinner();

    // updating results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // load recipe from model
    await model.loadRecipe(id);
    const {recipe} = model.state.recipe;
    // Rendering the recipe
    recipeView.render(model.state.recipe);
    
    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};
// controlRecipes();

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();

    // get the query from the view
    const query = searchView.getQuery();

    if(!query) return;

    // loading the search results;
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.getSearchResultsPage(1));
    

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch(err){
    console.log(err);
  }
}

const controlPagination = function(page){
    // render results
    resultsView.render(model.getSearchResultsPage(page));

    // render initial pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){

  // add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // close form window
    setTimeout(function(){addRecipeView.toggleWindow()}, MODAL_CLOSE_SEC * 1000);

    // render success message
    addRecipeView.renderMessage();

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

  } catch(err){
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function (){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks');
  location.reload();
}

