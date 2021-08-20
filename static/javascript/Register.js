
const registerForm = document.getElementById("registerForm");
const photoError = document.getElementById('photoError');
const position = document.getElementById('position');
const captureBtn = document.getElementById('captureBtn');
const nameError = document.getElementById('nameError');
const passwordError = document.getElementById('passwordError');
const registerName = document.getElementById('name');
const registerPassword = document.getElementById('password');
const videoModal = document.getElementById('videoModal');
const submitBtn = document.getElementById('submitBtn');
const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const close = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
  videoModal.style.display = "none";
}

const constraints = {
    audio: false,
    video: {
        width: 500,
        height: 500
    },

};

function getImage() {
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
}

// Function to convert Data URL to blob
function dataURItoBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});

}

async function sendFR(name) {
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    var img = canvas.toDataURL("image/png");
    const response = await sendImage(dataURItoBlob(img),name);

    return await response.result;
}

async function sendImage(image,name) {
    // add file to FormData object
    const fd = new FormData();
    fd.append('file', image);
    fd.append('name', name)

//    const response = await fetch('http://127.0.0.1:8000/register', {
    const response = await fetch('http://it3100-chuaqihan-finalapiserver.southeastasia.azurecontainer.io/register', {
        method: 'POST',
        body: fd
    })

    return await response.json();
}


submitBtn.addEventListener('click', () => {
    var errors = false;
    if (registerName.value == null || registerName.value == "") {
        nameError.innerHTML = "Please enter your name";
        nameError.hidden = false;
        errors = true;
    } else if(nameList.includes(registerName.value)) {
        nameError.innerHTML = "Staff by that name already exists";
        nameError.hidden = false;
        errors = true;
    } else {
        nameError.hidden = true;
    }
    if (registerPassword.value == null || registerPassword.value == "") {
        passwordError.innerHTML = "Please enter your password";
        passwordError.hidden = false;
        errors = true;
    } else if (registerPassword.value.length < 8){
        passwordError.innerHTML = "Password must be longer than 8 characters";
        passwordError.hidden = false;
        errors = true;
    } else {
        passwordError.hidden = true;
    }
    if (!errors) {
        videoModal.style.display = "block";
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          player.srcObject = stream;
        })
    }
});

captureBtn.addEventListener('click', () => {
    sendFR(registerName.value).then(function(result) {
        if(result=="False") {
            photoError.hidden = false;
        } else if(result=="Done") {
            registerForm.submit();
        } else {
            photoError.hidden = true;
            position.innerHTML = result;
        }
    })
})