if(window.location.pathname == '/'){
$(document).ready(function() {
var MAX_LENGTH = 35;
var calendar_notifications_unique = [];

//initializing dashboard
initdashboard();

dynamicEventListeners()

//Static Event Listener
datetoggle()


function initdashboard(){
    var newDate = new Date()
    var today = Number(newDate.getMonth()+1) + '/' + newDate.getDate() + '/' + newDate.getFullYear()
    updateLeftDate(formatDate(today))
    renderTimeTable(today);
}

function dynamicEventListeners(){
    toggle()
    enableToolTips()
    assignmentDownloadListener()
    notesDownloadListener()
    submitFormOnStateChange()
    uploadListener()
    submissionListener()
    commentListener();
}

function toggle(){
    $('.down-arrow').click(function(){
        $('.test').find('.row-border-expanded11').removeClass("row-border-expanded11");
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
        $('.test').find('.row-border-expanded11').removeClass("row-border-expanded11");
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
        if(e.target.value.split( '\\' ).pop().length < 100){
            var $input	 = $(this), $label	 = $input.next( 'label' ), labelVal = $label.html();
            var fileName = '';
            $(this).parent().children('label').children('.icon').addClass('d-none')

            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption') || '' ).replace( '{count}', this.files.length );
            else if( e.target.value )
                fileName = e.target.value.split( '\\' ).pop();
                
            if(fileName.length>23 && window.matchMedia("(min-width: 720px)").matches===true){
                fileName = fileName.slice(0,18) + '...'
            }
            else if(fileName.length>23 && window.matchMedia("(max-width: 720px)").matches===true){
                fileName = fileName.slice(0,18) + '...'
            }

            if( fileName )
                $label.find( 'span' ).html( fileName );
            else
                $label.html( labelVal );

            $(this).parent().find("[type=submit]").trigger( "click" );
        }
        else {
            alert('File name should be less than 100 characters')
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

function getCourseName(course) {
    if (course == null || course.course_name == null) {
        return "";
    }
    if (course.course_name.length > MAX_LENGTH) {
        return course.course_name.slice(0, MAX_LENGTH - 3) + '...';
    }
    return course.course_name;
}

function getLectureID(lecture) {
    if (lecture == null || lecture.lecture_id == null) {
        return "";
    }
    return lecture.lecture_id;
}

function hasAssignment(lecture) {
    if (lecture == null || lecture.assignment.available == null) {
        return false;
    }
    return lecture.assignment.available
}

function assignmentTimeAgo(lecture) {
    if (lecture == null || lecture.assignment.time_ago == null) {
        return false;
    }
    return lecture.assignment.time_ago
}

function assignmentName(lecture) {
    if (lecture == null || lecture.assignment.file_name == null) {
        return false;
    }
    if(lecture.assignment.file_name.length > 18){
        return lecture.assignment.file_name.slice(0,14) + '...'
    }
    return lecture.assignment.file_name
}

function notesName(lecture) {
    if (lecture == null || lecture.notes.file_name == null) {
        return false;
    }
    if(lecture.notes.file_name.length > 18){
        return lecture.notes.file_name.slice(0,14) + '...'
    }
    return lecture.notes.file_name
}

function hasAssignmentNotification(lecture) {
    if (lecture == null || lecture.assignment.to_be_seen == null) {
        return false;
    }
    return lecture.assignment.to_be_seen
}

function hasNotes(lecture) {
    if (lecture == null || lecture.notes.available == null) {
        return false;
    }
    return lecture.notes.available
}

function hasNotesNotification(lecture) {
    if (lecture == null || lecture.notes.to_be_seen == null) {
        return false;
    }
    return lecture.notes.to_be_seen
}

function notesTimeAgo(lecture) {
    if (lecture == null || lecture.notes.time_ago == null) {
        return false;
    }
    return lecture.notes.time_ago
}

function getLectureTime(lecture) {
    if (lecture == null || lecture.date_time == null) {
        return "";
    }
    hours = new Date(lecture.date_time).getHours()
    minutes = new Date(lecture.date_time).getMinutes()
    period = ' AM'
    if (hours >= 12) {
        hours -= 12
        if(hours == 0){
            hours = 12
        }
        period = ' PM'
    }
    if(minutes < 10){
        return hours + ':' + '0' + minutes  + period 
    }
    else return hours + ':' + minutes + period 
}

function haveSubmitted(lecture){
    if (lecture == null || lecture.submission.available == null) {
        return false;
    }
    return lecture.submission.available
}

function submissionName(lecture){
    if (lecture == null || lecture.submission.file_name == null) {
        return false;
    }
    if(lecture.submission.file_name.length > 18){
        return lecture.submission.file_name.slice(0,15) + '...'
    }
    else return lecture.submission.file_name
}

function submissionTime(lecture){
    if (lecture == null || lecture.submission.time_ago == null) {
        return false;
    }
    return lecture.submission.time_ago
}

function getSubmissions(lecture){
    if (lecture == null || lecture.submission == null) {
        return false;
    }
    return lecture.submission
}

class LectureStudent {
    constructor(course_name, section, lecture) {
        this.course_name = course_name
        this.section = section
        this.lecture_id = getLectureID(lecture)
        this.has_assignment = hasAssignment(lecture)
        this.has_assignment_notification = hasAssignmentNotification(lecture)
        this.assignment_time_ago = assignmentTimeAgo(lecture)
        this.assignment_name = assignmentName(lecture)
        this.has_notes = hasNotes(lecture)
        this.has_notes_notification = hasNotesNotification(lecture)
        this.notes_time_ago = notesTimeAgo(lecture)
        this.notes_name = notesName(lecture)
        this.have_submitted = haveSubmitted(lecture)
        this.submission_name = submissionName(lecture)
        this.submission_time = submissionTime(lecture)
        this.lecture_time = getLectureTime(lecture)
        this.date_time = new Date(lecture.date_time)
    }
}

class LectureProfessor {
    constructor(course_name, section, lecture) {
        this.course_name = course_name
        this.section = section
        this.lecture_id = getLectureID(lecture)
        this.has_assignment = hasAssignment(lecture)
        this.has_assignment_notification = hasAssignmentNotification(lecture)
        this.assignment_name = assignmentName(lecture)
        this.assignment_time_ago = assignmentTimeAgo(lecture)
        this.has_notes = hasNotes(lecture)
        this.has_notes_notification = hasNotesNotification(lecture)
        this.notes_time_ago = notesTimeAgo(lecture)
        this.notes_name = notesName(lecture)
        this.submissions = getSubmissions(lecture)
        this.lecture_time = getLectureTime(lecture)
        this.date_time = new Date(lecture.date_time)
    }
}

function renderTimeTable(date) {
    $('.test').html(`<div class="loader"><img src="static/images/loader2.gif"></div>`)

        $.ajax({
            method: 'GET',
            url: window.location.href + '/get_time_table',
            beforeSend : function(){
                $('.loader').show()
            },
            data: { date: date }
          }).done(function(data) {
              if(data != null && data != undefined){
                    if(data.courses[0].role == 'Student'){
                        renderStudent(data)
                    }
                    else if(data.courses[0].role == 'Professor'){
                        renderProf(data)
                    }
                }
          }).done(function(data){
                dynamicEventListeners()
          }).catch(function(){
              alert('Error loading data. Please contact Chalkboards support')
          })
}

function getCalendarNotification(){
    $.ajax({
        method: 'GET',
        async: false,
        url: window.location.href + "/get_time_table",
        data: { date: date }
      }).done(function(data) {
          if(data != null && data != undefined){
            calendarNotifsInArray(data)
          }
      }).catch(function(){
          alert('Error! Please contact Chalkboards Support!')
      })
}

function calendarNotifsInArray(data){
    var calendar_notifications = []
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        for(const notification_index in course.calendar_notifications) {
            calendar_notifications.push(course.calendar_notifications[notification_index])
        }
    }
    calendar_notifications_unique = [];
    $.each(calendar_notifications, function(i, el){
        if($.inArray(el, calendar_notifications_unique) === -1) calendar_notifications_unique.push(el);
    });
}

function renderProf(data){
    $('.loader').hide()
    var lectures = []
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        const section = course.section.slice(0,9)
        const course_name = getCourseName(course)
        for(const lecture_index in course.lectures) {
            lectures.push(new LectureProfessor(course_name, section, course.lectures[lecture_index]))
        }
    }
    lectures.sort(function(a, b) { return a.date_time.getTime() - b.date_time.getTime() })

    if(lectures.length < 1){
        $('.test').html('<div class="mt-5 text-center"><h6>Awesome! No lectures scheduled for today.</h6></div>')
    }
    else{
        for(var i = 0; i < lectures.length; i++) {
            var lecture_id = getLectureID(lectures[i])
            $('.test').append(
            `  <div class="container-fluid m-0">
            ${(() => {
                if (i==0 && i == lectures.length-1) {
                    return `<div class="row-border first-lecture last-lecture" lecture_id=${lecture_id}>`
                }else if (i==0){
                    return `<div class="row-border first-lecture" lecture_id=${lecture_id}>`
                }
                else if(i==lectures.length-1){
                    return `<div class="row-border last-lecture" lecture_id=${lecture_id}>`
                }
                else {
                    return `<div class="row-border" lecture_id=${lecture_id}>`
                }
              })()}
              <ul class="list-inline mt-2 d-flex container-fluid">
                  <li class="col-2 pt-3 list-inline-item">${lectures[i].lecture_time}</li>
                  <li class="col-2 pt-3 list-inline-item">${lectures[i].section}</li>
                  <li class="col-5 pt-3 list-inline-item">${lectures[i].course_name}</li>
                  <li class="down-arrow col-1 list-inline-item icon-padding" data-tooltip="Assignment"><img src="static/images/as8.png" style="width:25px" height="33px">
                  ${(() => {
                    if(lectures[i].has_assignment == 'True' && lectures[i].has_assignment_notification == 'True') {
                        return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-available-dot"></i></sup>`
                    }
                    else if(lectures[i].has_assignment == 'True' && lectures[i].has_assignment_notification == 'False'){
                        return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-submitted-dot"></i></sup>`
                    } else {
                        return `<sup class="notification notification-assignment d-none"><i class="fa fa-circle assignment-submitted-dot"></i></sup>`
                    }
                  })()}
                  </li>
                  <li class="down-arrow2 col-1 list-inline-item icon-padding" data-tooltip="Notes"><img src="static/images/n-1.png" style="width:31px" height="31px">
                  ${(() => {
                    if (lectures[i].has_notes == 'True') {
                        return `<sup class="notification notification-notes"><i class="fa fa-circle notes-uploaded-dot"></i></sup>`
                    }
                    else {
                        return `<sup class="notification notification-notes d-none"><i class="fa fa-circle notes-uploaded-dot"></i></sup>`
                    }
                  })()}
                  </li>
              </ul>
              <div class="line-break"></div>
              <div class="action d-none">
                <ul class="list-inline d-flex container">
                    <li class="col-6 pt-2 list-inline-item">
                    <form class="form" id="uploadAssignment" enctype="multipart/form-data">
                        <input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1"/>
                        ${(() => {
                            if (lectures[i].has_assignment == 'True' ) {
                                return `<label for="file-1" class="p-2 label-assignment assignment-uploaded"><i class="icon ml-1 fa fa-plus d-none"></i><span class="ml-1 mr-1">${lectures[i].assignment_name}</span></label>
                                <input class="btn d-none" type="submit" value="Assignment 2">
                                <div class="days-ago days-ago-assignment">Uploaded ${lectures[i].assignment_time_ago} ago</div>`
                            } else {
                                return `<label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Upload</span></label>
                                <input class="btn d-none" type="submit" value="Assignment 2">`
                            }
                          })()}
    
                    </form>
                  </li>
                  <li class="upload col-6 pt-2 list-inline-item">
                  ${(() => {
                    if (lectures[i].has_assignment == 'True' && lectures[i].submissions != false) {
                        return `<button class="btn-dashboard btn btn-submissions"><i class="icon mr-2 fa fa-eye fa-lg"></i>Submissions</button>
                        <div class="days-ago">${lectures[i].submissions} submissions</div>`
                    }else if(lectures[i].has_assignment == 'True' && lectures[i].submissions == false){
                        return `<button class="btn-dashboard btn btn-submissions"><i class="icon mr-2 fa fa-eye fa-lg"></i>Submissions</button>
                        <div class="days-ago days-ago-submissions">No submissions yet</div>`
                    } else {
                        return `<button disabled class="btn-dashboard btn-submissions btn"><i class="icon mr-2 fa fa-eye fa-lg"></i>Submissions</button>`
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
                    <input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="notes" id="file-2" class="inputfile inputfile-1"/>
                    ${(() => {
                        if (lectures[i].has_notes == 'True' ) {
                            return `<label for="file-1" class="p-2 label-notes notes-uploaded"></i><span class="ml-1 mr-1">${lectures[i].notes_name}</span></label>
                            <div class="days-ago days-ago-notes">Uploaded ${lectures[i].notes_time_ago} ago</div>`
                        }
                        else {
                            return `<label for="file-1" class="p-2 label-notes"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Upload</span></label>`
                        }
                      })()}
                      <input class="btn d-none" type="submit" value="Upload">
                </form>
                </li>
                </ul>
                <div class="progress progress2 progress-upload progress-upload2 d-none">
                    <div class="progress-bar progress-bar2" role="progressbar" style="width: 0%;"></div>
                </div>
              </div>
            </div>
          </div>`)
        }   
    }
}

function renderStudent(data){
    $('.loader').hide()
    var lectures = []
    for (const course_index in data.courses) {
        const course = data.courses[course_index]
        const course_name = getCourseName(course)
        const section = course.section.slice(0,9)
        for(const lecture_index in course.lectures) {
            lectures.push(new LectureStudent(course_name, section, course.lectures[lecture_index]))
        }
    }
    lectures.sort(function(a, b) { return a.date_time.getTime() - b.date_time.getTime() })

    if(lectures.length < 1){
        $('.test').html('<div class="mt-5 text-center"><h6>Awesome! No lectures scheduled for today.</h6></div>')
    }
    else{
        for (var i = 0; i < lectures.length; i++) {
            var lecture_id = getLectureID(lectures[i])
            $('.test').append(
            `  <div class="container-fluid m-0">
            ${(() => {
                if (i==0 && i == lectures.length-1) {
                    return `<div class="row-border first-lecture last-lecture" lecture_id=${lecture_id}>`
                }else if (i==0){
                    return `<div class="row-border first-lecture" lecture_id=${lecture_id}>`
                }
                else if(i==lectures.length-1){
                    return `<div class="row-border last-lecture" lecture_id=${lecture_id}>`
                }
                else {
                    return `<div class="row-border" lecture_id=${lecture_id}>`
                }
              })()}
              <ul class="list-inline mt-2 d-flex container-fluid">
                  <li class="col-2 pt-3 list-inline-item">${lectures[i].lecture_time}</li>
                  <li class="col-2 pt-3 list-inline-item">${lectures[i].section}</li>
                  <li class="col-5 pt-3 list-inline-item">${lectures[i].course_name}</li>
                  <li class="down-arrow col-1 list-inline-item icon-padding" data-tooltip="Assignment"><img src="static/images/as8.png" style="width:25px" height="33px">
                  ${(() => {
                    if (lectures[i].has_assignment == 'True' && lectures[i].have_submitted == 'True') {
                        return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-submitted-dot"></i></sup>`
                    }else if(lectures[i].has_assignment == 'True' && lectures[i].has_assignment_notification == 'True') {
                        return `<sup class="notification notification-assignment"><i class="fa fa-circle assignment-available-dot"></i></sup>`
                    }
                    else {
                        return `<sup class="notification notification-assignment d-none"><i class="fa fa-circle assignment-available-dot"></i></sup>`
                    }
                  })()}
                  </li>
                  <li class="down-arrow2 col-1 list-inline-item icon-padding" data-tooltip="Notes""><img src="static/images/n-1.png" style="width:30px" height="33px">
                  ${(() => {
                    if (lectures[i].has_notes == 'True' && lectures[i].has_notes_notification == 'True') {
                        return `<sup class="notification notification-notes"><i class="fa fa-circle notes-available-dot"></i></sup>`
                    }else if(lectures[i].has_notes == 'True'){
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
                    if (lectures[i].has_assignment == 'True') {
                        return `<button lecture_id=${lecture_id} class="btn-dashboard btn btn-assignment"><i class="icon mr-2 fa fa-download fa-lg"></i>${lectures[i].assignment_name}</button>
                        <div class="days-ago">Uploaded ${lectures[i].assignment_time_ago} ago</div>`
                    } else {
                        return `<button disabled lecture_id=${lecture_id} class="btn-dashboard btn"><i class="icon mr-2 fa fa-download fa-lg"></i>Download</button>`
                    }
                  })()}
                  </li>
                    <li class="col-6 pt-2 list-inline-item">
                      <form class="form" id="submitAssignment" enctype="multipart/form-data">
                      ${(() => {
                        if (lectures[i].has_assignment == 'True' && lectures[i].have_submitted == 'True') {
                            return `<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1"/>
                            <label for="file-1" class="p-2 assignment-submitted label-assignment"><span class="ml-1 mr-1">${lectures[i].submission_name}</span></label>
                            <div class="days-ago">Uploaded ${lectures[i].submission_time} ago</div>
                            `
                        } 
                        else if (lectures[i].has_assignment == 'True') {
                            return `<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1"/>
                            <label for="file-1" class="p-2 label-assignment"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label>
                            `
                        } else {
                            return `<input disabled type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile inputfile-1"/>
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
                    if (lectures[i].has_notes == 'True') {
                        return `<li class="upload col-12 pt-2 list-inline-item"><button lecture_id=${lecture_id} class="btn-dashboard btn btn-notes"><i class="icon mr-2 fa fa-download fa-lg"></i>${lectures[i].notes_name}</button>
                        <div class="days-ago">Uploaded ${lectures[i].notes_time_ago} ago</div></li>`
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
}

//Upload Listeners
function uploadListener(){
    $('.form').submit(function(e){
        e.preventDefault()
    
        if($(this).attr('id')=='uploadNotes'){
            getSignedURLNotesUpload($(this),updateBackendAndUINotesUpload) //update teacher notif and backend on upload of notes
        }
        if($(this).attr('id')=='submitAssignment'){
            getSignedURLSubmission($(this),updateBackendAndUISubmission) //update student notif and backend on upload of assignment
        }
        if($(this).attr('id')=='uploadAssignment'){
            getSignedURLAssignmentUpload($(this),updateBackendAndUIAssignmentUpload) //update teacher notif and backend on upload of assignment
        }
    })
}

//Student Submits Assignment
function getSignedURLSubmission(element,callback){
    var x = element.children('input[type=file]')[0];
    content_type = x.files[0].type
    // console.log(x.files[0]) //returns BLOB
    var file_name = x.files[0].name
    var thisLecture = element.parent().parent().parent().parent()
    lecture_id = thisLecture[0].getAttribute('lecture_id')
    var response = {status :false}

    $.ajax({
        method: 'GET',
        url: window.location.href + "/get_upload_submission_url",
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
        // fd.append('fileName', JSON.stringify(x.files[0].name));
        // fd.append('fileData', x.files[0]);
        // console.log(fd.get('fileName'))
        // console.log(fd.get('fileData'))
        xhr.send(fd)

      })

}

function updateBackendAndUISubmission(thisLecture,lecture_id, file_name, response){
    $.ajax({
        method: 'GET',
        async : false,
        url: window.location.href +  "/upload_submission",
        data: {lecture_id: lecture_id}
      }).done(function(data){
          for (const course_index in data.courses) {
            const course = data.courses[course_index]
            for(const lecture_index in course.lectures) {
                if(course.lectures[lecture_index].lecture_id == lecture_id){
                    if(course.lectures[lecture_index].submission.available == 'True' && course.lectures[lecture_index].submission.file_name == file_name){
                        response.status = true
                        thisLecture.find('.progress').addClass('d-none')
                        thisLecture.find('.label-assignment').addClass('assignment-submitted')
                        thisLecture.find('.notification-assignment').removeClass('d-none')
                        thisLecture.find('.notification-assignment').next().addClass('assignment-submitted-dot')
                        thisLecture.find('.assignment-available-dot').addClass('assignment-submitted-dot')
                        thisLecture.find('.assignment-available-dot').removeClass('assignment-available-dot')
                    }
                }
            }
        }
      })

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


function commentListener(){
    $('.view-comments').click(function(){
        // $('.row-border').not($(this).parent().parent()).hide(); 
        console.log($(this).parent().parent().toggleClass('row-border-expanded11'))
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


initCalendar();

// App methods
function initCalendar() {
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

    getCalendarNotification();

    let daysTemplate = "";
    days.forEach(day => {

        var dateNotification = formatNotificationDate(day)
        
        if(day.currentMonth && calendar_notifications_unique.includes(dateNotification)){
            daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" date-notification="yes" data-year="${day.year}"><div class="dot"></div></li>`
        }
        else daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" date-notification="yes" data-year="${day.year}"></li>`
    });

    elements.days.innerHTML = daysTemplate;
}

function formatNotificationDate(day){
    if(Number(day.dayNumber)<10 && Number(day.month) < 10){
        return `0${Number(day.month)+1}/0${day.dayNumber}/${day.year}`    
    }
    else if(Number(day.dayNumber)<10 && Number(day.month) > 10){
        return `${Number(day.month)+1}/0${day.dayNumber}/${day.year}`
    }
    else if(Number(day.dayNumber)>10 && Number(day.month) < 10){
        return `0${Number(day.month)+1}/${day.dayNumber}/${day.year}`
    }
    else {
        return `${Number(day.month)+1}/${day.dayNumber}/${day.year}`
    }
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