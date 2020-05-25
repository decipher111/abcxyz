if (window.location.pathname == '/table') {
    $(document).ready(function() {


        var cookieval = getCookie('someCookie')
        if(cookieval != null){
            console.log(cookieval)
            var encodedSubmissions = decode_flask_cookie(cookieval)
            var submissions = JSON.parse(encodedSubmissions)
            for(var i = 0; i < submissions.submissions.length; i++){            
            $('#submissionTable').append(
                    `
                    <tbody>
                    <tr>
                      <td>${submissions.submissions[i].name}</td>
                      <td>${submissions.submissions[i].section}</td>
                      <td>${submissions.submissions[i].roll_no}</td>
                      <td>${submissions.submissions[i].time}</td>
                      <td><i class="fa fa-download fa-2x"></i></td>
                    </tr>
                  </tbody>
                  `
                )
            }
        }

            else console.log('noCookie')



    });

    function decode_flask_cookie(val) {
        if (val.indexOf('\\') === -1) {
            return val;  // not encoded
        }
        val = val.slice(1, -1).replace(/\\"/g, '"');
        val = val.replace(/\\(\d{3})/g, function(match, octal) { 
            return String.fromCharCode(parseInt(octal, 8));
        });
        return val.replace(/\\\\/g, '\\');
    }
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    

    
}