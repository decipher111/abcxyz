//Upload Listeners
function uploadListener(){
    $('.form').submit(function(e){
        e.preventDefault()
        var url, progress;

        getSignedURL($(this), updateBackend, url, progress)
    
        if($(this).attr('id')=='uploadNotes'){
            url = 'get_upload_notes_url'
            progress = '2'
        }
        if($(this).attr('id')=='submitAssignment'){
            url = 'get_upload_submission_url'
            progress = ''
        }
        if($(this).attr('id')=='uploadAssignment'){
            url = 'get_upload_assignment_url'
            progress = ''
        }

        getSignedURL($(this), updateBackend, url, progress)

    })
}

//Student Submits Assignment
function getSignedURL(element,callback, url, progress){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    var file_name = x.files[0].name
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')
    var response = {status :false}

    $.ajax({
        method: 'GET',
        url: window.location.href + '/'+ url,
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_url, true)
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find(`.progress${progress}`).removeClass('d-none')
            thisLecture.find(`.progress-bar${progress}`).css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id, response);
                if(response.status == false){
                    alert('File Not Uploaded')
                }
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

function updateBackend(thisLecture,lecture_id, response){
    $.ajax({
        method: 'GET',
        async : false,
        url: window.location.href +  "/upload_submission",
        data: {lecture_id: lecture_id}
      }).done(function(data){
        updateUI(data, thisLecture, response)
      })

}

function updateUI(data, thisLecture, response){
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        for(const lecture_index in course.lectures) {
            if(course.lectures[lecture_index].submission.available == 'True'){
                response.status = true
                thisLecture.find('.progress').addClass('d-none')
                thisLecture.find('.label-assignment').addClass('assignment-submitted')
                thisLecture.find('.notification-assignment').removeClass('d-none')
                thisLecture.find('.notification-assignment').next().addClass('assignment-submitted-dot')
                thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
                thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
            }
            if(course.lectures[lecture_index].assignment.available == 'True'){
                response.status = true
                thisLecture.find('.progress').addClass('d-none')
                thisLecture.find('.label-assignment').addClass('assignment-submitted')
                thisLecture.find('.btn-submissions').removeAttr('disabled')
                console.log(thisLecture.find('.days-ago-assignment'))
                thisLecture.find('.days-ago-assignment').addClass('d-none')
                thisLecture.find('.notification-assignment').removeClass('d-none')
                thisLecture.find('.notification-assignment').next().addClass('assignment-submitted-dot')
            }
            if(course.lectures[lecture_index].notes.available == 'True'){
                response.status = true
                thisLecture.find('.label-notes').addClass('notes-uploaded')
                thisLecture.find('.notification-notes').removeClass('d-none')
                thisLecture.find('.progress2').addClass('d-none')
                console.log(thisLecture.find('.days-ago-notes'))
                thisLecture.find('.days-ago-notes').addClass('d-none')
            }
        }
    }
}

// Teacher Uploads Assignment
function getSignedURLAssignmentUpload(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    var file_name = x.files[0].name
    // console.log(x.files[0]) //returns BLOB
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')
    var response = {status :false}

    $.ajax({
        method: 'GET',
        url: window.location.href + "/get_upload_assignment_url",
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_url, true)
        // xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find('.progress').removeClass('d-none')
            thisLecture.find('.progress-bar').css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id, file_name, response);
                if(response.status == false){
                    alert('File Not Uploaded')
                }
            }
        }; 
        xhr.setRequestHeader("Content-Type", content_type)
        var fd = new FormData()
        fd.append('fileName', JSON.stringify(x.files[0].name));
        // fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUIAssignmentUpload(thisLecture, lecture_id, file_name, response){
    $.ajax({
        method: 'GET',
        url: window.location.href + "/upload_assignment",
        async: false,
        data: {lecture_id: lecture_id}
      }).done(function(data){
        for (const course_index in data.courses) {
            const course = data.courses[course_index]
            for(const lecture_index in course.lectures) {
                if(course.lectures[lecture_index].lecture_id == lecture_id){
                    if(course.lectures[lecture_index].assignment.available == 'True' && course.lectures[lecture_index].assignment.file_name == file_name){
                        response.status = true
                        thisLecture.find('.progress').addClass('d-none')
                        thisLecture.find('.label-assignment').addClass('assignment-submitted')
                        thisLecture.find('.btn-submissions').removeAttr('disabled')
                        thisLecture.find('.days-ago-assignment').addClass('d-none')
                        thisLecture.find('.notification-assignment').removeClass('d-none')
                        thisLecture.find('.notification-assignment').next().addClass('assignment-submitted-dot')
                    }
                }
            }
        }
      })

}

//Teacher Uploads Notes
function getSignedURLNotesUpload(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    var file_name = x.files[0].name
    // console.log(x.files[0]) //returns BLOB
    var thisLecture = element.parent().parent().parent().parent()
    var lecture_id = thisLecture[0].getAttribute('lecture_id')
    var response = {status :false}
    $.ajax({
        method: 'GET',
        url: window.location.href + "/get_upload_notes_url",
        data: {lecture_id: lecture_id, content_type : content_type }
      }).done(function(signed_url) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_url, true)
        // xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            thisLecture.find('.progress2').removeClass('d-none')
            thisLecture.find('.progress-bar2').css('width', `${percent}%`)
        })
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                callback(thisLecture,lecture_id, file_name, response);
                if(response.status == false){
                    alert('File Not Uploaded')
                }
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

function updateBackendAndUINotesUpload(thisLecture,lecture_id,file_name, response){
    $.ajax({
        method: 'GET',
        async:false,
        url: window.location.href + "/upload_notes",
        data: {lecture_id: lecture_id}
      }).done(function(data){
        for (const course_index in data.courses) {
            const course = data.courses[course_index]
            for(const lecture_index in course.lectures) {
                if(course.lectures[lecture_index].lecture_id == lecture_id){
                    if(course.lectures[lecture_index].notes.available == 'True' && course.lectures[lecture_index].notes.file_name == file_name){
                        response.status = true
                        thisLecture.find('.label-notes').addClass('notes-uploaded')
                        thisLecture.find('.notification-notes').removeClass('d-none')
                        thisLecture.find('.progress2').addClass('d-none')
                        thisLecture.find('.days-ago-notes').addClass('d-none')
                    }
                }
            }
        }
      })
}

//Student download Assignment
function assignmentDownloadListener(){
    $('.btn-assignment').click(function(){
        var lecture = $(this).parent().parent().parent().parent();
        var lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id');

        $.ajax({
            method: 'GET',
            url: window.location.href + "/get_download_assignment_url",
            data: {lecture_id: lecture_id}
          }).done(function(signed_url) {
            fetch(window.location.href + '/' + signed_url, {
                method: "GET",
                })
                .then(function(resp){
                    if (resp.status == '200'){
                        return resp.blob()
                    }
                })
                .then(function(blob){
                    let response = {
                        status : false
                    }
                    $.ajax({
                        method: 'GET',
                        async: false,
                        url: window.location.href + "/download_assignment",
                        data: {lecture_id: lecture_id}
                      }).done(function(data){
                          backendCheckAssignmentDownload(lecture, data, response, lecture_id)
                      })
                      if(response.status==true)
                      return blob
                })
                .then(blob => {
                    createDownloadBLOB(blob)
                })
                .catch(() => alert('Could not fetch assignment'));
        })
          })
    
}

function backendCheckAssignmentDownload(lecture, data, response, lecture_id){
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        for(const lecture_index in course.lectures) {
            if(course.lectures[lecture_index].lecture_id == lecture_id){
                response.status = true
                if(course.lectures[lecture_index].assignment.to_be_seen == 'False'){
                    if(lecture.find('.notification-assignment').children(":first-child").hasClass('assignment-submitted-dot') == false){
                        lecture.find('.notification-assignment').addClass('d-none')
                    }
                }
            }
        }
    }
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

//Student download Notes
function notesDownloadListener(){
    $('.btn-notes').click(function(){
        var lecture = $(this).parent().parent().parent().parent();
        var lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id')

        $.ajax({
            method: 'GET',
            url: window.location.href + "/get_download_notes_url",
            data: {lecture_id: lecture_id}
          }).done(function(signed_url) {
            fetch(window.location.href + '/' + signed_url, {
            method: "GET",
            })
            .then(function(resp){
                if (resp.status == '200'){
                    return resp.blob()
                }
            })
            .then(function(blob){
                var response = {
                    status : false
                }
                $.ajax({
                    method: 'GET',
                    async: false,
                    url: window.location.href + "/download_notes",
                    data: {lecture_id: lecture_id}
                }).done(function(data){
                    backendCheckNotesDownload(lecture, data, response, lecture_id)
                })
                if(response.status==true){
                    return blob
                }
            })
            .then(blob => {
            createDownloadBLOB(blob)
            })
            .catch(() => alert('Could not fetch notes'));
        })
          })




}

//UI Upadte on Notes Download
function backendCheckNotesDownload(lecture, data, response, lecture_id){
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        for(const lecture_index in course.lectures) {
            if(course.lectures[lecture_index].lecture_id == lecture_id){
                response.status = true
                if(course.lectures[lecture_index].notes.to_be_seen == 'False'){
                    lecture.find('.notes-available-dot').addClass('notes-seen-dot')
                    lecture.find('.notes-available-dot').removeClass('notes-available-dot')
                }
            }
        }
    }
}

//View Submissions
function submissionListener(){
    $('.btn-submissions').click(function() {
        lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id')

        $.ajax({
            method: 'GET',
            url: window.location.href + `/redirect_submissions`,
            data: { lecture_id: lecture_id }
          }).done(function(url) {
            console.log(url)
                window.location.href = `${url}?lecture_id=${lecture_id}`;
          })

    })
}