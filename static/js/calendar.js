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

