if (window.location.href.indexOf('table') != -1)  {

var lecture_id = getParameterByName('lecture_id');

$(document).ready(function() {
        initTable()
});

function initTable(){
    renderSubmissions()
    tableEventListeners()
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function renderSubmissions(){


    $.ajax({
        method: 'GET',
        url: `http://127.0.0.1:5000/get_submissions`,
        data: { lecture_id: lecture_id }
      }).done(function(submissions) {
            console.log(submissions)
            for(var i = 0; i < submissions.submissions.length; i++){            
                $('#submissionTable').append(
                        `
                        <tbody>
                        <tr>
                            <td>${submissions.submissions[i].name}</td>
                            <td>${submissions.submissions[i].roll_no}</td>
                            <td>${submissions.submissions[i].time}</td>
                            <td class="download-submission"><i class="fa fa-download fa-2x" user_id=${submissions.submissions[i].user_id}></i></td>
                        </tr>
                        </tbody>
                        `
                    )
                }
      })
}

function tableEventListeners(){
    $('.download-submission').click(function(){
        var user_id = $(this).attr('user_id')
        console.log(user_id)
        $.ajax({
            method: 'GET',
            url: window.location.href + "get_download_submission_url",
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