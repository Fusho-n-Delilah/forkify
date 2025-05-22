import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');


    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        });
    }
    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const curPage = this._data.resultsPage;

        // page 1: and there are other pages
        if(curPage === 1 && numPages > 1){
            return this._generateMarkupButton('next', curPage);
        }
        
        // last page
        if (curPage === numPages && numPages > 1){
            return this._generateMarkupButton('prev', curPage);
        }
        
        //pages > 1 AND not last page
        if (curPage < numPages){
            return this._generateMarkupButton('next', curPage).concat(this._generateMarkupButton('prev', curPage));
        }

        // page 1: and no other pages
        return '';
    }

    _generateMarkupButton(type, curPage){
        if(type === 'next'){
            return `
                <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button> 
            `;
        }
        if(type === 'prev'){
            return `
                <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
        }
    }
}

export default new PaginationView();

/*
<button class="btn--inline pagination__btn--prev">
<svg class="search__icon">
    <use href="src/img/icons.svg#icon-arrow-left"></use>
</svg>
<span>Page 1</span>
</button>
<button class="btn--inline pagination__btn--next">
<span>Page 3</span>
<svg class="search__icon">
    <use href="src/img/icons.svg#icon-arrow-right"></use>
</svg>
</button> 
*/