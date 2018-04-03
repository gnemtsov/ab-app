$('#user-login').text(abAuth.tokenData.login);
$('#user-details').html(big_preloader_html);

$.ajax({
    method: "GET",
    url: `${API_ENDPOINT}/test/secret`,
    success: function(data){
        $('#user-details').html('<pre>' + JSON.stringify(data) + '</pre>' );
    },
    error: function(error) {
        console.log(error);
    }
});
