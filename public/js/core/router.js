"use strict";

//ROUTER object
const ROUTER = {

    pages: {
        "index": ["css/index.css", "views/index.html", "js/index.js"],
        "login": ["css/login.css", "views/login.html", "js/login.js"]
    },

    open: function(page){
        let self = this;

        $container.html(big_preloader_html);

        if(self.pages.hasOwnProperty(page)){

            const parts = self.pages[page];
            let getters = [];
            let wrappers = [];

            for (let i = 0; i < parts.length; i++) {
                if( /^.*\.css$/i.test(parts[i]) ){
                    wrappers.push('style');
                } else if ( /^.*\.js$/i.test(parts[i]) ){
                    wrappers.push('script');
                } else {
                    wrappers.push('');
                }

                getters.push( 
                    $.get(parts[i], null, null, 'text').promise() 
                );
            }

            Promise.all(getters).then(function(results) {
                let html = '';

                for (let i = 0; i < results.length; i++) {
                    if(wrappers[i] === ''){
                        html += results[i];
                    } else {
                        html += `<${wrappers[i]}>${results[i]}</${wrappers[i]}>`;                        
                    }                    
                }

                self.updatePath(page);
                $container.html(html);
            });

        } else {
            //TODO
            console.log('404');
        }
    },

    updatePath: function(newPath){
        if(newPath !== window.location.pathname) { 
            history.pushState({}, null, newPath);
        }        
    }

}