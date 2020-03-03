window.onload = function() {
  const URL = 'doorbellclip.mp3';
    
  const context = new AudioContext();
  const LButton = document.querySelector('#playL');
  const MButton = document.querySelector('#playM');
  const RButton = document.querySelector('#playR');

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");

  output.innerHTML = slider.value/40 + ' ms delay';

  slider.oninput = function() {
    output.innerHTML = this.value/40 + ' ms delay';
  } 
    
  let yodelBuffer;

  window.fetch(URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      LButton.disabled = false;
      MButton.disabled = false;
      RButton.disabled = false;
      yodelBuffer = audioBuffer;
    });
    
    LButton.onclick = () => play(yodelBuffer, 'left');
    MButton.onclick = () => play(yodelBuffer, 'mid');
    RButton.onclick = () => play(yodelBuffer, 'right');

  function play(audioBuffer, direction) {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
      
    //var splitter = context.createChannelSplitter(2);
    //source.connect(splitter);

    var leftDelay = context.createDelay();
    var rightDelay = context.createDelay();
    
    var delay = slider.value/40;
      
    if (direction == 'mid') {
        leftDelay.delayTime.value = 0/1000;
        rightDelay.delayTime.value = 0/1000;
    } else if (direction == 'left') {
        leftDelay.delayTime.value = 0/1000;
        rightDelay.delayTime.value = delay/1000;
    } else if (direction == 'right') {
        leftDelay.delayTime.value = delay/1000;
        rightDelay.delayTime.value = 0/1000;
    }

    //splitter.connect(leftDelay, 0);
    //splitter.connect(rightDelay, 1);

    source.connect(leftDelay, 0);
    source.connect(rightDelay, 0);
      
    var merger = context.createChannelMerger(2);
    leftDelay.connect(merger, 0, 0);
    rightDelay.connect(merger, 0, 1);
      
    merger.connect(context.destination);
      
    source.start();
  }
};