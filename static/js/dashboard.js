$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    $('[data-toggle="tooltip"]').click(function(){
        $('[data-toggle="tooltip"]').tooltip('hide')
    })
  })

function renderTimeTable(date) {
    console.log(JSON.parse(sessionStorage.getItem('user')));
    $('.test').html('')
        console.log(date)
        $.ajax({
            url: "http://localhost:5000/get_time_table",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify
            ({"date": date})
        }).done(function(data) {
            console.log(data.courses[0].couse_name)

            for(var i = 0; i < data.courses.length; i++) {
                var subjectName = data.courses[i].couse_name
                console.log(subjectName)
                if(subjectName.length>33){
                    subjectName = subjectName.slice(0,32) + '...'
                }
                $('.test').append(
                ` <div class="container-fluid m-0 ml-3 c">
                <div class="row-border pr-2">
                  <ul class="list-inline mt-2 d-flex container-fluid">
                      <li class="col-2 pt-3 list-inline-item">10:00am</li>
                      <li class="col-2 pt-3 list-inline-item">BT0001</li>
                      <li class="col-5 pt-3 special list-inline-item">${subjectName}</li>
                      <li class="col-1 pt-3 list-inline-item">
                      <div id="" class="dropdown show dropright">
                          <a id="a-tag" class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-rotate-180 fa-lg fa-download"></i></a>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                          <a class="dropdown-item">Notes<i class="ml-1 fa fa-check-circle" style="color: green;"></i></a>
                          <a href="" class="ml-4">Upload</a><a href="" class="ml-2">View</a><a href="" class="ml-2 mr-4">Remove</a>
                          <div class="dropdown-divider"></div>
                          <a class="dropdown-item">Assignment</a>
                          <a href="" class="ml-4">Upload</a><a href="" class="ml-2">View</a><a href="" class="ml-2 mr-4">Remove</a>
                          </div>
                      </div>
                      </li>
                      <li class="col-2 pt-3 list-inline-item">
                      <a id="a-tag" href="" data-toggle="tooltip" data-placement="top" title="View Submissions"><i class="fa fa-clipboard fa-lg"></i><sup class="notfication-notes">41</sup></a>
                      </li>
                  </ul>
                </div>
              </div>`)
            }   
        });
  }

