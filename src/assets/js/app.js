$(document).ready(function () {
  ////////////////////////////////
  /*       WEATHER SECTION      */
  ////////////////////////////////

  $("#get-weather-button").on("click", function () {
    const location = $("#location").val();
    getWeather(location);
  
  });

  function getWeather(location) {
    const apiKey = 'API_KEY';
    const address = "http://api.weatherapi.com/v1/current.json?key=";
    const apiUrl = address + apiKey + "&q=" + location;

    fetchWeatherData(apiUrl, function (result) {
      handleWeatherSuccess(result, location);
    }, handleWeatherError
    );
  }

  function fetchWeatherData(apiUrl, successCallback, errorCallback) {
    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: successCallback,
      error: errorCallback,
    });
  }

  function handleWeatherSuccess(result) {
    removeWeatherElements();
    createGraphicInfo(result);
    updateWeatherData(result);
    getWeatherName(result);
  }

  function handleWeatherError(error) {
    console.error("Error fetching weather data:", error);
  }

  function removeWeatherElements() {
    $("#icon").remove();
    $("#weather-header").remove();
    $("#weather-info").addClass('animate');
  }

  function createGraphicInfo(result) {
    const graphicInfoDiv = $("<div>").addClass("graphic-info");
    const iconImg = $("<img>")
      .attr("id", "icon")
      .attr("src", "https:" + result.current.condition.icon)
      .attr("width", 70)
      .css("marginRight", "1.2rem");
    graphicInfoDiv.append(iconImg);
    $(".start-text").append(graphicInfoDiv);
  }
  function getWeatherName(result) {
    weatherText = result.current.condition.text;
    isDay = result.current.is_day;
  }

  function updateWeatherData(result) {
    $("#city").text("City: " + result.location.name);
    $("#temp").text("Temp: " + result.current.temp_c + "°C");
    $("#cloud").text("Cloud: " + result.current.cloud + "%");
    $("#icon-text").text(result.current.condition.text);
  }

  ////////////////////////////////
  /*      POMODORO SECTION      */
  ////////////////////////////////


  const timerElement = $('#timer');
  const startButton = $('#startBtn');
  const pauseButton = $('#pauseBtn');
  const resetButton = $('#resetBtn');
  const workTimeInput = $('#work-time');
  const breakTimeInput = $('#break-time');

  let timer;
  let isBreakTime = false;
  let isTimerRunning = false;
  let timeLeft = 0;
  let pausedTime = 0;
  let initialTime = 0;

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.text(`${minutes}:${seconds}`);
  }

  function startTimer() {
    if (!isTimerRunning) {
      if (pausedTime === 0) {
        initialTime = parseInt(workTimeInput.val()) //* 60;
      }
      timeLeft = initialTime - pausedTime;
      isTimerRunning = true;
      $(".time").animate({
        opacity: 0,
        width: "0",
        height: "0"
      }, 500, function() {
        $(this).css({display:"none"}).css({opacity: 1, width: "auto", height: "auto"}).animate({
          opacity: 1,
        }, 500);
      });
    }
    if (!isBreakTime) {
      determineWeather();
      sound.play();
    }
    timer = setInterval(function () {
      timeLeft--;
      updateTimer();
      if (timeLeft === 0) {
        clearInterval(timer);
        if (isBreakTime) {
          timeLeft = parseInt(workTimeInput.val()) //* 60;
          isBreakTime = false;
          sound.pause();
          playBell();
        } else {
          timeLeft = parseInt(breakTimeInput.val()) //* 60;
          isBreakTime = true;
          sound.pause();
          sound.currentTime = 0;
          playBell();
        }
        
        sound.pause();
        updateTimer();
        startButton.prop('disabled', false);
        pauseButton.prop('disabled', true);
        resetButton.prop('disabled', false);
      }
    }, 1000);
    startButton.prop('disabled', true);
    pauseButton.prop('disabled', false);
  }

  function pauseTimer() {
    clearInterval(timer);
    if (isTimerRunning) {
      pausedTime = initialTime - timeLeft;
    }
    isTimerRunning = false;
    startButton.prop('disabled', false);
    pauseButton.prop('disabled', true);
    resetButton.prop('disabled', false);
    sound.pause();
  }

  function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    timeLeft = parseInt(workTimeInput.val()) * 60;
    pausedTime = 0;
    updateTimer();
    startButton.prop('disabled', false);
    pauseButton.prop('disabled', true);
    resetButton.prop('disabled', false);
   
    isBreakTime = false;
    sound.pause();
    sound.currentTime = 0;
  }

  function playBell() {
    let audioBell;
    const audioPath = `assets/music/bell.mp3`;
    audioBell = new Audio(audioPath);
    audioBell.loop = false;
    audioBell.play();
  }

  workTimeInput.on('input', function () {
    resetTimer();
    updateTimer();
  });

  breakTimeInput.on('input', function () {
    resetTimer();
  });

  startButton.on('click', startTimer);
  pauseButton.on('click', pauseTimer);
  resetButton.on('click', resetTimer);

  resetButton.on('click',function() {
  $(".time").css({
    opacity: 0,
    width: "0",
    height: "0",
    display: "inline"
  }).animate({
    opacity: 1,
    width: "400", 
    height: "180" 
  }, 500);
})
  ////////////////////////////////
  /*      TRACK SECTION      */
  ////////////////////////////////
  let weatherText;
  let isDay;

  function determineWeather() {

    let result;
    if (weatherText === undefined) {
      weatherText = "sunny";
    } else if (weatherText.includes("rain")) {
      weatherText = "rain";
    } else if (weatherText.includes("snow")) {
      weatherText = "snow";
    } else if (!weatherText.includes("rain") && !weatherText.includes("snow") && isDay === 1) {
      weatherText = "sunny";
    } else if (!weatherText.includes("rain") && !weatherText.includes("snow") && isDay === 0) {
      weatherText = "night";
    } else {
      weatherText = "sunny";
    }

    result = `assets/music/${weatherText}.mp3`;

    if (sound.src == "" || sound.attributes[1].textContent != result) {
      sound.setAttribute("src", result);
      sound.load();
      sound.loop = true;
      sound.play();
    }
  }





});





