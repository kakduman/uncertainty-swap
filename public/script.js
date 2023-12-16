function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function submitIdea() {
    var idea = document.getElementById('idea-input').value;
    if (idea) {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idea: idea }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(!getCookie('submitted')) {
                setCookie('submitted', 'true', 1);
                retrieveRandom(); // default to one submission
            }
            document.getElementById('random-submission-area').style.display = 'block';
            document.getElementById('idea-input').value = ''; // Clear the textarea
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function retrieveRandom() {
    if(getCookie('submitted')) {
        fetch('/random')
        .then(response => response.json())
        .then(data => {
            document.getElementById('random-idea').innerText = data.idea;
            document.getElementById('random-submission-area').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("Please submit your idea first.");
    }
}
