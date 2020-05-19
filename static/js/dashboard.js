if (window.location.pathname == '/dashboard') {

// setUpFrontend();
initdashboard();
datetoggle()


function setUpFrontend(){
    toggle()
    enableToolTips()
    assignmentDownloadListener()
    notesDownloadListener()
    inputTagFileName()
    uploadListener()
    notificationListener()
    // datetoggle()
}

function inputTagFileName(){
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
            url: "http://127.0.0.1:5000/get_time_table",
            data: { date: date }
          }).done(function(data) {
               setUpTimeTable(data);
          }).done(function(data){
                setUpFrontend()
          });
}

function setUpTimeTable(data){
    if(data.courses[0].role == 'Student'){
        renderStudent(data)
    }
    else if(data.courses[0].role == 'Professor'){
        renderProf(data)
    }

}

function renderProf(data){
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
                  <form class="form" id="uploadAssignment" enctype="multipart/form-data">
                  ${(() => {
                    if (data.courses[0].lectures[i].assignment_available=='true') {
                        return `<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />`
                    } else {
                        return `<input disabled type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />`
                    }
                  })()}
                      <label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label>
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

function uploadListener(){
    $('.form').submit(function(e){
        e.preventDefault()
        if($(this).attr('id')=='uploadNotes'){
            notesBackend($(this),updateBackendAndUI2)
        }
        if($(this).attr('id')=='uploadAssignment'){
            assignmentBackend($(this),updateBackendAndUI)
        }
    })
}

function notesBackend(element,callback){
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
        fd.append('fileName', JSON.stringify(x.files[0].name));
        // fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileName'))
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUI2(thisLecture,lecture_id){
    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/upload_notes",
        data: {lecture_id: lecture_id}
      }).done(function(){
        thisLecture.find('.progress2').addClass('d-none')
        thisLecture.find('.label-notes').addClass('notes-submitted')
        // thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
        // thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
      })
}


function updateBackendAndUI(thisLecture,lecture_id){
    $.ajax({
        method: 'GET',
        url: "http://127.0.0.1:5000/upload_assignment",
        data: {lecture_id: lecture_id}
      }).done(function(){
        thisLecture.find('.progress').addClass('d-none')
        thisLecture.find('.label-assignment').addClass('assignment-submitted')
        thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
        thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
      })

}

function assignmentBackend(element,callback){
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

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
                updateNotification(lecture);
                })
                .catch(() => alert('Assignment not downloaded'));
        })
          })
    
}

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

function notificationListener(){
    $('.down-arrow').click(function(){
        console.log($(this).closest('div[lecture_id]').attr('lecture_id'))
        $(this).closest('.notification-assignment').addClass('d-none')

    })

    $('.down-arrow2').click(function(){
        console.log($(this).closest('div[lecture_id]').attr('lecture_id'))
        // $(this).next().addClass('d-none')
    })
}

function updateNotesDot(thisLecture){
    console.log(thisLecture.find('.notes-available-dot'))
    thisLecture.find('.notes-available-dot').addClass('notes-seen-dot')
    thisLecture.find('.notes-available-dot').removeClass('notes-available-dot')
}

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

function formatDate(strDate){
    var dateArr = strDate.split('/')
    let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var strView = `${(dateArr[1])} ${monthArr[dateArr[0]-1]} ${dateArr[2]}`
    return strView;
}

function updateLeftDate(formattedDate){
    $('#date-view').html(formattedDate)
}

}