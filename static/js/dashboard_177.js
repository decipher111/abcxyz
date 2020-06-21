const MAX_LENGTH = 35;
var comment_type

if(window.location.pathname == '/'){
$(document).ready(function() {
var date = Number(
new Date().getMonth() + 1) + '/' +
new Date().getDate() + '/' + 
new Date().getFullYear()
current_date = date
current_data = null 
updateTimeTableDate(formatDate(date))
lecture_id_to_elem = new Map()
dynamicEventListeners()
datetoggle()

function dynamicEventListeners(){
toggle()
enableToolTips()
downloadListener('assignment')
downloadListener('notes')
submitFormOnStateChange()
uploadListener()
submissionListener()
characterCounter()
appendComment()
getComments()
}

function toggle(){
$('.down-arrow').click(function(){
$('.test').find('.view-comments').addClass("comments-closed");
$('.comment-container').addClass('d-none')
$('.test').find('.row-border-expanded3').removeClass("row-border-expanded3");
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
$('.test').find('.view-comments').addClass("comments-closed");
$('.comment-container').addClass('d-none')
$('.test').find('.row-border-expanded3').removeClass("row-border-expanded3");
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
if(e.target.value.split( '\\' ).pop().length < 100){
var $input = $(this), $label = $input.next( 'label' ), labelVal = $label.html();
var fileName = '';
$(this).parent().children('label').children('.icon').addClass('d-none')

if( this.files && this.files.length > 1 )
fileName = ( this.getAttribute( 'data-multiple-caption') || '' ).replace( '{count}', this.files.length );
else if( e.target.value )
fileName = e.target.value.split( '\\' ).pop();

if(fileName.length > 16 && window.matchMedia("(min-width: 720px)").matches===true){
fileName = fileName.slice(0,11) + ' ...'
}
else if(fileName.length > 12 && window.matchMedia("(max-width: 720px)").matches===true){
fileName = fileName.slice(0,9) + ' ...'
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

$('#date-next').click(
function(){
let calendar = getCalendar();
updateTime(calendar.nDay);
drawAll()
updateTimeTableDate(formatDate(current_date))
})

$('#date-prev').click(function(){
let calendar = getCalendar();
updateTime(calendar.pDay);
drawAll()
updateTimeTableDate(formatDate(current_date))
})
}

// Toggle Helper Functions
function formatDate(strDate){
var dateArr = strDate.split('/')
let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var strView = `${(dateArr[1])} ${monthArr[dateArr[0]-1]} ${dateArr[2]}`
return strView;
}

function updateTimeTableDate(formattedDate){
$('#date-view').html(formattedDate)
}

function getCourseName(course) {
if (course == null || course.course_name == null) {
return "";
}
if (course.course_name.length > MAX_LENGTH) {
return course.course_name.slice(0, MAX_LENGTH - 4) + ' ...';
}
return course.course_name;
}

function getLectureID(lecture) {
if (lecture == null || lecture.lecture_id == null) {
return "";
}
return lecture.lecture_id;
}

function filename(entry, document_type) {
if (entry.file_name == null) {
return 'Not available';
}
if(entry.file_name.length > 18){
return entry.file_name.slice(0,15) + ' ...'
}
if(entry.file_name.length > 12 && window.matchMedia("(max-width: 720px)").matches===true){
return entry.file_name.slice(0,7) + ' ...'
}
return entry.file_name
}

function isAvailable(entry) {
if (entry.available == null) {
return false;
}
return entry.available
}

function notify(entry) {
if (entry.to_be_seen == null) {
return false;
}
return entry.to_be_seen
}

function timeAgo(entry) {
if (entry.time_ago == null) {
return '';
}
return 'uploaded ' + entry.time_ago + ' ago'
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
return hours + ':' + '0' + minutes + period 
}
else return hours + ':' + minutes + period 
}

function getTotalSubmissions(submission) {
if (submission.total_submissions == null) {
return 0
}
return submission.total_submissions
}

function getUnviewedSubmissions(submission) {
if (submission.unviewed_submissions == null) {
return 0
}
return submission.unviewed_submissions
}

class Notes {
constructor(lecture) {
this.available = isAvailable(lecture.notes)
this.notify = notify(lecture.notes)
this.time_ago = timeAgo(lecture.notes)
this.file_name = filename(lecture.notes, 'Notes')
}
}

class Assignment {
constructor(lecture) {
this.available = isAvailable(lecture.assignment)
this.notify = notify(lecture.assignment)
this.time_ago = timeAgo(lecture.assignment)
this.file_name = filename(lecture.assignment, 'Assignment')
}
}

class Submission {
constructor(lecture) {
this.total_submissions = getTotalSubmissions(lecture.submission)
this.unviewed_submissions = getUnviewedSubmissions(lecture.submission)
this.available = isAvailable(lecture.submission)
this.file_name = filename(lecture.submission, 'Submission')
this.time_ago = timeAgo(lecture.submission)
}
}

class Lecture {
constructor(course_name, section, lecture, role) {
this.course_name = course_name
this.section = section
this.is_professor = (role == 'Professor')
this.lecture_id = getLectureID(lecture)
this.lecture_time = getLectureTime(lecture)
this.date_time = new Date(lecture.date_time)

this.assignment = new Assignment(lecture)
this.notes = new Notes(lecture)
this.submission = new Submission(lecture)
}
}

function renderTimeTable() {
$.ajax({
method: 'GET',
async: false,
url: window.location.href + 'get_time_table',
data: { date: current_date }
}).done(function(data) {
current_data = data
if(data != null && data != undefined) {
$('.test').html('')
renderLectures(data)
}
}).done(function() {
lecture_id_to_elem = new Map()
for (let i = 0; i < $('.test').children().length; i++) {
lecture_id_to_elem[
$('.test').children()[i].children[0].getAttribute(
'lecture_id')] = $('.test').children()[i].children[0]
//$('.test').children(i).first().children()
}
dynamicEventListeners()
}).catch(function() {
alert('Error loading data. Please contact Chalkboards support')
})
}

function getCalendarNotification(date, calendar_notifications_set){
if(current_data != null && current_data != undefined) {
for (const course_index in current_data.courses) {
const course = current_data.courses[course_index]
for(const notification_index in course.calendar_notifications) {
calendar_notifications_set.add(
course.calendar_notifications[notification_index])
}
}
}
}

function getTopBorder() {
return '<div class="row-border first-lecture"'
}

function getBottomBorder() {
return '<div class="row-border last-lecture"'
}

function getNotesNoDot() {
return `<sup><i class="fa fa-circle notes-available-dot d-none"></i></sup>`
}

function getNotesOrangeDot(){
return `<sup><i class="fa fa-circle notes-available-dot"></i></sup>`
}

function getAssignmentGreenDotNoOrangeDot() {
return `<sup><i class="fa fa-check assignment-submitted-dot"></i><i class="fa fa-circle assignment-available-dot d-none"></i></sup>`
}

function getAssignmentNoGreenDotOrangeDot() {
return `<sup><i class="fa fa-check assignment-submitted-dot d-none"></i><i class="fa fa-circle assignment-available-dot"></i></sup>`
}

function getAssignmentNoGreenDotNoOrangeDot() {
return `<sup><i class="fa fa-check assignment-submitted-dot d-none"></i><i class="fa fa-circle assignment-available-dot d-none"></i></sup>`
}

function getAssignmentButtonForProfessor(lecture) {
if (lecture.assignment.available) {
return `<form class="form" id="uploadAssignment" enctype="multipart/form-data">
<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile"/>
<label for="file-1" class="p-2 assignment-uploaded label-assignment btn-dashboard"><span class="ml-1 mr-1">${lecture.assignment.file_name}</span></label>
<div class="days-ago days-ago-assignment">${lecture.assignment.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
} else {
return `<form class="form" id="uploadAssignment" enctype="multipart/form-data"><input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile "/>
<label for="file-1" class="p-2 label-assignment btn-dashboard"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Add Assignment</span></label><input class="btn d-none" type="submit" value="Upload">
<div class="days-ago days-ago-assignment d-none">${lecture.assignment.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
}
}

function getAssignmentButtonForStudent(lecture) {
label_notify = lecture.assignment.notify ? 'label_notify' : '';
return '<button' + (lecture.assignment.available ? ' ' : ' disabled ') + 
`lecture_id=${lecture.lecture_id} class="btn-dashboard btn btn-assignment ${label_notify}">` +
`<i class="icon mr-2 fa fa-download fa-lg"></i>${lecture.assignment.file_name}` + 
`</button><div class="days-ago days-ago-assignment">${lecture.assignment.time_ago}</div>`
}

function getNotesButtonForProfessor(lecture) {
if (lecture.notes.available) {
return `<form class="form" id="uploadNotes" enctype="multipart/form-data">
<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="notes" id="file-1" class="inputfile"/>
<label for="file-1" class="p-2 notes-uploaded label-notes btn-dashboard"><span class="ml-1 mr-1">${lecture.notes.file_name}</span></label>
<div class="days-ago days-ago-notes">${lecture.notes.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
} else {
return `<form class="form" id="uploadNotes" enctype="multipart/form-data"><input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="notes" id="file-1" class="inputfile "/>
<label for="file-1" class="p-2 label-notes btn-dashboard"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Add Notes</span></label><input class="btn d-none" type="submit" value="Upload">
<div class="days-ago days-ago-notes d-none">${lecture.notes.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
}
}

function getNotesButtonForStudent(lecture) {
label_notify = lecture.notes.notify ? 'label_notify' : '';
return '<button' + (lecture.notes.available ? ' ' : ' disabled ') +
`class="btn-dashboard btn btn-notes ${label_notify}"><i class="icon mr-2 fa fa-download fa-lg"></i>${lecture.notes.file_name}</button>
<div class="days-ago days-ago-notes">${lecture.notes.time_ago}</div>`
}

function getSubmissonButtonForProfessor(lecture) {
label_notify = lecture.submission.unviewed_submissions > 0 ? 'label_notify' : '';
return '<button' + (lecture.assignment.available ? ' ' : ' disabled ') + 
`class="btn-dashboard btn btn-submissions ${label_notify}"></i>Submissions</button>` + 
` <div class="days-ago submissions-data">${lecture.submission.unviewed_submissions} new (of ${lecture.submission.total_submissions} total) submissions</div>`
}

function getSubmissonButtonForStudent(lecture) {
if (lecture.submission.available) {
return `<form class="form" id="submitAssignment" enctype="multipart/form-data">
<input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile"/>
<label for="file-1" class="p-2 assignment-submitted label-assignment btn-dashboard"><span class="ml-1 mr-1">${lecture.submission.file_name}</span></label>
<div class="days-ago days-ago-submission">${lecture.submission.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
} else if (lecture.assignment.available) {
return `<form class="form" id="submitAssignment" enctype="multipart/form-data"><input type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile "/>
<label for="file-1" class="p-2 label-assignment btn-dashboard"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label><input class="btn d-none" type="submit" value="Upload">
<div class="days-ago days-ago-submission d-none">${lecture.submission.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
} else {
return `<form class="form" id="submitAssignment" enctype="multipart/form-data"><input disabled type="file" accept="application/pdf,image/*,application/msword,.doc,.docx" name="assignment" id="file-1" class="inputfile "/>
<label for="file-1" class="p-2 label-assignment btn-dashboard"><i class="icon ml-1 fa fa-plus"></i><span class="ml-1 mr-1">Submit</span></label><input class="btn d-none" type="submit" value="Upload">
<div class="days-ago days-ago-submission d-none">${lecture.submission.time_ago}</div><input class="btn d-none" type="submit" value="Upload"></form>`
}
}

function renderLectures(data){
$('.loader').hide()
var lectures = []
for (const course_index in data.courses) {
const course = data.courses[course_index]
const section = course.section.slice(0,8) + (course.section.length > 11 ? ' ...':'');
const course_name = getCourseName(course)
const role = course.role
for(const lecture_index in course.lectures) {
lectures.push(new Lecture(course_name, section, course.lectures[lecture_index], role))
}
}
lectures.sort(function(a, b) { return a.date_time.getTime() - b.date_time.getTime() })

if(lectures.length == 0){
$('.test').html('<div class="mt-5 text-center" style="font-style: italic"><h7>There are no lectures scheduled for this day</h7></div>')
}
else{
for(var i = 0; i < lectures.length; i++) {
$('.test').append(
` <div class="container-fluid m-0">
${(() => {
var border = ''
if (i == 0) {
border += ' first-lecture'
} 
if (i == lectures.length - 1) {
border += ' last-lecture'
} 
return `<div class="row-border ${border}" lecture_id=${lectures[i].lecture_id}>`
})()}
<ul class="list-inline mt-2 d-flex container-fluid">
<li class="col-2 pt-3 list-inline-item">${lectures[i].lecture_time}</li>
<li class="col-2 pt-3 list-inline-item">${lectures[i].section}</li>
<li class="col-5 pt-3 list-inline-item">${lectures[i].course_name}</li>
<li class="down-arrow col-1 list-inline-item icon-padding" tooltip="Homework"><img src="static/images/task-icon.png" style="width:30px" height="30px">
${(() => {
if (lectures[i].assignment.available) {
if (lectures[i].submission.available) {
return getAssignmentGreenDotNoOrangeDot()
} 
if (lectures[i].assignment.notify || lectures[i].submission.unviewed_submissions > 0) {
return getAssignmentNoGreenDotOrangeDot()
}
if (lectures[i].is_professor) {
    return getAssignmentGreenDotNoOrangeDot()
}
}
return getAssignmentNoGreenDotNoOrangeDot()
})()}
</li>
<li class="down-arrow2 col-1 list-inline-item icon-padding" tooltip="Notes"><img src="static/images/borrow-book-icon.png" style="width:30px" height="29px">
${(() => {
if (lectures[i].notes.available) {
if (lectures[i].notes.notify) {
return getNotesOrangeDot()
}
}
return getNotesNoDot()
})()}
</li>
</ul>
<div class="line-break"></div>
<div class="action d-none">
<ul class="list-inline d-flex container">
<li class="col-6 pt-2 list-inline-item">
${(() => {
if (lectures[i].is_professor) {
return getAssignmentButtonForProfessor(lectures[i])
} else {
return getAssignmentButtonForStudent(lectures[i])
}
})()}
</li>
<li class="upload col-6 pt-2 list-inline-item">
${(() => {
if (lectures[i].is_professor) {
return getSubmissonButtonForProfessor(lectures[i])
} else {
return getSubmissonButtonForStudent(lectures[i])
}
})()}
</li>
</ul>
<div class="view-comments view-comment-assignment comments-closed">View Comments<i class="fa fa-caret-down pl-2 pr-2" aria-hidden="true"></i></div>
<div class="progress progress-upload d-none">
<div class="progress-bar" role="progressbar" style="width: 0%;"></div>
</div>
</div>
<div class="action2 d-none">
<ul class="list-inline d-flex container">
<li class="col-12 pt-2 list-inline-item">
${(() => {
if (lectures[i].is_professor) {
return getNotesButtonForProfessor(lectures[i])
} else {
return getNotesButtonForStudent(lectures[i])
}
})()}
</li>
</ul>
<div class="view-comments view-comment-notes comments-closed">View Comments<i class="fa fa-caret-down pl-2 pr-2" aria-hidden="true"></i></div>
<div class="progress progress2 progress-upload progress-upload2 d-none">
<div class="progress-bar progress-bar2" role="progressbar" style="width: 0%;"></div>
</div>
</div>
<div class="comment-container d-none">
<form class="comment-form">
<ul class="list-inline mt-2 d-flex container-fluid">
<li class="col-9 list-inline-item m-0 underline">
<input class="form-control form-control-sm comment-input" type="text" placeholder="Add a comment">
</li>
<li class="col-2 list-inline-item m-0 underline">
<div class="character-count">0/180</div>
</li>
<li class="col-1 list-inline-item" id="send-btn-height">
<button type="submit" class="btn submit-comment m-1"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
</li>
</ul>
</form>
<div class="comments"></div>
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
getUploadSignedURL(
$(this), "notes", "upload_notes", updateBackend)
}
if($(this).attr('id')=='submitAssignment'){
getUploadSignedURL(
$(this), "submission", "submit_assignment", updateBackend)
}
if($(this).attr('id')=='uploadAssignment'){
getUploadSignedURL(
$(this), "assignment", "upload_assignment", updateBackend)
}
})
}


function getUploadSignedURL(
element, document_type, call, callback){
var x = element.children('input[type=file]')[0];
if (x.files.length == 0) {
return;
}
var content_type = x.files[0].type
var file_name = x.files[0].name

var thisLecture = element.parent().parent().parent().parent()
if (thisLecture == undefined || thisLecture.length == 0) {
return;
}
lecture_id = thisLecture[0].getAttribute('lecture_id')
var response = {status :false}

$.ajax({
method: 'GET',
url: window.location.href + "get_upload_url",
data: {
lecture_id: lecture_id,
document_type: document_type,
content_type : content_type,
date: current_date,
file_name: file_name
}
}).done(function(signed_url) {
const xhr = new XMLHttpRequest();
xhr.open("PUT", signed_url, true)
xhr.upload.addEventListener("progress", (e)=>{
const percent = (e.loaded/e.total)*100;
thisLecture.find('.progress').removeClass('d-none')
thisLecture.find('.progress-bar').css('width', `${percent}%`)
})
xhr.onreadystatechange = function()
{
if (xhr.readyState == 4 && xhr.status == 200)
{
callback(
thisLecture, lecture_id, file_name, call, response);
if(response.status == false){
alert('File Not Uploaded')
}
}
}; 
xhr.setRequestHeader("Content-Type", content_type)
var fd = new FormData()
fd.append('fileName', JSON.stringify(x.files[0].name));
fd.append('fileData', x.files[0]);
xhr.send(fd)
})

}

function updateUI(data) {
for (const course_index in data.courses) {
const course = data.courses[course_index]
const section = course.section.slice(0,8) + (
course.section.length > 11 ? ' ...':'');
const course_name = getCourseName(course)
const role = course.role
for(const lecture_index in course.lectures) {
let update_lecture = new Lecture(
course_name, section, course.lectures[lecture_index], role)
lecture_elem = lecture_id_to_elem[update_lecture.lecture_id]
lecture_elem
.getElementsByClassName('assignment-available-dot')[0]
.classList
.add('d-none')
lecture_elem
.getElementsByClassName('assignment-submitted-dot')[0]
.classList
.add('d-none')
lecture_elem
.getElementsByClassName('notes-available-dot')[0]
.classList
.add('d-none')

if (update_lecture.assignment.available) {
lecture_elem
.getElementsByClassName('days-ago-assignment')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('days-ago-assignment')[0]
.innerHTML = `${update_lecture.assignment.time_ago}`
if (update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('label-assignment')[0]
.classList
.add('assignment-uploaded')
} else {
lecture_elem
.getElementsByClassName('btn-assignment')[0]
.removeAttribute('disabled')
}
} else if (!update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('days-ago-assignment')[0]
.classList
.add('d-none')
lecture_elem
.getElementsByClassName('btn-assignment')[0]
.setAttribute('disabled', true)
}

if (update_lecture.notes.available) {
lecture_elem
.getElementsByClassName('days-ago-notes')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('days-ago-notes')[0]
.innerHTML = `${update_lecture.notes.time_ago}`
if (update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('label-notes')[0]
.classList
.add('notes-uploaded')
} else {
lecture_elem
.getElementsByClassName('btn-notes')[0]
.removeAttribute('disabled')
}
} else if (!update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('days-ago-notes')[0]
.classList
.add('d-none')
lecture_elem
.getElementsByClassName('btn-notes')[0]
.setAttribute('disabled', true)
}

if (update_lecture.assignment.notify) {
lecture_elem
.getElementsByClassName('assignment-available-dot')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('btn-assignment')[0]
.classList
.add('label_notify')
} else if (!update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('btn-assignment')[0]
.classList
.remove('label_notify')
}

if (update_lecture.notes.notify) {
lecture_elem
.getElementsByClassName('notes-available-dot')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('btn-notes')[0]
.classList
.add('label_notify')
} else if (!update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('btn-notes')[0]
.classList
.remove('label_notify')
}

if (update_lecture.submission.available) {
lecture_elem
.getElementsByClassName('assignment-submitted-dot')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('label-assignment')[0]
.classList
.add('assignment-submitted')
lecture_elem
.getElementsByClassName('days-ago-submission')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('days-ago-submission')[0]
.innerHTML = `${update_lecture.submission.time_ago}`
} else if (!update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('label-assignment')[0]
.classList
.remove('assignment-submitted')
lecture_elem
.getElementsByClassName('days-ago-submission')[0]
.classList
.add('d-none')
}

if (update_lecture.submission.unviewed_submissions > 0) {
lecture_elem
.getElementsByClassName('assignment-available-dot')[0]
.classList
.remove('d-none')

lecture_elem
.getElementsByClassName('submissions-data')[0]
.classList
.remove('d-none')
lecture_elem
.getElementsByClassName('submissions-data')[0]
.innerHTML = `${
update_lecture.submission.unviewed_submissions} new (of ${
update_lecture.submission.total_submissions} total) submissions`

lecture_elem
.getElementsByClassName('btn-submissions')[0]
.classList
.add('label_notify')
} else if (update_lecture.is_professor) {
lecture_elem
.getElementsByClassName('btn-submissions')[0]
.classList
.remove('label_notify')
lecture_elem
.getElementsByClassName('submissions-data')[0]
.classList
.add('d-none')
}
}
}
current_data = data
drawAll(true)
}

function updateBackend(
thisLecture, lecture_id, file_name, call, response) {
$.ajax({
method: 'GET',
async : false,
url: window.location.href + call,
data: {
lecture_id: lecture_id, 
file_name: file_name,
date: current_date
}
}).done(function(data){
thisLecture.find('.progress').addClass('d-none')
updateUI(data)
response.status = true
})
}


function downloadListener(document_type){
$('.btn-' + document_type).click(function(){
var lecture = $(this).parent().parent().parent().parent();
var lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id');
let filename = null;
$.ajax({
method: 'GET',
url: window.location.href + "get_download_url",
data: {
lecture_id: lecture_id, 
document_type: document_type,
date: current_date
}
}).done(function(signed_url) {
fetch(signed_url, {
method: "GET",
}).then(function(resp){
if (resp.status == '200'){
return resp.blob()
}
}).then(function(blob){
let response = {
status : false
}
$.ajax({
method: 'GET',
url: window.location.href + 'view_' + document_type,
async: false,
data: {
lecture_id: lecture_id, 
date: current_date
}
}).done(function(data){
lecture.find('.progress').addClass('d-none')
updateUI(data)
filename = data.file_name
response.status = true
})
if(response.status==true)
return blob
}).then(blob => {
createDownloadBLOB(blob, filename)
})
.catch(() => alert('Could not fetch assignment'));
})})
}

function createDownloadBLOB(blob, filename){
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.style.display = 'none';
a.href = url;
// the filename you want
if (filename != undefined) {
a.download = filename;
}
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
}

//View Submissions
function submissionListener(){
$('.btn-submissions').click(function() {
lecture_id = $(this).closest('div[lecture_id]').attr('lecture_id')
window.location.href = window.location.href + `table?lecture_id=${lecture_id}&date=${current_date}`
})
}











//Comments 
function getComments(){
var comments_box;
$('.view-comments').click(function(){
 $(this).toggleClass('comments-closed')
 if($(this).hasClass('view-comment-assignment')){
 comment_type = 'assignment'
 $(this).parent().parent().toggleClass('row-border-expanded3')
 comments_box = $(this).parent().next().next().children().eq(1)
 }
 else{
 comment_type = 'notes'
 $(this).parent().parent().toggleClass('row-border-expanded3')
 comments_box = $(this).parent().next().children().eq(1)
 }
 
 
 var lecture_id = $(this).parent().parent().attr('lecture_id')
 
 $(this).parent().parent().find('.comment-container').toggleClass('d-none')
 comments_box.html('')
 if($(this).hasClass('comments-closed') == false){
 $.ajax({
 method: 'GET',
 url: window.location.href + 'get_comments',
 data: {
 lecture_id: lecture_id,
 comment_type: comment_type,
 date: current_date
 }
 }).done(function(data) {
 if(data.comments.length == 0){
 comments_box.prepend(`<div id="no-comments-yet"><br><br><br><br><br>Be the first one to add a comment here</div>`)
 } else {
 for(i=0; i<data.comments.length; i++){
 var comment = data.comments[i]
 commentHTML = getCommentHTML(comment)
 comments_box.prepend(commentHTML)
 }
 }
 })
 }
})
}

function appendComment(){
$('.comment-form').submit(function(e){
e.preventDefault()
var date = new Date();
var timestamp = date.getTime();
var comment_text = $(this).children(0).children(0).children(0).val().trim()
$(this).children(0).children(0).children(0).val('')

if(comment_text.length>0){

var lecture_id = $(this).parent().parent().attr('lecture_id')
var comment_section = $(this)

$.ajax({
method: 'GET',
url: window.location.href + 'add_comment',
data: {
lecture_id: lecture_id,
date: current_date,
comment_text: comment_text,
comment_type: comment_type
}
}).done(function(comment) {
var commentHTML = getCommentHTML(comment)
if(comment.is_first_comment){
comment_section.next().html('')
}
comment_section.next().prepend(commentHTML)
})
}
})
}

function getCommentHTML(comment){
 return `
 <div class="comment-wrapper ` + (comment.is_self ? 'self-comment' : '') +`" comment_id="${comment.comment_id}">
 <div class="single-comment ` + (comment.is_professor ? 'professor-comment' : '') + `">
 <div class="comment-text">${comment.comment_text}</div>
 <div "comment-name-timestamp">
 <div class="comment-name">${comment.username} &middot;</div>
 <div class="comment-timestamp">${comment.timestamp}</div>
 </div>
 </div>
 </div>`
}

function characterCounter(){
$('.comment-input').on('keyup', function(){
var characters = $(this).val().split('');
console.log(characters.length)
$(this).parent().next().children(0).html(`${characters.length}/180`);
if(characters.length>180){
 $(this).parent().next().next().children(0).attr("disabled","")
}
if(characters.length ==1 || characters.length==180){
 $(this).parent().next().next().children(0).removeAttr("disabled")
}
})
}

function calendarHoverListener(){
 $('.custom-tooltip-2').hover(function(){
 let day = $(this).attr('data-day');
 let month = $(this).attr('data-month');
 let year = $(this).attr('data-year');
 let strDate = `${Number(month) + 1}/${day}/${year}`;
 $.ajax({
 method: 'GET',
 url: window.location.href + 'get_tooltip_notification',
 data: { date: strDate }
 }).done(function(data) {
  let div = $(this).children(0)
   div.css("visibility", "visible")
 if (data.new_notes + data.new_assignments + data.new_submissions + data.submissions_due == 0) {
     return;
 }
 new_notes = data.new_notes > 0 ? (
     data.new_notes + ' new lecture notes have been uploaded<br>') : '';
 new_assignments = data.new_assignments > 0 ? (
     data.new_assignments + ' new assignments have been uploaded<br>') : '';
 new_submissions = data.new_submissions > 0 ? (
     data.new_submissions + ' new submissions have been made by students<br>') : '';
 submissions_due = data.submissions_due > 0 ? (
     data.submissions_due + ' submissions are due for the lectures of this day<br>') : '';

 div.html(`
 <div class="notification-title">
${submissions_due} submissions are due
${new_submissions} new submissions
${new_assignments} new assignments
${new_notes} new notes
 </div>`)
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


initCalendar();

// App methods
function initCalendar() {
eventsTrigger();
drawAll();
}

// draw Methods
function drawAll(doNotRenderTimetable=false) {
drawWeekDays();
drawMonths();
if (!doNotRenderTimetable) {
renderTimeTable();
}
drawDays();
drawYearAndCurrentDay();
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

var calendar_notifications = new Set()
var selected_date = `${new Date(
calendar.nMonth).getMonth()}/1/${new Date(
calendar.nMonth).getFullYear()}`;
getCalendarNotification(selected_date, calendar_notifications);

let daysTemplate = "";
current_date = (calendar.active.month + 1) + '/' + calendar.active.day + '/' + calendar.active.year;
days.forEach(day => {

var dateNotification = formatNotificationDate(day)

if(day.currentMonth && calendar_notifications.has(dateNotification)){
daysTemplate += `
<li class="custom-tooltip-2 ${day.currentMonth ? '' : ' another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" date-notification="yes" data-year="${day.year}"><div class="dot"></div></li>
`
}
else daysTemplate += `
<li class="custom-tooltip-2 ${day.currentMonth ? '' : ' another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" date-notification="yes" data-year="${day.year}"></li>
`
});

elements.days.innerHTML = daysTemplate;
}

function formatNotificationDate(day){
    day_number = day.dayNumber + '';
    month_number = (day.month + 1) + '';
    if (day.dayNumber < 10) {
        day_number = '0' + day.dayNumber
    }
    if (day.month < 10) {
        month_number = '0' + (day.month + 1);
    }
    return month_number + '/' + day_number + '/' + day.year;
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

//Event Listener Setup here
elements.days.addEventListener('click', e => {
let element = e.srcElement;
let day = element.getAttribute('data-day');
let month = element.getAttribute('data-month');
let year = element.getAttribute('data-year');
if (!day) return false;
let strDate = `${Number(month) + 1}/${day}/${year}`;
updateTime(strDate);
drawAll()
updateTimeTableDate(formatDate(current_date))
});


}

function updateTime(time) {
date = +new Date(time);
current_date = (
(new Date(date).getMonth()+1) + '/' +
new Date(date).getDate() + '/' +
new Date(date).getFullYear())
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

drawAll();
});

}