$(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();

        var formData = new FormData();
        formData.append("userfile", document.forms['form'].file.files[0]);
        var request = new XMLHttpRequest();
        request.open("POST", "http://localhost:3000/json/send-json");
        request.send(formData);


        // let json = JSON.parse($('textarea')[0].value);

        // $.ajax({
        //     type: 'post',
        //     url: '/json/send-json',
        //     data: JSON.stringify(json),
        //     contentType: 'application/json',
        // })
        //     .done((res, status, headers, config) => {
        //         let a = document.createElement('a');
        //         var json = JSON.stringify(res),
        //             blob = base64toBlob(json),
        //             url = window.URL.createObjectURL(blob);
        //         a.href = url;
        //         a.download = 'example.docx';
        //         a.click();
        //         window.URL.revokeObjectURL(url);
        //     })
        //     .fail(() => console.log('fail'));
    });

    function base64toBlob(byteString) {
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: "octet/stream"});
    }

});