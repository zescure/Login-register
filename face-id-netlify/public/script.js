const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights")
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error(err));
}

async function getDescriptor() {
  const result = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true)
    .withFaceDescriptor();

  if (!result) throw new Error("Wajah tidak terdeteksi");
  return result.descriptor;
}

async function register() {
  try {
    const email = document.getElementById("email").value;
    const descriptor = await getDescriptor();

    const res = await fetch("/.netlify/functions/register", {
      method: "POST",
      body: JSON.stringify({ email, descriptor: Array.from(descriptor) })
    });

    const data = await res.json();
    document.getElementById("status").innerText = data.message;
  } catch (e) {
    document.getElementById("status").innerText = e.message;
  }
}

async function login() {
  try {
    const email = document.getElementById("email").value;
    const descriptor = await getDescriptor();

    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      body: JSON.stringify({ email, descriptor: Array.from(descriptor) })
    });

    const data = await res.json();

    if (data.message.includes("berhasil")) {
      location.href = "index.html";
    } else {
      document.getElementById("status").innerText = data.message;
    }
  } catch (e) {
    document.getElementById("status").innerText = e.message;
  }
}
