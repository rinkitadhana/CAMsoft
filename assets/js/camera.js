// Get video element from the HTML document
const video = document.getElementById('videoElement');

// Check if the browser supports getUserMedia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            // Display the video stream in the video element
            video.srcObject = stream;

            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set the canvas dimensions to match the video stream
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Function to invert the image horizontally
            function invertImageHorizontally() {
                // Draw the current video frame onto the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get the image data from the canvas
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Invert each row of pixels horizontally
                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width / 2; x++) {
                        const i = (y * canvas.width + x) * 4;
                        const mirrorI = (y * canvas.width + (canvas.width - x - 1)) * 4;

                        // Swap pixel RGB values between left and right sides
                        const tempR = data[i];
                        const tempG = data[i + 1];
                        const tempB = data[i + 2];

                        data[i] = data[mirrorI];
                        data[i + 1] = data[mirrorI + 1];
                        data[i + 2] = data[mirrorI + 2];

                        data[mirrorI] = tempR;
                        data[mirrorI + 1] = tempG;
                        data[mirrorI + 2] = tempB;
                    }
                }

                // Put the modified image data back onto the canvas
                context.putImageData(imageData, 0, 0);

                // Set the canvas as the source for the video element
                video.srcObject = canvas.captureStream();
            }

            // Call the invertImageHorizontally() function on each new video frame
            video.addEventListener('play', function () {
                setInterval(invertImageHorizontally, 1000 / 30); // 30 frames per second
            });
        })
        .catch(function (error) {
            console.error('Error accessing the camera:', error);
        });
} else {
    console.error('getUserMedia is not supported in this browser.');
}
