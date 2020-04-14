$(document).ready(function(){
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="tooltip"]').click(function(){
            $('[data-toggle="tooltip"]').tooltip('hide')
        })
      })
const AVAILABLE_WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const localStorageName = 'calendar-events';

class DASHBOARD {
    constructor(options) {
        this.options = options;
        this.elements = {
            days: this.getFirstElementInsideIdByClassName('calendar-days'),
            week: this.getFirstElementInsideIdByClassName('calendar-week'),
            month: this.getFirstElementInsideIdByClassName('calendar-month'),
            year: this.getFirstElementInsideIdByClassName('calendar-current-year'),
            // eventList: this.getFirstElementInsideIdByClassName('current-day-events-list'),
            // eventField: this.getFirstElementInsideIdByClassName('add-event-day-field'),
            // eventAddBtn: this.getFirstElementInsideIdByClassName('add-event-day-field-btn'),
            currentDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day'),
            currentWeekDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day-of-week'),
            prevYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
            nextYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-next')
        };

        this.date = +new Date();
        this.options.maxDays = 37;
        this.init();
        // this.renderTimeTable();

    }



    renderTimeTable(){
        $('.test').html('')
        var week = 1;
        $.ajax({
            url: "http://localhost:5000/api/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({"week": week})
        }).done(function(data) {
            for (var key in data) {
                var subjectName = data[key]
                if(subjectName.length>33){
                    subjectName = subjectName.slice(0,32) + '...'
                }
                $('.test').append(
                `<div class="container-fluid m-0 ml-3">
                    <div class="row-border">
                    <ul class="list-inline mt-2 d-flex container-fluid">
                        <li class="col-2 pt-3 list-inline-item">10:00am</li>
                        <li class="col-2 pt-3 list-inline-item">BT0001</li>
                        <li class="col-5 pt-3 special list-inline-item">${subjectName}</li>
                        <li class="col-1 pt-3 list-inline-item">
                        <div class="dropdown show">
                            <a id="a-tag" class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-rotate-180 fa-lg fa-download"></i><sup class="notfication-notes"><i class="fa fa-check-circle" style="color: green;"></i></sup></a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item" href="#">Upload Material</a>
                            <a class="dropdown-item" href="#">Upload Assignment</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">View Uploads</a>
                            <a class="dropdown-item" href="#">View Submissions</a>
                            </div>
                        </div>
                        </li>
                        <li class="col-1 pt-3 ml-3 list-inline-item">
                        <div class="dropdown show">
                            <a id="a-tag" class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-clipboard fa"></i><sup class="notfication-notes">3</sup></a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item" href="#">Upload Material</a>
                            <a class="dropdown-item" href="#">Upload Assignment</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">View Uploads</a>
                            <a class="dropdown-item" href="#">View Submissions<sup class="notfication-notes">41</sup></a>
                            </div>
                        </div>
                        </li>
                    </ul>
                    </div>
                </div>`)
            }   
        });
    }

// App methods
    init() {
        // if (!this.options.id) return false;
        this.eventsTrigger();
        this.drawAll();
    }

    


    // draw Methods
    drawAll() {
        this.drawWeekDays();
        this.drawMonths();
        this.drawDays();
        this.drawYearAndCurrentDay();
    }






    drawYearAndCurrentDay() {
        let calendar = this.getCalendar();
        this.elements.year.innerHTML = calendar.active.year;
        this.elements.currentDay.innerHTML = calendar.active.day;
        this.elements.currentWeekDay.innerHTML = AVAILABLE_WEEK_DAYS[calendar.active.week];
        console.log(calendar.active.week)
    }

    


    drawDays() {
        let calendar = this.getCalendar();

        let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, idx) => {
            return {
                dayNumber: this.countOfDaysInMonth(calendar.pMonth) - idx,
                month: new Date(calendar.pMonth).getMonth(),
                year: new Date(calendar.pMonth).getFullYear(),
                currentMonth: false
            }
        }).reverse();


        let daysInActiveMonth = this.range(calendar.active.days).map((day, idx) => {
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


        let countOfDays = this.options.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
        let daysInNextMonth = this.range(countOfDays).map((day, idx) => {
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
            let formatted = this.getFormattedDate(new Date(`${Number(day.month) + 1}/${day.dayNumber}/${day.year}`));
            // newDayParams.hasEvent = this.eventList[formatted];
            return newDayParams;
        });

        let daysTemplate = "";
        days.forEach(day => {
            daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></li>`
        });

        this.elements.days.innerHTML = daysTemplate;
    }

    drawMonths() {
        let availableMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthTemplate = "";
        let calendar = this.getCalendar();
        availableMonths.forEach((month, idx) => {
            monthTemplate += `<li class="${idx === calendar.active.month ? 'active' : ''}" data-month="${idx}">${month}</li>`
        });

        this.elements.month.innerHTML = monthTemplate;
    }

    drawWeekDays() {
        let weekTemplate = "";
        AVAILABLE_WEEK_DAYS.forEach(week => {
            weekTemplate += `<li>${week.slice(0, 3)}</li>`
        });

        this.elements.week.innerHTML = weekTemplate;
    }

    // Service methods
    eventsTrigger() {
        this.elements.prevYear.addEventListener('click', e => {
            let calendar = this.getCalendar();
            this.updateTime(calendar.pYear);
            this.drawAll()
        });

        this.elements.nextYear.addEventListener('click', e => {
            let calendar = this.getCalendar();
            this.updateTime(calendar.nYear);
            this.drawAll()
        });

        this.elements.month.addEventListener('click', e => {
            let calendar = this.getCalendar();
            let month = e.srcElement.getAttribute('data-month');
            if (!month || calendar.active.month == month) return false;

            let newMonth = new Date(calendar.active.tm).setMonth(month);
            this.updateTime(newMonth);
            this.drawAll()
        });


        this.elements.days.addEventListener('click', e => {
            let element = e.srcElement;
            let day = element.getAttribute('data-day');
            let month = element.getAttribute('data-month');
            let year = element.getAttribute('data-year');
            if (!day) return false;
            let strDate = `${Number(month) + 1}/${day}/${year}`;
            this.updateTime(strDate);
            this.drawAll()
            this.renderTimeTable()
        });

    }


    updateTime(time) {
        this.date = +new Date(time);
    }

    getCalendar() {
        let time = new Date(this.date);

        return {
            active: {
                days: this.countOfDaysInMonth(time),
                startWeek: this.getStartedDayOfWeekByTime(time),
                day: time.getDate(),
                week: time.getDay(),
                month: time.getMonth(),
                year: time.getFullYear(),
                formatted: this.getFormattedDate(time),
                tm: +time
            },
            pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
            nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
            pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
            nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
        }
    }

    countOfDaysInMonth(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month + 1, 0).getDate();
    }

    getStartedDayOfWeekByTime(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month, 1).getDay();
    }

    getMonthAndYear(time) {
        let date = new Date(time);
        return {
            year: date.getFullYear(),
            month: date.getMonth()
        }
    }

    getFormattedDate(date) {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }

    range(number) {
        return new Array(number).fill().map((e, i) => i);
    }

    getFirstElementInsideIdByClassName(className) {
        return document.getElementById('calendar').getElementsByClassName(className)[0];
    }


}


(function () {
    new DASHBOARD({

    })
})();

});