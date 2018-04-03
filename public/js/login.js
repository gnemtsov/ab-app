$('#login-button').on('click', function(e){

    var $form = $(this).closest('form');

    $.ajax({
        method: "POST",
        url: `${API_ENDPOINT}/auth/login`,
        dataType: 'json',
        data: JSON.stringify( $form.parseForm() ),
        success: function(data){
            localStorage.setItem('tokens', JSON.stringify(data));
            location.replace('index');
        },
        failure: function(error) {
            console.log(error);
        }
    });    

});