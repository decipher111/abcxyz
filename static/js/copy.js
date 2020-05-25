var MAX_LENGTH = 35;

if (window.location.pathname == '/dashboard') {
    
    jQuery.support.cors = true;


enableToolTips();
initdashboard();
// console.log(window.matchMedia("(min-width: 720px)").matches===true)
//remove these fx after testing
toggle();
// uploadAssignment();
inputTagFileName();



function inputTagFileName(){
    $('.inputfile' ).each( function()
        {
            var $input	 = $(this),
                $label	 = $input.next( 'label' ),
                labelVal = $label.html();

            $input.on( 'change', function( e ){
                var fileName = '';
                $(this).parent().children('label').children('.icon').addClass('d-none')
                $(this).parent().children('.fa-times').removeClass('d-none')

                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption') || '' ).replace( '{count}', this.files.length );
                else if( e.target.value )
                    fileName = e.target.value.split( '\\' ).pop();
                
                if(window.matchMedia("(min-width: 720px)").matches=='true'){
                    console.log('this')
                }
                
                if(fileName.length>30 && window.matchMedia("(min-width: 720px)").matches===true){
                    fileName = fileName.slice(0,26) + '...'
                }
                else if(fileName.length>30 && window.matchMedia("(max-width: 720px)").matches===true){
                    fileName = fileName.slice(0,12) + '...'
                }

                if( fileName )
                    $label.find( 'span' ).html( fileName );
                else
                    $label.html( labelVal );
                if(fileName!=''){
                    // $(this).parent().submit()
                    $(this).parent().find("[type=submit]").trigger( "click" );
                    console.log('submit')
                }
            });


            // Firefox bug fix
            $input
            .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
            .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
        }
    );
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
    var d = new Date()
    var date = Number(d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear()
    renderTimeTable(date);
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

function getCourseID(course) {
    if (course == null || course.course_id == null) {
        return "";
    }
    return course.course_id
}

function getLectureID(lecture) {
    if (lecture == null || lecture.lecture_id == null) {
        return "";
    }
    return lecture.lecture_id;
}

function hasAssignment(lecture) {
    if (lecture == null || lecture.assignment_available == null) {
        return false;
    }
    return lecture.assignment_available
}

function hasAssignmentNotification(lecture) {
    if (lecture == null || lecture.assignment_to_be_seen == null) {
        return false;
    }
    return lecture.assignment_to_be_seen
}

function hasNotes(lecture) {
    if (lecture == null || lecture.notes_available == null) {
        return false;
    }
    return lecture.notes_available
}

function hasNotesNotification(lecture) {
    if (lecture == null || lecture.notes_to_be_seen == null) {
        return false;
    }
    return lecture.notes_to_be_seen
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
        period = ' PM'
    }
    return hours + ':' + minutes + period 
}

class Lecture {
    constructor(course_name, lecture) {
        this.course_name = course_name,
        this.lecture_id = getLectureID(lecture)
        this.has_assignment = hasAssignment(lecture)
        this.has_assignment_notification = hasAssignmentNotification(lecture)
        this.has_notes = hasNotes(lecture)
        this.has_notes_notification = hasNotesNotification(lecture)
        this.lecture_time = getLectureTime(lecture)
        this.date_time = new Date(lecture.date_time)
    }
}

function renderTimeTable(date) {
    $('.test').html('')
        $.ajax({
            method: 'GET',
            url: window.location.href +  "/get_time_table",
            data: { date: date }
          }).done(function(data) {
                var lectures = []
                for (const course_index in data.courses) {
                    const course = data.courses[course_index]
                    const course_name = getCourseName(course)
                    for(const lecture_index in course.lectures) {
                        lectures.push(new Lecture(course_name, course.lectures[lecture_index]))
                    }
                }
                lectures.sort(function(a, b) { return a.date_time.getTime() - b.date_time.getTime() })

                for (var i = 0; i < lectures.length; i++) {
                        $('.test').append(
                        `  <div class="container-fluid m-0">
                        <div class="row-border">
                        <ul class="list-inline mt-2 d-flex container-fluid">
                            <li class="col-2 pt-3 list-inline-item">${lectures[i].lecture_time}</li>
                            <li class="col-2 pt-3 list-inline-item">${lectures[i].course_id}</li>
                            <li class="col-5 pt-3 list-inline-item">${lectures[i].course_name}<sup><i class="fa fa-circle fa-smaller"></i></sup></li>
                            <li class="down-arrow col-1 list-inline-item icon-padding"><img src="static/images/as4.png" style="width:31px" height="31px"></li>
                            <li class="down-arrow2 col-1 list-inline-item icon-padding"><img src="static/images/n-1.png" style="width:31px" height="31px"></li>
                      </ul>
                      <div class="line-break"></div>
                      <div class="action d-none">
                        <ul class="list-inline d-flex container">
                          <li class="upload col-6 pt-2 list-inline-item">
                          ${(() => {
                            if (lectures[i].has_assignment) {
                                return `<button lecture_id=${lecture_id} class="btn-radius btn-dashboard btn"><i class="icon mr-2 fa fa-cloud-download fa-lg"></i>Assignment</button>`
                            } else {
                                return `<button disabled lecture_id=${lecture_id} class="btn-radius btn-dashboard btn"><i class="icon mr-2 fa fa-cloud-download fa-lg"></i>Assignment</button>`
                            }
                          })()}
                          </li>
                            <li class="col-6 pt-2 list-inline-item">
                              <form class="form" id="uploadAssignment">
                              ${(() => {
                                if (has_assignment) {
                                    return `<input type="file" name="assignment" id="file-1" class="inputfile inputfile-1"/>`
                                } else {
                                    return `<input disabled type="file" name="assignment" id="file-1" class="inputfile inputfile-1"/>`
                                }
                              })()}
                                  <label for="file-1" class="p-2"><i class="icon ml-1 fa fa-plus"></i><span class="ml-2">Submit Assignment</span></label>
                                  <i class="ml-1 fa fa-times d-none" style="color: rgb(43, 43, 43);"></i>
                                <input class="btn-dashboard btn d-none" type="submit" value="Upload">
                            </form>
                          </li>
                        </ul>
                      </div>
                      <div class="action2 d-none">
                        <ul class="list-inline d-flex container">
                        ${(() => {
                            if (has_notes) {
                                return `<li class="upload col-12 pt-3 list-inline-item"><button lecture_id=${lecture_id} class="btn-radius btn-dashboard btn"><i class="icon mr-2 fa fa-cloud-download fa-lg"></i>Download Notes</button></li>`
                            } else {
                                return `<li class="upload col-12 pt-3 list-inline-item"><button disabled lecture_id=${lecture_id} class="btn-radius btn-dashboard btn"><i class="icon mr-2 fa fa-cloud-download fa-lg"></i>Download Notes</button></li>`
                            }
                          })()}
                          <li class="upload col-12 pt-3 list-inline-item"><button disabledd lecture_id=${lecture_id} class="btn-radius btn-dashboard btn"><i class="icon mr-2 fa fa-cloud-download fa-lg"></i>Download Notes</button></li>
                        </ul>
                      </div>
                      <div class="progress progress-upload d-none">
                        <div class="progress-bar" role="progressbar" style="width: 0%;"></div>
                      </div>
                    </div>
                  </div>`)
            }
          }).done(function(){
                toggle();
                downloadEventListeners()
                inputTagFileName();
                uploadAssignment();
          });
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

function uploadAssignment(){
    $('#uploadAssignment').submit(function(e){
        e.preventDefault()
        console.log('inside fx')
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "save-post")
        xhr.upload.addEventListener("progress", (e)=>{
            const percent = (e.loaded/e.total)*100;
            $(this).parent().parent().parent().parent().find('.progress').removeClass('d-none')
            $(this).parent().parent().parent().parent().find('.progress-bar').css('width', `${percent}%`)
            $(this).find('.progress-bar').css('width', `${percent}%`)
        })
        xhr.setRequestHeader("Content-Type", "multipart/form-data")
        var fd = new FormData($(this)[0])
        // console.log(fd.get('assignment'))
        xhr.send(fd)
    })
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function downloadEventListeners(){
    $('.btn-dashboard').click(function(){
        console.log($(this).attr('lecture_id'))
    })
}

}
