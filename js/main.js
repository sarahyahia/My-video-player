document.addEventListener("keyup",function(e){
    if(e.key==" "){
        toggle();
    }
    else if(e.key=="ArrowRight"){
        myVideo.currentTime+=2;
    }
    else if(e.key=="ArrowLeft"){
        myVideo.currentTime-=2;
    }
});

let videoId=1;


let myVideo = document.getElementById("myvideo");
let progressValue = document.getElementById("progressValue");
let progressBackground = document.getElementById("progressBackground");
let overlay = document.getElementById("overlay");
let videoSpeed = document.getElementById("videoSpeed");
let subtitleDiv = document.getElementById("subtitle1");
let volumeslider = document.getElementById("volumeSlider");
let time = document.getElementById("time");

/*
let subtitlesArray = [{
    fromTime:1,
    toTime:2,
    text:"Welcome how are you"
},{
    fromTime:2,
    toTime:5,
    text:"I'm good thanks what about you"
},{
    fromTime:5,
    toTime:9,
    text:"I'm well too"
},{
    fromTime:9,
    toTime:12,
    text:"bye bye"
}]
*/

function toggle(){
    if(myVideo.paused){
        play();
       $(document.getElementById("play")).attr('src','imgs/icons8-pause-button-48.png')
    }
    else
    {
        pause();
        $(document.getElementById("play")).attr('src','imgs/icons8-circled-play-48.png')
    }
}

function play(){
    myVideo.play();
    overlay.style.display="none";
}

function stop(){
    pause();
    myVideo.currentTime = "0";
}

function pause(){
    myVideo.pause();
    overlay.style.display="block";
}
function moveForward(){
    myVideo.currentTime += 2;
}

function moveBackward(){
    myVideo.currentTime -= 2;
}


function muteVideo(){

    if (myVideo.muted) {
        myVideo.muted = false;
        myVideo.volume = volumeslider.value / 100;
        $(document.getElementById("mute")).attr('src','imgs/icons8-audio-48.png')
        
       }

    else {
        myVideo.muted = true;
        myVideo.volume = 0;
        $(document.getElementById("mute")).attr('src','imgs/icons8-mute-48.png')
    }

};

function setvolume(){
    myVideo.volume = volumeslider.value / 100;
    //console.log(myVideo.volume);
}

function videoSpeedChanged(){
    myVideo.playbackRate = Number(videoSpeed.value);
}

function fullScreen()
{
  if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
  ) {
      if (document.exitFullscreen) {
      document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      }
  } else {
      element = myVideo.parentElement;
      console.log(myVideo.parentElement);
      if (element.requestFullscreen) {
      element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      console.log(Element);
      } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
      }}
}


function showControls(){
    controls.style.display="block";
    let subtitleStyle = document.getElementById("subtitle").style;
    subtitleStyle.top = "65%";
}

function hideControls(){
    controls.style.display="none";
    let subtitleStyle = document.getElementById("subtitle").style;
    subtitleStyle.top = "80%";

}

progressBackground.addEventListener("click",function(e){
    let maxWidth = progressBackground.clientWidth;
    let barValue = e.offsetX;
    let barValuePercent = barValue/maxWidth;
    let currentTime = myVideo.duration * barValuePercent;
    myVideo.currentTime = currentTime;



})

function getProgressBarWidth(){
    return new Promise(function(resolve,reject){
        
            let t = setInterval(function(){
                if(progressBackground.clientWidth>0){
                    clearInterval(t);
                    resolve(progressBackground.clientWidth);
                }
            },10);
    });
  }

  myVideo.addEventListener("loadedmetadata",async function(e){
    console.log(myVideo.duration);
    console.log('loaded metadata');
    if(localStorage["video"+videoId]){
        myVideo.currentTime = Number(localStorage["video"+videoId]);
  
        let maxWidth = await getProgressBarWidth();
        
        progressValue.style.width = `${(myVideo.currentTime/myVideo.duration) *maxWidth}px` ;
        console.log(progressValue.style.width);
        time.innerHTML = format(myVideo.currentTime) + '/' + format(myVideo.duration);

    }
  })

  myVideo.addEventListener("timeupdate",function(e){
    localStorage["video"+videoId] = myVideo.currentTime;
    /*
    let subtitles = subtitlesArray.filter((item)=>
        myVideo.currentTime>=item.fromTime &&
        myVideo.currentTime<=item.toTime
    );
    if(subtitles.length>0){
        let subtitle = subtitles[0];
        subtitleDiv.innerHTML = subtitle.text;
    }*/
    let maxWidth = progressBackground.clientWidth;
    progressValue.style.width = `${(myVideo.currentTime/myVideo.duration) *maxWidth}px`;
    time.innerHTML = format(myVideo.currentTime)+ '/' + format(myVideo.duration);

  })
 
//console.log({volumeslider});
volumeslider.addEventListener("change",setvolume,false);

//---------------subtitles -----------------------
var subtitles = document.getElementById('subtitles');
console.log(myVideo.textTracks.length);
for (var i = 0; i < myVideo.textTracks.length; i++) {
           myVideo.textTracks[i].mode = 'hidden';
}



var subtitleMenuButtons = [];
var createMenuItem = function(id, lang, label) {
    var listItem = document.createElement('li');
    var button = listItem.appendChild(document.createElement('button'));
       button.setAttribute('id', id);
       button.className = 'subtitles-button';
       if (lang.length > 0) button.setAttribute('lang', lang);
       button.value = label;
      button.setAttribute('data-state', 'inactive');
       button.appendChild(document.createTextNode(label));
       button.addEventListener('click', function(e) {
      // Set all buttons to inactive
    subtitleMenuButtons.map(function(v, i, a) {
    subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
      });
      // Find the language to activate
    var lang = this.getAttribute('lang');
    for (var i = 0; i < myVideo.textTracks.length; i++) {
        // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
        if (myVideo.textTracks[i].language == lang) {
            myVideo.textTracks[i].mode = 'showing';
            this.setAttribute('data-state', 'active');
         }
        else {
            myVideo.textTracks[i].mode = 'hidden';
        }
    }
    subtitlesMenu.style.display = 'none';
       });
    subtitleMenuButtons.push(button);
    return listItem;
}




//to create a list of subtitles in cc button

var subtitlesMenu;
if (myVideo.textTracks) {
   var df = document.createDocumentFragment();
   var subtitlesMenu = df.appendChild(document.createElement('ul'));
   subtitlesMenu.className = 'subtitles-menu';
   subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
   for (var i = 0; i < myVideo.textTracks.length; i++) {
      subtitlesMenu.appendChild(createMenuItem('subtitles-' + myVideo.textTracks[i].language, myVideo.textTracks[i].language, myVideo.textTracks[i].label));
   }
   videoContainer.appendChild(subtitlesMenu);
}







subtitles.addEventListener('click', function(e) {
           if (subtitlesMenu) {
              subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
           }
        });
    //------------------------------------------------------
  

//console.log({myVideo});
function format(s) {
    var m = Math.floor(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
}


//alert();
//alert(format(31));