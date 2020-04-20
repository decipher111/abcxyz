
var usercred

$('#login-form').submit(function(e){
    e.preventDefault()
    console.log('submitted')
    var username = $('#username').val()
    var password = $('#password').val()
    console.log(username, password)
    data = {'username': username, 'password': password}

    function getTimeTable(callback){
        $.get('/api', data  , function(response){
            sessionStorage.setItem('user', JSON.stringify(response));
            callback()
        });
    }


    function redirect(){
        window.location.replace("http://localhost:5000/dashboard");
    }

    getTimeTable(redirect)

})



