/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       app.receivedEvent('deviceready');
       
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
       // listeningElement.setAttribute();
       // receivedElement.setAttribute();
        console.log('Received Event: ' + id + listeningElement + receivedElement);
    }  
};
// displayCurrencies() function getting the JSON through the API key and loading to the screen 
function displayCurrencies(){
    var from = document.getElementById('from');
    var to = document.getElementById('to');
    var http = new XMLHttpRequest();
    http.onreadystatechange=function() {
        if(http.readyState==4 && http.status==200){
            var obj = JSON.parse(this.responseText);
            var options='';
            for(key in obj.rates){
                options=options+ '<option>'+key+'</option>';
            }
            from.innerHTML=options;
            to.innerHTML=options;
        }
    }
    http.open('GET','http://data.fixer.io/api/latest?access_key=f81ccb6d0c03d40e55cbf7817030f9a7', true)
    http.send();
}
//convertCurrency() function converting the currencies
// parsing the FROM and TO elements using the API key 
//saves the result in a variable called result
function convertCurrency(){
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    var amount = document.getElementById('amount').value;
    var http = new XMLHttpRequest();
        http.onreadystatechange=function(){
            if(http.readyState==4 && http.status==200){
                var obj = JSON.parse(this.responseText);
                var curr= obj.rates[to];
                var curr2= obj.rates[from];
                if(curr && curr2!= undefined){
                    result = parseFloat(amount)*parseFloat(curr)/parseFloat(curr2);
                    document.getElementById("show").innerHTML = '<b> Convertion Result: '+result+' '+to+'</b> ';
                }
            }
        }
        http.open('GET', 'http://data.fixer.io/api/latest?access_key=f81ccb6d0c03d40e55cbf7817030f9a7&base'+from+'&symbols'+to, true);
        http.send();
}

function showWeatherInfo(){
    navigator.geolocation.getCurrentPosition(weatherCallback, onError)
}

function weatherCallback (position){
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(latitude,longitude);
}

function showLocInfo(){
    navigator.geolocation.getCurrentPosition(infoCallback, onError)
}

function infoCallback (position){
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getInfo(latitude,longitude);
}

function showMap(){
    navigator.geolocation.getCurrentPosition(geoCallback, onError)
}

function geoCallback (position){
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var latLng = new google.maps.LatLng(latitude, longitude);
    getMap(latLng);
    createMarker(latLng);

    var div = document.getElementById ('location');
    div.innerHTML;
}

function onError(message){
    console.log(message)
}

function getMap(latLng) {
    var mapOptions = { 
        center: latLng,zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function createMarker(latLng) {
    var markerOptions = { 
        position: latLng, map: map, animation: google.maps.Animation.DROP, clickable: true
    }
    var marker = new google.maps.Marker(markerOptions);
    var content = 'You are here: ' + latLng.lat() + ', ' + latLng.lng();
    addInfoWindow(marker, latLng, content);
}

function addInfoWindow(marker, latLng, content) {
    var infoWindowOptions = { 
        content: content, position: latLng
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map);
    });
}

function getInfo(latitude,longitude){
    var http = new XMLHttpRequest(); 
    http.open('GET','https://api.opencagedata.com/geocode/v1/json?q='+latitude+'+'+longitude+'&key=22e5695431c543d682e4d4b52ec743ab', true);
    http.send();
    http.onreadystatechange=(e) => {
    var response = http.responseText; 
    var responseJSON = JSON.parse(response); 
    console.log(responseJSON);

    var country = responseJSON.results[0].components.country;
    console.log(country);
    document.getElementById('country').innerHTML = '<b>[Current Location] </b> <br> Country: '+country;
  
    var city = responseJSON.results[0].components.city;
    console.log(city);
    document.getElementById('city').innerHTML = 'City: ' +city;

    var currency = responseJSON.results[0].annotations.currency.iso_code;
    console.log(currency);
    document.getElementById('currency').innerHTML = 'Currency: '+currency;

    var date = responseJSON.timestamp.created_http;
    console.log(date);
    document.getElementById('date').innerHTML = date;
     
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback);
        function fileSystemCallback(fs){
            // Name of the file I want to create
            var fileToCreate = "File.txt";
            // Opening/creating the file
            fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback);
        }
        var fileSystemOptionals = { create: true, exclusive: false };
        function getFileCallback(fileEntry){
            // Display in the console
            console.log("fileEntry is file?" + fileEntry.isFile.toString());
            var toFrontEnd = document.getElementById('file').innerHTML;
            console.log(toFrontEnd);
            toFrontEnd += "fileEntry is file?" + fileEntry.isFile.toString();
            var dataObj = new Blob(['[My Saved Places]'+ '<br>'+ 'City: '+city+ '<br>' + 'Country: '+ country+ '<br>'+ 'Date: '+date], 
            { type: 'text/plain' });
            // Write to the file
            writeFile(fileEntry, dataObj);
            // Or read the file
            readFile(fileEntry);
        }
        // Let's write some files
        function writeFile(fileEntry, dataObj) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {
                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    dataObj = new Blob([], { type: 'text/plain' });
                }
                fileWriter.write(dataObj);
                fileWriter.onwriteend = function() {
                    console.log(dataObj);
                };
                fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                };
            });
        }
        // Let's read some files
        function readFile(fileEntry) {
            // Get the file from the file entry
            fileEntry.file(function (file) {   
                // Create the reader
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = function() {
                    console.log("Successful file read: " + reader.result);
                    document.getElementById('dataObj').innerHTML = reader.result;
                    console.log("file path: " + fileEntry.fullPath);
                };
            });
        }   
}

}
function getWeather(latitude,longitude){
    var http2 = new XMLHttpRequest(); 
    http2.open('GET','http://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&id=524901&APPID=b86eee3002a716910f47c9070d182188', true);
    http2.send();
    http2.onreadystatechange=(e)=> { 
    var response = http2.responseText; 
    var responseJSON = JSON.parse(response); 
    console.log(responseJSON);

    var weather = responseJSON.list[0].weather[0].description;
    console.log(weather);
    document.getElementById('weather').innerHTML = 'Weather: '+weather;

    var temp = responseJSON.list[0].main.temp;
    console.log(temp);
    tempC = Math.round(temp - 273.15);
    document.getElementById('temp').innerHTML = 'Temperature: '+tempC+' Celsius';
    }
}

function pics(){ 
    navigator.camera.getPicture(cameraCallback);
}

function cameraCallback(imageData) { 
    var image = document.getElementById('myImage'); 
    image.src = imageData;
}




