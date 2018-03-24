let $container = $('#main-container');
const big_preloader_html = '<div class="big-preloader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';

//------Document ready!------//
$(document).ready( function() {

    let abAuth = $.fn.abAuth();
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
                ROUTER.open( 'login' );
            }
        },
        error => { 
            console.log(error); 
        }
    );
    
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