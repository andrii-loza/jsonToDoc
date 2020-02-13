$(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();

        let reader = new FileReader();
        reader.onload = function () {
            makePostRequest(reader.result);
        };

        let file = document.forms[0].elements[1].files[0];
        reader.readAsText(file);
    });

    function makePostRequest(dataJson) {
        let xhr = new XMLHttpRequest();
        let url = "url";
        xhr.open("POST", '/json/send-json', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                if(res) alert('Now check ./files folder in the project root directory');
            }
        };

        xhr.send(dataJson);
    }

    document.querySelectorAll('.blue-button')[1].addEventListener('click', () => {
        document.querySelector("input[type='file']").click();
    });

    document.querySelectorAll('.blue-button')[0].addEventListener('click', (e) => {
        document.querySelector('#back').click();
    });

    $("#inp-file").change(function (e) {
        if (e.target.files.length > 0) document.querySelector('#send').style.display = 'inline-block';
    });

});