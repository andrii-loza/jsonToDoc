window.onload = function () {
    document.getElementsByTagName('form')[0].onsubmit = function (event) {
        event.preventDefault();

        let reader = new FileReader();
        reader.onload = function () {
            makePostRequest(reader.result);
        };

        let file = document.forms[0].elements[1].files[0];
        reader.readAsText(file);
    };

    function makePostRequest(dataJson) {
        fetch('/json/send-json', {
            method: 'post',
            body: dataJson,
            headers: {'Content-type': 'application/json'}
        }).then(xhr => {
            if (xhr.status === 200) alert('Now check .public/files folder in the project root directory');

            document.getElementById('inp-file').value = '';
            document.querySelector('#send').style.display = 'none';

            //to download file from back-end

            // let content = xhr.response;
            // let fileName = 'rapport.docx';
            // downloadwithpost(fileName, content);
        });
    }

    document.querySelectorAll('.blue-button')[1].addEventListener('click', () => {
        document.querySelector("input[type='file']").click();
    });

    document.querySelectorAll('.blue-button')[0].addEventListener('click', (e) => {
        document.querySelector('#back').click();
    });

    document.getElementById('inp-file').onchange = function (e) {
        if (e.target.files.length > 0) document.querySelector('#send').style.display = 'inline-block';
    };

    // function downloadwithpost(filename, content) {
    //     let link = document.createElement('a');
    //     let bytes = new Array(content.length);
    //     for (let i = 0; i < content.length; i++) {
    //         bytes[i] = content.charCodeAt(i);
    //     }
    //     let byteArray = new Uint8Array(bytes);
    //     let blob = new Blob([byteArray], {
    //         type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    //     });
    //     let url = URL.createObjectURL(blob);
    //
    //     let a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    // }
};


