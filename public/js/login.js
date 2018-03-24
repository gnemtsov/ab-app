$('#login-button').on('click', function(e){

    var $form = $(this).closest('form');

    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:3000/auth/login",
        dataType: 'json',
        data: JSON.stringify( $form.parseForm() ),
        success: function(data){
            localStorage.setItem('tokens', JSON.stringify(data));
            //location.replace('index');
        },
        failure: function(error) {
            console.log(error);
        }
    });    

});