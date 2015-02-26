$(document).ready(function(){

    $('#overlay').height($(window).height());
    $('#overlay').width($(window).width());
});

$(window).resize(function() {
    $('#overlay').height($(window).height());
    $('#overlay').width($(window).width());
    
    $('#player').height($(window).height());
    $('#player').width($(window).width());
});
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  var playlistArray;
  var playListArrayLength;
  var maxNumber;

  var thePlaylist = 'PLOy6YI5RlRjcK0qwyv_63oNsEE41bRGAQ';
  var firstLoad = true;
  var loadingGif = document.getElementById('loading');

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      enablejsapi: 1,
      playerVars: { 'autoplay': 0, 'controls': 0,'autohide':1,'wmode':'opaque' },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onError
      }
    });
    jQuery('#player').height($(window).height());
    jQuery('#player').width($(window).width());
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    console.log('LOADING SOME SHIT');
    event.target.cuePlaylist({
      listType: 'playlist',
      playerVars: { 'autoplay': 1, 'controls': 0,'autohide':1,'wmode':'opaque' },
      list: thePlaylist,
      suggestedQuality: 'small',
    });
  }

  function next() {
    player.loadPlaylist({
      listType: 'playlist',
      list: thePlaylist,
      index: newRandomNumber(),
      startSeconds: '0',
    });
  }

  var oldNumber = 0;
  var NewNumber = 0;

  function newRandomNumber() {
    oldNumber = NewNumber;
    NewNumber = Math.floor(Math.random() * maxNumber);
    if (NewNumber == oldNumber) {
        newRandomNumber();
    } else {
        return NewNumber;
    }
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        next();
    } else {
      if (firstLoad && event.data == YT.PlayerState.CUED) {
        firstLoad = false;
        playlistArray = player.getPlaylist();
        playListArrayLength = playlistArray.length;
        maxNumber = playListArrayLength;
        next();
      } else if (event.data == YT.PlayerState.PLAYING) {
        // document.getElementById( "title" ).textContent = player.getVideoData().title;
        loadingGif.style.display='none';
        document.getElementById( "player" ).style.display='block';
        console.log('PLAYIN SOME SHIT');
      } else if (event.data == YT.PlayerState.BUFFERING) {
        loadingGif.style.display='block';
        console.log('ASK UR MOMS FOR BETTER INTERNET BRUH');
      }
    }
  }

  function onError(event) {
    if (event.data == 2) {
      console.log('Error Code 2: The request contains an invalid parameter value.');
    } else if (event.data == 100) {
      console.log('Error Code 100: The video requested was not found. ');
      next();
    } else if (event.data == 101) {
      console.log('Error Code 101: The owner of the requested video does not allow it to be played in embedded players.');
      next();
    }
  }

  function stopVideo() {
    player.stopVideo();
  }
    