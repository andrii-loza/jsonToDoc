$(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();

        let reader = new FileReader();
        reader.onload = function () {
            makePostRequest(reader.result);
        };

        let file = document.forms[0].elements[0].files[0];
        reader.readAsText(file);
    });

    function makePostRequest(dataJson) {
        let xhr = new XMLHttpRequest();
        let url = "url";
        xhr.open("POST", '/json/send-json', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {

                var content = xhr.response;
                var fileName = 'rapport.docx'; // You can use the .txt extension if you want
                downloadwithpost(fileName, content);

                // console.log(xhr.responseText);
                // debugger;
                // let json = JSON.parse(xhr.responseText);
                // debugger;
            }
        };

        xhr.send(dataJson);
    }

    function downloadwithpost(filename, content) {
        var link = document.createElement('a');
        var bytes = new Array(content.length);
        // var bytes = new Array(content.length);
        for (var i = 0; i < content.length; i++) {
            bytes[i] = content.charCodeAt(i);
        }
        var byteArray = new Uint8Array(bytes);
        var blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        var url = URL.createObjectURL(blob);
        var oItem = {
            documentId: url,
            fileName: "rapport.docx",
            thumbnailUrl: "",
            url: url,
            selected: true
        };

        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

        // window.location.assign(url);
        // var oUploadCollection = this.getView().byId("uploadCollection");
        // var newItem = new sap.m.UploadCollectionItem(oItem);
        // oUploadCollection.addItem(newItem);
        // oUploadCollection.downloadItem(newItem, true);
    }
});