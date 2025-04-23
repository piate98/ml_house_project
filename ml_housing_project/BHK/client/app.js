function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

// Function to be executed when the "Estimate Price" button is clicked
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked"); // Debug log for function trigger

  // Retrieving input values from the DOM
  var sqft = document.getElementById("uiSqft");           // Total square feet input field
  var bhk = getBHKValue();                                // Function call to get selected BHK (number of bedrooms)
  var bathrooms = getBathValue();                         // Function call to get selected number of bathrooms
  var location = document.getElementById("uiLocations");  // Dropdown for property location
  var estPrice = document.getElementById("uiEstimatedPrice"); // HTML element to display estimated price

  // Backend endpoint URL (adjust depending on deployment strategy)
  //var url = "http://127.0.0.1:5000/predict_home_price"; // Direct Flask endpoint for local development
  var url = "/api/predict_home_price"; // Use this when proxying via NGINX in production

  // Initiating a POST request to the backend with property details as payload
  $.post(url, {
      total_sqft: parseFloat(sqft.value), // Convert square feet input to a float value
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  }, function(data, status) {
      // Log the raw price returned from backend (in Lakh INR)
      console.log("Price in Lakh:", data.estimated_price);

      // ---------- Currency Conversion Block ----------

      const conversionRate = 83; // Fixed conversion rate: 1 USD = 83 INR
      const priceInINR = data.estimated_price * 100000; // Convert Lakh to full INR
      const priceInUSD = (priceInINR / conversionRate).toFixed(2); // INR to USD conversion, rounded to 2 decimals

      
      estPrice.innerHTML = "<p>$" + priceInUSD + " USD</p>";

      // Log the converted price and status for debugging
      console.log("Price in USD:", priceInUSD);
      console.log(status); 
  });
}


function onPageLoad() {
  console.log( "document loaded" );
  //var url = "http://127.0.0.1:5000/get_location_names"; // used when using local developemnt
  var url = "/api/get_location_names"; // when proxying via NGINX in production
  $.get(url,function(data, status) {
      console.log("got response for get_location_names request");
      if(data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();
          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  });
}

window.onload = onPageLoad;
