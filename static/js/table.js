if (window.location.pathname == '/table') {
    $(document).ready(function() {

        initTable()
        
    });

function initTable(){
    renderSubmissions()
    tableEventListeners()
}

function renderSubmissions(){
    var cookieval = getCookie('someCookie')
    if(cookieval != null){
        var encodedSubmissions = decode_flask_cookie(cookieval)
        var submissions = JSON.parse(encodedSubmissions)
        for(var i = 0; i < submissions.submissions.length; i++){            
        $('#submissionTable').append(
                `
                <tbody>
                <tr>
                    <td>${submissions.submissions[i].name}</td>
                    <td>${submissions.submissions[i].roll_no}</td>
                    <td>${submissions.submissions[i].time}</td>
                    <td><i class="fa fa-download download-submission fa-2x" user_id=${submissions.submissions[i].user_id}></i></td>
                </tr>
                </tbody>
                `
            )
        }
    }
    else alert('Could not get submissions')
}

function decode_flask_cookie(val) {
    if (val.indexOf('\\') === -1) {
        return val;  // not encoded
    }
    val = val.slice(1, -1).replace(/\\"/g, '"');
    val = val.replace(/\\(\d{3})/g, function(match, octal) { 
        return String.fromCharCode(parseInt(octal, 8));
    });
    return val.replace(/\\\\/g, '\\');
}
    
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function tableEventListeners(){
    $('.download-submission').click(function(){
        var user_id = $(this).attr('user_id')
        console.log(user_id)
        $.ajax({
            method: 'GET',
            url: window.location.href + "//get_download_submission_url",
            data: {user_id: user_id}
          }).done(function(signed_url) {
            console.log(signed_url)
            fetch(window.location.href + '/' + signed_url, {
                method: "GET",
                })
                .then(function(resp){
                    if (resp.status == '200'){
                        return resp.blob()
                    }
                })
                .then(function(blob){
                    createDownloadBLOB(blob)
                })
                .catch(() => alert('Could not fetch notes'));
          })
    })
}

function createDownloadBLOB(blob){
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = 'abc.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
    


    
}