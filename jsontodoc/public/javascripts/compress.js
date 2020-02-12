function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('img').setAttribute('src', e.target.result);

        };

        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('input_file').addEventListener('change', function () {
    readURL(this);
});

document.getElementById('btn').addEventListener('click', function () {
    const src_image = document.getElementById('img').getAttribute('src');
    fetch('http://localhost:3000/image-compress/compress', {
        method: 'post',
        body: JSON.stringify({src: src_image}),
        headers: {'Content-type': 'application/json'}
    }).then(res => res.json())
        .then(res => {
            debugger
            document.getElementById('compressed_img').setAttribute('src',__dirname);
        })
});
