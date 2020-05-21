if(window.location.pathname == '/'){
$(document).ready(function() {

//initializing dashboard
initdashboard();

//Static Event Listener
datetoggle()
    


function setUpFrontend(){
    toggle()
    enableToolTips()
    assignmentDownloadListener()
    notesDownloadListener()
    submitFormOnStateChange()
    uploadListener()
    notificationListener()
    submissionListener()
}

function toggle(){
    $('.down-arrow').click(function(){
        $('.test').find('.row-border-expanded2').removeClass("row-border-expanded2");
        $('.test').find('.action2').addClass('d-none')
        if($(this).parent().parent().hasClass('row-border-expanded2')){
            $(this).parent().parent().toggleClass('row-border-expanded2')
            $('.test').find('.action2').addClass('d-none')
        }
        var x = false;
        if($(this).parent().parent().hasClass('row-border-expanded1') == true){
            x = true;
        }
        $('.test').find('.row-border-expanded1').removeClass("row-border-expanded1");
        $('.test').find('.action').addClass('d-none')
        if(x == true){
            $(this).parent().parent().toggleClass('row-border-expanded1')
        }
        $(this).parent().parent().toggleClass('row-border-expanded1')
        $('.test').find('.row-border-expanded1').children('.action').toggleClass('d-none')
    
    })
    
    $('.down-arrow2').click(function(){
        $('.test').find('.row-border-expanded1').removeClass("row-border-expanded1");
        $('.test').find('.action').addClass('d-none')
        if($(this).parent().parent().hasClass('row-border-expanded1')){
            $(this).parent().parent().toggleClass('row-border-expanded1')
            $('.test').find('.action').addClass('d-none')
        }
        var x = false;
        if($(this).parent().parent().hasClass('row-border-expanded2') == true){
            x = true;
        }
        $('.test').find('.row-border-expanded2').removeClass("row-border-expanded2");
        $('.test').find('.action2').addClass('d-none')
        if(x == true){
            $(this).parent().parent().toggleClass('row-border-expanded2')
        }
        $(this).parent().parent().toggleClass('row-border-expanded2')
        $('.test').find('.row-border-expanded2').children('.action2').toggleClass('d-none')
    })

}

function submitFormOnStateChange(){
    $('.inputfile' ).on('change', function(e){
        // console.log($(this).val()) //returns fakepath
        // console.log($(this)[0].files[0]) //returns file

        var $input	 = $(this),
                $label	 = $input.next( 'label' ),
                labelVal = $label.html();
                var fileName = '';
                $(this).parent().children('label').children('.icon').addClass('d-none')

                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption') || '' ).replace( '{count}', this.files.length );
                else if( e.target.value )
                    fileName = e.target.value.split( '\\' ).pop();
                
                if(fileName.length>30 && window.matchMedia("(min-width: 720px)").matches===true){
                    fileName = fileName.slice(0,18) + '...'
                }
                else if(fileName.length>30 && window.matchMedia("(max-width: 720px)").matches===true){
                    fileName = fileName.slice(0,18) + '...'
                }

                if( fileName )
                    $label.find( 'span' ).html( fileName );
                else
                    $label.html( labelVal );
                if(fileName!=''){
                    $(this).parent().find("[type=submit]").trigger( "click" );
                }

    })
}

function enableToolTips(){
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="tooltip"]').click(function(){
            $('[data-toggle="tooltip"]').tooltip('hide')
        })
    })
}

function initdashboard(){
    var newDate = new Date()
    var today = Number(newDate.getMonth()+1) + '/' + newDate.getDate() + '/' + newDate.getFullYear()
    updateLeftDate(formatDate(today))
    renderTimeTable(today);
}
  
function renderTimeTable(date) {
    $('.test').html('')
        $.ajax({
            method: 'GET',
            async: false,
            url: "http://127.0.0.1:5000/get_time_table",
            data: { date: date }
          }).done(function(data) {
                if(data.courses[0].role == 'Student'){
                    renderStudent(data)
                }
                else if(data.courses[0].role == 'Professor'){
                    renderProf(data)
                }
          }).done(function(data){
                setUpFrontend()
          }).catch(function(){
              console.log('err')
          })
}

function renderProf(data){
    for(var i = 0; i < data.courses[0].lectures.length; i++) {
        var subjectName = data.courses[0].course_name
        var lecture_id = data.courses[0].lectures[i].lecture_id
        var section = data.courses[0].section
        if(subjectName.length>33){
            subjectName = subjectName.slice(0,32) + '...'
        }
        $('.test').append(
        `  <div class="container-fluid m-0">
        ${(() => {
            if (i==0 && i==data.courses[0].lectures.length-1) {
                return `<div class="row-border first-last-lecture" lecture_id=${lecture_id}>`
            }else if (i==0){
                return `<div class="row-border first-lecture" lecture_id=${lecture_id}>`
            }
            else if(i==data.courses[0].lectures.length-1){
                return `<div class="row-border last-lecture" lecture_id=${lecture_id}>`
            }
            else {
                return `<div class="row-border" lecture_id=${lecture_id}>`
            }
          })()}
          <ul class="list-inline mt-2 d-flex container-fluid">
              <li class="col-2 pt-3 list-inline-item">10:00am</li>
              <li class="col-2 pt-3 list-inline-item">${section}</li>
              <li class="col-5 pt-3 list-inline-item">${subjectName}
              </li>
              <li class="down-arrow col-1 list-inline-item icon-padding"><img src="static/images/as4.png" style="width:31px" height="31px">
              ${(() => {
                if (data.courses[0].lectures[i].assignment_available==='true' && data.courses[0].lectures[i].submitted==='true') {
                    return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-submitted-dot"></i></sup>`
                }else if(data.courses[0].lectures[i].assignment_available==='true' && data.courses[0].lectures[i].submitted==='false') {
                    return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-available-dot"></i></sup>`
                }
                else {
                    return ``
                }
              })()}
              </li>
              <li class="down-arrow2 col-1 list-inline-item icon-padding"><img src="static/images/n-1.png" style="width:31px" height="31px">
              ${(() => {
                if (data.courses[0].lectures[i].notes_available==='true' && data.courses[0].lectures[i].notes_to_be_seen==='true') {
                    return `<sup class="notification notification-notes"><i class="fa fa-circle notes-available-dot"></i></sup>`
                }else if(data.courses[0].lectures[i].notes_available==='true' && data.courses[0].lectures[i].notes_to_be_seen==='false'){
                    return `<sup class="notification notification-notes"><i class="fa fa-circle notes-seen-dot"></i></sup>`
                }
                else {
                    return ``
                }
              })()}
              </li>
          </ul>
          <div class="line-break"></div>
          <div class="action d-none">
            <ul class="list-inline d-flex container">
                <li class="col-6 pt-2 list-inline-item">
                <form class="form" id="uploadAssignment" enctype="multipart/form-data">
                    <input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                    <label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Upload</span></label>
                    <input class="btn d-none" type="submit" value="Upload">
                </form>
              </li>
              <li class="upload col-6 pt-2 list-inline-item">
              ${(() => {
                if (data.courses[0].lectures[i].assignment_available=='true') {
                    return `<button lecture_id=${lecture_id} class="btn-dashboard btn btn-submissions"><i class="icon mr-2 fa fa-eye fa-lg"></i>Submissions</button>
                    <div class="days-ago">${data.courses[0].lectures[i].submissions} submissions</div>`
                } else {
                    return `<button disabled lecture_id=${lecture_id} class="btn-dashboard btn-submissions btn"><i class="icon mr-2 fa fa-eye fa-lg"></i>Submissions</button>`
                }
              })()}
              </li>
            </ul>
            <div class="progress progress-upload d-none">
                <div class="progress-bar" role="progressbar" style="width: 0%;"></div>
            </div>
          </div>
          <div class="action2 d-none">
            <ul class="list-inline d-flex container">
            <li class="col-12 pt-2 list-inline-item">
                <form class="form" id="uploadNotes" enctype="multipart/form-data">
                <input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="notes" id="file-2" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                <label for="file-1" class="p-2 label-notes"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Upload</span></label>
                <input class="btn d-none" type="submit" value="Upload">
            </form>
            </li>
            </ul>
            <div class="progress2 progress-upload2 d-none">
                <div class="progress-bar2" role="progressbar" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>`)
    }   
}

function renderStudent(data){
    for(var i = 0; i < data.courses[0].lectures.length; i++) {
        var subjectName = data.courses[0].course_name
        var lecture_id = data.courses[0].lectures[i].lecture_id
        var course_id = data.courses[0].lectures[i].course_id
        if(subjectName.length>33){
            subjectName = subjectName.slice(0,32) + '...'
        }
        $('.test').append(
        `  <div class="container-fluid m-0">
        ${(() => {
            if (i==0 && i==data.courses[0].lectures.length-1) {
                return `<div class="row-border first-last-lecture" lecture_id=${lecture_id}>`
            }else if (i==0){
                return `<div class="row-border first-lecture" lecture_id=${lecture_id}>`
            }
            else if(i==data.courses[0].lectures.length-1){
                return `<div class="row-border last-lecture" lecture_id=${lecture_id}>`
            }
            else {
                return `<div class="row-border" lecture_id=${lecture_id}>`
            }
          })()}
          <ul class="list-inline mt-2 d-flex container-fluid">
              <li class="col-2 pt-3 list-inline-item">10:00am</li>
              <li class="col-2 pt-3 list-inline-item">${course_id}</li>
              <li class="col-5 pt-3 list-inline-item">${subjectName}
              </li>
              <li class="down-arrow col-1 list-inline-item icon-padding"><img src="static/images/as4.png" style="width:31px" height="31px">
              ${(() => {
                if (data.courses[0].lectures[i].assignment_available==='true' && data.courses[0].lectures[i].submitted==='true') {
                    return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-submitted-dot"></i></sup>`
                }else if(data.courses[0].lectures[i].assignment_available==='true' && data.courses[0].lectures[i].submitted==='false') {
                    return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-available-dot"></i></sup>`
                }
                else {
                    return ``
                }
              })()}
              </li>
              <li class="down-arrow2 col-1 list-inline-item icon-padding"><img src="static/images/n-1.png" style="width:31px" height="31px">
              ${(() => {
                if (data.courses[0].lectures[i].notes_available==='true' && data.courses[0].lectures[i].notes_to_be_seen==='true') {
                    return `<sup class="notification notification-notes"><i class="fa fa-circle notes-available-dot"></i></sup>`
                }else if(data.courses[0].lectures[i].notes_available==='true' && data.courses[0].lectures[i].notes_to_be_seen==='false'){
                    return `<sup class="notification notification-notes"><i class="fa fa-circle notes-seen-dot"></i></sup>`
                }
                else {
                    return ``
                }
              })()}
              </li>
          </ul>
          <div class="line-break"></div>
          <div class="action d-none">
            <ul class="list-inline d-flex container">
              <li class="upload col-6 pt-2 list-inline-item">
              ${(() => {
                if (data.courses[0].lectures[i].assignment_available=='true') {
                    return `<button lecture_id=${lecture_id} class="btn-dashboard btn btn-assignment"><i class="icon mr-2 fa fa-download fa-lg"></i>Download</button>
                    <div class="days-ago">Uploaded n days ago</div>`
                } else {
                    return `<button disabled lecture_id=${lecture_id} class="btn-dashboard btn"><i class="icon mr-2 fa fa-download fa-lg"></i>Download</button>`
                }
              })()}
              </li>
                <li class="col-6 pt-2 list-inline-item">
                  <form class="form" id="submitAssignment" enctype="multipart/form-data">
                  ${(() => {
                    if (data.courses[0].lectures[i].submitted=='true') {
                        return `<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                        <label for="file-1" class="p-2 assignment-submitted label-assignment"><span class="ml-1 mr-1">Insert Name</span></label>
                        `
                    } 
                    else if (data.courses[0].lectures[i].assignment_available=='true') {
                        return `<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                        <label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label>
                        `
                    } else {
                        return `<input disabled type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                        <label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label>
                        `
                    }
                  })()}
                    <input class="btn d-none" type="submit" value="Upload">
                </form>
              </li>
            </ul>
            <div class="progress progress-upload d-none">
                <div class="progress-bar" role="progressbar" style="width: 0%;"></div>
            </div>
          </div>
          <div class="action2 d-none">
            <ul class="list-inline d-flex container">
            ${(() => {
                if (data.courses[0].lectures[i].notes_available=='true') {
                    return `<li class="upload col-12 pt-2 list-inline-item"><button lecture_id=${lecture_id} class="btn-dashboard btn btn-notes"><i class="icon mr-2 fa fa-download fa-lg"></i>Download</button>
                    <div class="days-ago">Uploaded n days ago</div></li>`
                } else {
                    return `<li class="upload col-12 pt-2 list-inline-item"><button disabled lecture_id=${lecture_id} class="btn-dashboard btn"><i class="icon mr-2 fa fa-download fa-lg"></i>Download</button></li>`
                }
              })()}
            </ul>
          </div>
        </div>
      </div>`)
    }   
}

//Upload Listeners
function uploadListener(){
    $('.form').submit(function(e){
        e.preventDefault()
    
        if($(this).attr('id')=='uploadNotes'){
            getSignedURLNotesUpload($(this),updateBackendAndUIAssignmentUpload) //update teacher notif and backend on upload of notes
        }
        if($(this).attr('id')=='submitAssignment'){
            getSignedURLSubmission($(this),updateBackendAndUISubmission) //update student notif and backend on upload of assignment
        }
        if($(this).attr('id')=='uploadAssignment'){
            getSignedURLAssignmentUpload($(this),updateBackendAndUINotesUpload) //update teacher notif and backend on upload of assignment
        }
    })
}

//Student Uploads Assignment
function getSignedURLSubmission(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    // console.log(x.files[0]) //returns BLOB
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')

    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/get_upload_submission_url",
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        // xhr.open("PUT", signed_url, true)
        xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find('.progress').removeClass('d-none')
            thisLecture.find('.progress-bar').css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id);
            }
        }; 
        xhr.setRequestHeader("Content-Type", content_type)
        var fd = new FormData()
        fd.append('fileName', JSON.stringify(x.files[0].name));
        fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileName'))
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUISubmission(thisLecture,lecture_id){
    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/submit_assignment",
        data: {lecture_id: lecture_id}
      }).done(function(data){
        thisLecture.find('.progress').addClass('d-none')
        thisLecture.find('.label-assignment').addClass('assignment-submitted')
        thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
        thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
      })

}

// Teacher Uploads Assignment
function getSignedURLAssignmentUpload(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    // console.log(x.files[0]) //returns BLOB
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')

    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/get_upload_assignment_url",
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        // xhr.open("PUT", signed_url, true)
        xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find('.progress').removeClass('d-none')
            thisLecture.find('.progress-bar').css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id);
            }
        }; 
        xhr.setRequestHeader("Content-Type", content_type)
        var fd = new FormData()
        fd.append('fileName', JSON.stringify(x.files[0].name));
        fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileName'))
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUINotesUpload(thisLecture,lecture_id){
    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/upload_notes",
        data: {lecture_id: lecture_id}
      }).done(function(){
        // thisLecture.find('.progress2').addClass('d-none')
        // thisLecture.find('.label-notes').addClass('notes-submitted')
        // thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
        // thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
      })
}

//Teacher Uploads Notes
function getSignedURLNotesUpload(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    // console.log(x.files[0]) //returns BLOB
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')

    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/get_upload_notes_url",
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        // xhr.open("PUT", signed_url, true)
        xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find('.progress2').removeClass('d-none')
            thisLecture.find('.progress-bar2').css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id);
            }
        }; 
        xhr.setRequestHeader("Content-Type", content_type)
        var fd = new FormData()
        // fd.append('fileName', JSON.stringify(x.files[0].name));
        // fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileName'))
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUIAssignmentUpload(thisLecture,lecture_id){
    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/upload_assignment",
        data: {lecture_id: lecture_id}
      }).done(function(data){
        // thisLecture.find('.progress').addClass('d-none')
        // thisLecture.find('.label-assignment').addClass('assignment-submitted')
        // thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
        // thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
      })

}

//Student download Assignment(No UI Update)
function assignmentDownloadListener(){
    $('.btn-assignment').click(function(){
        var lecture = $(this).parent().parent().parent().parent();
        var lecture_id = $(this).attr('lecture_id');



        $.ajax({
            method: 'GET',
            url: "http://127.0.0.1:5000/get_download_assignment_url",
            data: {lecture_id: lecture_id}
          }).done(function(signed_url) {
            fetch('http://127.0.0.1:5000/return-files', {
                method: "GET",
                })
                .then(function(resp){
                    if (resp.status == '200'){
                        return resp.blob()
                    }
                })
                .then(function(blob){
                    var status=false;
                    $.ajax({
                        method: 'GET',
                        async: false,
                        url: "http://127.0.0.1:5000/download_assignment",
                        data: {lecture_id: lecture_id}
                      }).done(function(){
                          status=true
                      })
                      if(status==true)
                      return blob
                })
                .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = 'abc.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                // greenToYellow() ?
                })
                .catch(() => alert('Assignment not downloaded'));
        })
          })
    
}

//Student download Notes(Dot Orange to None)
function notesDownloadListener(){
    $('.btn-notes').click(function(){
        var lecture = $(this).parent().parent().parent().parent();
        var lecture_id = $(this).attr('lecture_id');


        $.ajax({
            method: 'GET',
            url: "http://127.0.0.1:5000/get_download_notes_url",
            data: {lecture_id: lecture_id}
          }).done(function(signed_url) {
            fetch('http://127.0.0.1:5000/return-files', {
            method: "GET",
            })
            .then(function(resp){
                if (resp.status == '200'){
                    return resp.blob()
                }
            })
            .then(function(blob){
                var status = false;
                $.ajax({
                    method: 'GET',
                    async: false,
                    url: "http://127.0.0.1:5000/download_notes",
                    data: {lecture_id: lecture_id}
                }).done(function(){
                    status=true
                })
                if(status==true)
                return blob
            })
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = 'abc.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            updateNotesDot(lecture);
            })
            .catch(() => alert('Notes not downloaded'));
        })
          })




}

//UI Upadte on Notes Download
function updateNotesDot(thisLecture){
    thisLecture.find('.notes-available-dot').addClass('notes-seen-dot')
    thisLecture.find('.notes-available-dot').removeClass('notes-available-dot')
}

//Date Toggler
function datetoggle(){

    $('#date-next').click(function(){
        let calendar = getCalendar();
        updateTime(calendar.nDay);
        let strDate = `${Number(calendar.nDay.getMonth()) + 1 }/${calendar.nDay.getDate()}/${calendar.nDay.getFullYear()}`;
        drawAll(strDate)
        updateLeftDate(formatDate(strDate))
    })

    $('#date-prev').click(function(){
        let calendar = getCalendar();
        updateTime(calendar.pDay);
        let strDate = `${Number(calendar.pDay.getMonth()) + 1}/${calendar.pDay.getDate()}/${calendar.pDay.getFullYear()}`;
        drawAll(strDate)
        updateLeftDate(formatDate(strDate))
    })
}

// Toggle Helper Functions
function formatDate(strDate){
    var dateArr = strDate.split('/')
    let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var strView = `${(dateArr[1])} ${monthArr[dateArr[0]-1]} ${dateArr[2]}`
    return strView;
}

function updateLeftDate(formattedDate){
    $('#date-view').html(formattedDate)
}

//View Submissions
function submissionListener(){
    $('.btn-submissions').click(function() {
        lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id')

        $.ajax({
            method: 'GET',
            url: "http://127.0.0.1:5000/submissions",
            data: { lecture_id: lecture_id }
          }).done(function(url) {

                window.location.href = url;
          })

    })
}








const AVAILABLE_WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


elements = {
    days: getFirstElementInsideIdByClassName('calendar-days'),
    week: getFirstElementInsideIdByClassName('calendar-week'),
    month: getFirstElementInsideIdByClassName('calendar-month'),
    year: getFirstElementInsideIdByClassName('calendar-current-year'),
    currentDay: getFirstElementInsideIdByClassName('calendar-left-side-day'),
    currentWeekDay: getFirstElementInsideIdByClassName('calendar-left-side-day-of-week'),
    prevYear: getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
    nextYear: getFirstElementInsideIdByClassName('calendar-change-year-slider-next'),
};


var date = +new Date();
var maxDays = 37;


init();

// App methods
function init() {
    eventsTrigger();
    drawAll();
}

// draw Methods
function drawAll(strDate) {
    drawWeekDays();
    drawMonths();
    drawDays();
    drawYearAndCurrentDay();
    if (strDate!==undefined){
        renderTimeTable(strDate);
    }
}

function drawYearAndCurrentDay() {
    let calendar = getCalendar();
    elements.year.innerHTML = calendar.active.year;
    elements.currentDay.innerHTML = calendar.active.day;
    elements.currentWeekDay.innerHTML = AVAILABLE_WEEK_DAYS[calendar.active.week];
}

function drawDays() {
    let calendar = getCalendar();
    


    let latestDaysInPrevMonth = range(calendar.active.startWeek).map((day, idx) => {
        return {
            dayNumber: countOfDaysInMonth(calendar.pMonth) - idx,
            month: new Date(calendar.pMonth).getMonth(),
            year: new Date(calendar.pMonth).getFullYear(),
            currentMonth: false
        }
    }).reverse();


    let daysInActiveMonth = range(calendar.active.days).map((day, idx) => {
        let dayNumber = idx + 1;
        let today = new Date();
        return {
            dayNumber,
            today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
            month: calendar.active.month,
            year: calendar.active.year,
            selected: calendar.active.day === dayNumber,
            currentMonth: true
        }
    });

    let countOfDays = maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
    let daysInNextMonth = range(countOfDays).map((day, idx) => {
        return {
            dayNumber: idx + 1,
            month: new Date(calendar.nMonth).getMonth(),
            year: new Date(calendar.nMonth).getFullYear(),
            currentMonth: false
        }
    });


    let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];

    days = days.map(day => {
        let newDayParams = day;
        let formatted = getFormattedDate(new Date(`${Number(day.month) + 1}/${day.dayNumber}/${day.year}`));
        // newDayParams.hasEvent = eventList[formatted];
        return newDayParams;
    });

    let daysTemplate = "";
    days.forEach(day => {
        daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" date-notification="yes" data-year="${day.year}"><div class="dot"></div></li>`
    });

    elements.days.innerHTML = daysTemplate;
}

function drawMonths() {
    let availableMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthTemplate = "";
    let calendar = getCalendar();
    availableMonths.forEach((month, idx) => {
        monthTemplate += `<li class="${idx === calendar.active.month ? 'active' : ''}" data-month="${idx}">${month}</li>`
    });

    elements.month.innerHTML = monthTemplate;
}

function drawWeekDays() {
    let weekTemplate = "";
    AVAILABLE_WEEK_DAYS.forEach(week => {
        weekTemplate += `<li>${week.slice(0, 3)}</li>`
    });

    elements.week.innerHTML = weekTemplate;
}

function eventsTrigger() {
    elements.prevYear.addEventListener('click', e => {
        let calendar = getCalendar();
        updateTime(calendar.pYear);
        drawAll()
    });



    elements.nextYear.addEventListener('click', e => {
        let calendar = getCalendar();
        updateTime(calendar.nYear);
        drawAll()
    });

    elements.month.addEventListener('click', e => {
        let calendar = getCalendar();
        let month = e.srcElement.getAttribute('data-month');
        if (!month || calendar.active.month == month) return false;

        let newMonth = new Date(calendar.active.tm).setMonth(month);
        updateTime(newMonth);
        drawAll()
    });

    // elements.btn.addEventListener('click', e => {
    //     $.ajax({
    //         method: 'GET',
    //         url: "http://127.0.0.1:5000/calendar-notif",
    //         data: {lecture_id: 'lecture_id'}
    //       }).done(function(data){
    //         console.log(data)
    //       })
    //     console.log('here')
    //     drawDays()
    // });


    $('#viewSub').click(function(){
        var date = calendar.getDate
        console.log(date)
    })

    //Event Listener Setup here
    elements.days.addEventListener('click', e => {
        let element = e.srcElement;
        let day = element.getAttribute('data-day');
        let month = element.getAttribute('data-month');
        let year = element.getAttribute('data-year');
        if (!day) return false;
        let strDate = `${Number(month) + 1}/${day}/${year}`;
        updateTime(strDate);
        drawAll(strDate)
        updateLeftDate(formatDate(strDate))
    });

}

function updateTime(time) {
    date = +new Date(time);
}

function getCalendar() {
    let time = new Date(date);

    return {
        active: {
            days: countOfDaysInMonth(time),
            startWeek: getStartedDayOfWeekByTime(time),
            day: time.getDate(),
            week: time.getDay(),
            month: time.getMonth(),
            year: time.getFullYear(),
            formatted: getFormattedDate(time),
            tm: +time
        },
        nDay: new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1),
        pDay: new Date(time.getFullYear(), time.getMonth(), time.getDate() - 1),
        pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
        nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
        pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
        nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
    }
}

function countOfDaysInMonth(time) {
    let date = getMonthAndYear(time);
    return new Date(date.year, date.month + 1, 0).getDate();
}

function getStartedDayOfWeekByTime(time) {
    let date = getMonthAndYear(time);
    return new Date(date.year, date.month, 1).getDay();
}

function getMonthAndYear(time) {
    let date = new Date(time);
    return {
        year: date.getFullYear(),
        month: date.getMonth()
    }
}

function getFormattedDate(date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

function range(number) {
    return new Array(number).fill().map((e, i) => i);
}

function getFirstElementInsideIdByClassName(className) {
    return document.getElementById('calendar').getElementsByClassName(className)[0];
}

});

}