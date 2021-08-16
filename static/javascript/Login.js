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


async function getResults(name, callback){
    var yesCount = 0;
    var noCount = 0;
    for (; yesCount < 3 && noCount < 3 ;) {
        const response = await getSingleResult(name);
        if(response['verified'] == "True"){
            console.log("Max similarity :",response['max_similarity']);
            yesCount+=1;
        } else {
            console.log("Max similarity :",response['max_similarity']);
            noCount+=1;
        }
        console.log('Yes Count :',yesCount);
        console.log('No Count :',noCount);
    }

    return new Promise((resolve, reject) => {
        if (yesCount > 2) {
            resolve("True");
        } else if (noCount > 2) {
            resolve("False");
        }
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
            console.log(x);
            if(x == "True") {
                FRAuth.value = "True";
                loginForm.submit();
            } else if (x == "False") {
                photoError.hidden = false;
            }
        })
})



