let quality = null;
let idSelect = null;


function findExt(type) {
    if (type === 'image/png') return 'png';
    else if (type === 'image/jpeg') return 'jpg';

}

function calculateSizeToBytes(totalBytes) {
    let _size;
    if (totalBytes < 1000000) {
        _size = (totalBytes / 1024).toFixed(2) + ' KB';
        return _size
    } else {
        _size = (totalBytes / 1024000).toFixed(2) + ' MB';
        return _size
    }
}

function readURL(input) {
    return new Promise((resolve => {
        quality = null;
        if (input.files && input.files[0]) {
            const size = calculateSizeToBytes(input.files[0].size);
            document.getElementById('size_not_compressed').innerText = `Size: ${size}`;
            document.getElementById('btn').style.display = 'block';
            const ext = findExt(input.files[0].type);
            let reader = new FileReader();

            reader.onload = function (e) {
                document.getElementById('img').setAttribute('src', e.target.result);
                if (idSelect && isSelect(idSelect)) {
                    document.getElementById(idSelect).remove();
                }
                resolve(ext)
            };
            reader.readAsDataURL(input.files[0]);
        }
    }));
}

document.getElementById('input_file').addEventListener('change', function () {
    readURL(this).then((ext) => {
        createSelect(ext)
    });
});

document.getElementById('btn').addEventListener('click', handleData);

function createSelect(ext) {
    const wrapper = document.getElementById('wrapper_select');
    const select = document.createElement('select');
    const opt = document.createElement('option');
    select.setAttribute('id', 'my_select');
    idSelect = select.getAttribute('id');
    opt.selected = true;
    opt.disabled = true;
    opt.innerText = 'Quality';
    select.appendChild(opt);
    select.addEventListener('change', function () {
        quality = this.options[this.selectedIndex].value;
        document.getElementById('btn').disabled = false;
    });

    wrapper.appendChild(select);
    if (ext === 'jpg') {
        for (let i = 5; i <= 100; i += 5) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt);
        }
    } else if (ext === 'png') {
        for (let i = 0.2; i < 1; i += 0.2) {
            const opt = document.createElement('option');
            opt.value = i.toFixed(1);
            opt.innerHTML = i.toFixed(1);
            select.appendChild(opt);
        }
    }
}

function isSelect(idName) {
    const element = document.getElementById(idName);
    if (element.tagName === 'SELECT') return true;
    return false;
}

function handleData() {
    if (quality) {
        const src_image = document.getElementById('img').getAttribute('src');
        const loader = document.querySelector('.loader')
        loader.style.display = 'block';
        fetch('/image-compress/compress', {
            method: 'post',
            body: JSON.stringify({src: src_image, quality}),
            headers: {'Content-type': 'application/json'}
        }).then(res => res.text())
            .then(res => {
                document.getElementById('compressed_img').setAttribute('src', res);
                loader.style.display = 'none';
                checkSize(res);
            })
    }
}

function checkSize(imageUrl) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        const size = calculateSizeToBytes(xhr.response.size);
        document.getElementById('size_compressed').innerText = `Size: ${size}`;
    };
    xhr.send();
}