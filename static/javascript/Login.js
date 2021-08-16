const photoError = document.getElementById('photoError');
const FRAuth = document.getElementById('FRAuth');
const startFRBtn = document.getElementById('startFRBtn');
const loginForm = document.getElementById("loginForm");
const nameError = document.getElementById('nameError');
const passwordError = document.getElementById('passwordError');
const loginName = document.getElementById('name');
const loginPassword = document.getElementById('password');
const videoModal = document.getElementById('videoModal');
const frBtn = document.getElementById('frBtn');
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

async function getSingleResult(name) {
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

    const response = await fetch('http://chuaqihan-192181r-faceverificationserver.southeastasia.azurecontainer.io/login', {
        method: 'POST',
        body: fd
    })

    return await response.json();
}


function getResults(name, callback) {
    var count = 0;
    var yesCount = 0;
    var noCount = 0;
    return new Promise(function (resolve) {
        var testInterval = setInterval(function(){
            getSingleResult(name).then(function(result) {
                console.log(result)
                if(result['verified'] == "True"){
                    console.log(result['max_similarity']);
                    yesCount+=1;
                } else {
                    console.log(result['max_similarity']);
                    noCount+=1;
                }
            });
            console.log(yesCount);
            console.log(noCount);
            if (yesCount+noCount>5){
                if (yesCount>noCount) {
                    clearInterval(testInterval);
                    resolve("True");
                } else {
                    clearInterval(testInterval);
                    resolve("False");
                }
            };
        },2000)
    });
}

submitBtn.addEventListener('click', () => {
    var errors = false;
    if (loginName.value == null || loginName.value == "") {
        nameError.innerHTML = "Please enter your name";
        nameError.hidden = false;
        errors = true;
    } else if(!(nameList.includes(loginName.value))) {
        nameError.innerHTML = "Staff by that name does not exist";
        nameError.hidden = false;
        errors = true;
    } else {
        nameError.hidden = true;
    }
    if (loginPassword.value == null || loginPassword.value == "") {
        passwordError.innerHTML = "Please enter your password";
        passwordError.hidden = false;
        errors = true;
    }
    if (!errors) {
        loginForm.submit();
    }
});

frBtn.addEventListener('click', () => {
    var errors = false;
    passwordError.hidden = true;
    if (loginName.value == null || loginName.value == "") {
        nameError.innerHTML = "Please enter your name";
        nameError.hidden = false;
        errors = true;
    } else if(!(nameList.includes(loginName.value))) {
        nameError.innerHTML = "Staff by that name does not exist";
        nameError.hidden = false;
        errors = true;
    } else {
        nameError.hidden = true;
    }
    if (!errors) {
        videoModal.style.display = "block";
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          player.srcObject = stream;
        })
    }
});

startFRBtn.addEventListener('click', () => {
    photoError.hidden = true;
    getResults(loginName.value)
        .then(function(x) {
            if(x == "True") {
                FRAuth.value = "True";
                loginForm.submit();
            } else if (x == "False") {
                photoError.hidden = false;
            }
        })
})


