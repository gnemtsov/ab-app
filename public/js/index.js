$.ajax({
    method: "GET",
    url: "http://127.0.0.1:3000/test/secret",
    success: function(data){
        $('body').append('<pre>' + JSON.stringify(data) + '</pre>' );
    },
    error: function(error) {
        console.log(error);
    }
});    
