<div class="video-container" style="position: relative; width: 100%; height: 56.25vw; overflow: hidden;">
    <!-- Placeholder image over the video; initially hidden with "display: none" -->
    <img id="loadingImage" src="preview-image" alt="Loading" style="position: fixed; top: -2rem; left: 0; width: 100%; height: 56.25vw; object-fit: cover; z-index: 3; display: none;" onload="showImageAndPlayVideo();">
    
    <!-- Vimeo video; initially paused with "autoplay=0" -->
    <iframe id="vimeoVideo" src="video-placeholder" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position: fixed; top: -2rem; left: 0; width: 100%; height: 56.25vw; z-index: 1;" title=""></iframe>
</div>

<script src="PLACEHOLDER"></script>
<script>
    var iframe = document.querySelector('#vimeoVideo');
    var player = new Vimeo.Player(iframe);

    function showImageAndPlayVideo() {
        // Display the placeholder image once it's loaded
        document.getElementById('loadingImage').style.display = 'block';

        // Play the video 5 seconds after the placeholder image is loaded
        setTimeout(function() {
            player.play();
        }, 5000);  // 5000 milliseconds equals 5 seconds
    }

    // Hide the placeholder image once the video actually starts playing
    player.on('play', function() {
        setTimeout(function() {
            document.getElementById('loadingImage').style.display = 'none';
        }, 300);  // 300 milliseconds delay
    });
</script>
