class SearchView{
    _parentElement = document.querySelector('.search');
    _searchInput = document.querySelector('.search__field');
    _searchButton = document.querySelector('.search__btn');

    getQuery(){
        const query = this._searchInput.value;

        this._clearInput();

        return query;
    }

    addHandlerSearch(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }

    _clearInput(){
        this._searchInput.value = '';
    }
}
export default new SearchView();