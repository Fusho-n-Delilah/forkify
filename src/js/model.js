import {async} from 'regenerator-runtime';
import {API_URL, RES_PER_PAGE, KEY} from './config.js';
import {AJAX} from './helpers.js';
import { title } from 'process';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPage: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: [],
};

const createRecipeObject = function(data){
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...[recipe.key && {key: recipe.key}],
    };
}

export const loadRecipe = async function(id){
    try{
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

        const recipe = createRecipeObject(data);
        state.recipe = recipe;

        if(state.bookmarks.some(bookmark => bookmark.id === recipe.id)){
            state.recipe.bookmarked = true;
        }
    } catch(err){
        throw err;
    }
};

export const loadSearchResults = async function(query){
    try{
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        const {recipes} = data.data;

        state.search.query = query;
        state.search.results = recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...[rec.key && {key: rec.key}],
            }
        });
        state.search.resultsPage = 1;
    } catch(err){
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.resultsPage){
    state.search.resultsPage = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing =>{
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    });

    state.recipe.servings = newServings;
};

const _persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe);

    // mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    _persistBookmarks();
}

export const deleteBookmark = function(id){
    // delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    if(state.recipe.id === id) state.recipe.bookmarked = false;

    _persistBookmarks();
};

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());

                if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format.')

                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                }
            });  
        
        const uploadRecipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        
        const responseData = await AJAX(`${API_URL}?key=${KEY}`, uploadRecipe);
        state.recipe = createRecipeObject(responseData);
        this.addBookmark(state.recipe);

    } catch(err){
        throw err;
    }

}

const init = function(){
    const storage = localStorage.getItem('bookmarks');

    if(storage) state.bookmarks = JSON.parse(storage);
}
init();