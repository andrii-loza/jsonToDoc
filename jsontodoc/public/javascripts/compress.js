let ext = null;
let quality = null;
let idSelect = null;
let idErrorMsg = null;


function findExt(type) {
    if (type === 'image/png') ext = 'png';
    else if (type === 'image/jpeg') ext = 'jpg';
}

function readURL(input, callback) {
    quality = null;
    if (input.files && input.files[0]) {
        findExt(input.files[0].type);
        let reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('img').setAttribute('src', e.target.result);
            document.getElementById('btn').disabled = false;
            if (idSelect && isSelectOrTextField(idSelect)) {
                document.getElementById(idSelect).remove();
            }
            callback()
        };
        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('input_file').addEventListener('change', function () {
    readURL(this, createSelect);
});

document.getElementById('btn').addEventListener('click', handleData);

function createSelect() {
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
    });

    wrapper.appendChild(select);
    if (ext === 'jpg') {
        for (let i = 1; i < 100; i++) {
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

function isSelectOrTextField(idName) {
    const element = document.getElementById(idName);
    if (element.tagName === 'SELECT') {
        return true;
    }
    if (element.tagName === 'P') {
        return true;
    }
    return false;
}

function handleData() {
    if (quality) {
        if (idErrorMsg && isSelectOrTextField(idErrorMsg)) {
            document.getElementById(idErrorMsg).remove();
        }
        idErrorMsg=null;
        const src_image = document.getElementById('img').getAttribute('src');
        fetch('/image-compress/compress', {
            method: 'post',
            body: JSON.stringify({src: src_image, quality, ext}),
            headers: {'Content-type': 'application/json'}
        }).then(res => res.text())
            .then(res => {
                document.getElementById('compressed_img').setAttribute('src', res);
            })
    } else {
        const p = document.createElement('p');
        p.style.color = 'red';
        p.setAttribute('id', 'errorMsg');
        idErrorMsg = p.getAttribute('id');
        const div = document.getElementById('wrapper_select');
        p.innerText = `Quality didn't select`;
        div.appendChild(p);
    }
}