import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = '30096980-3a3c0320a6f5f515df3804209';

const formRef = document.querySelector(".search-form");
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

const input = formRef.elements.searchQuery;

formRef.addEventListener('submit', handlerFormSubmit);
btnRef.addEventListener('click', onClickLoadMore);

btnRef.style.opacity = 0;
let pageNumber = null;
const lightbox = new SimpleLightbox('.gallery a');  

async function handlerFormSubmit(e) {
    e.preventDefault();
    btnRef.style.opacity = 0;
    pageNumber = 1
    galleryRef.innerHTML = '';
    
    try {
        if (input.value === '') {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            return;
        }            
        const data = await getData(pageNumber);
        if (data.hits.length === 0  ) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        render(data);
        Notiflix.Notify.success(`Hooray. We found ${data.totalHits} images`);
    }
    catch(error)    {
        console.log(error, "Что-то пошло не так");        
    }   
      
    btnRef.style.opacity = 1;   
}

async function onClickLoadMore() {
    btnRef.style.opacity = 0;
    pageNumber += 1;
    
    try {
        const data = await getData(pageNumber);
        if (data.hits.length === 0) { 
            btnRef.style.opacity = 0;
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            return;
        }
        
        render(data);        
    }
    catch (error) {
        console.log(error);        
    }   
    
    btnRef.style.opacity = 1;
        
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}

function render(data) {       
    const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
         return `<div class="photo-card"><a class="link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
           <div class="info"><p class="info-item"><b>Likes</b>${likes}</p><p class="info-item"><b>Views</b>${views}</p>
           <p class="info-item"><b>Comments</b>${comments}</p><p class="info-item"><b>Downloads</b>${downloads}</p></div></div>`
    }).join("");         
    
    galleryRef.insertAdjacentHTML("beforeend", markup);
       
    lightbox.refresh();    
}

async function getData(pageNum) {
    const url =
        `${BASE_URL}?key=${API_KEY}&q=${input.value}&image_type=photo&safesearch=true&orientation=horizontal&per_page=40&page=${pageNum}`;
       
    //const response = await fetch(url);  
    // const data = await response.json(); 
    const { data } = await axios.get(url);
         
    return data;   
}

