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

function updateWeatherData(result) {
    $("#city").text("City: " + result.location.name);
    $("#temp").text("Temp: " + result.current.temp_c + "°C");
    $("#cloud").text("Cloud: " + result.current.cloud + "%");
    $("#icon-text").text(result.current.condition.text);
}





});





