const PRODUCTION = location.hostname === 'ab-erp.com';
const API_ENDPOINT = PRODUCTION ? 'https://api.ab-erp.com' : 'http://127.0.0.1:3000';

let $container = $('#main-container');
const big_preloader_html = '<div class="big-preloader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';

//------Document ready!------//
$(document).ready( function() {

    abAuth.promise.then(
        authenticated => {
            if(authenticated){
                console.log('core.js: abAuth promise finished, user is authenticated.');
                let [page] = window.location.pathname.split('/');
                if(page === '' || page === 'login'){
                    page = 'index';
                }
                ROUTER.open( page );
            } else {
                console.log('core.js: abAuth promise finished, user is not authenticated.');
                ROUTER.open('login');
            }
        },
        error => { 
            console.log(error); 
        }
    );
    
});

$('body').on('click', '#logout', (e) => {
    e.preventDefault();
    abAuth.logOut();
    ROUTER.open('login');    
});

//form parser
$.fn.parseForm = function(){
    return this.serializeArray().reduce(
                (a, x) => { 
                    a[x.name] = x.value; 
                    return a; 
                }, 
                {}
            );
}