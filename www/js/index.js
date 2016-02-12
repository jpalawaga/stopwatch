/* This function adjust the size of the textbox
    on the welcome screen for a nice presentation */
function adjustWelcomeBox() {
    var sizeBox = document.getElementById('width-calc');
    var realBox = document.getElementById('nameBox');
    sizeBox.textContent = realBox.value;

    // Set a minimum size
    maximumSize = realBox.parentNode.clientWidth;
    sz = sizeBox.clientWidth;
    if (sz < 100) {
        sz = 100;
    }

    
    // Adjust the box to be sized based on the text length
    if (realBox.value.length == realBox.maxLength) {
        sizeBox.textContent = sizeBox.textContent + "D"
        if (sizeBox.clientWidth + 50 < maximumSize) {
            realBox.maxLength += 1;
        }
    }
    
    if (realBox.clientWidth + 50 > maximumSize) {
        realBox.value = realBox.value.substring(0, realBox.value.length - 1)
    }
    realBox.setAttribute('style', 'width:' + sz + 'px;');
    /*while (tempBox.clientWidth > tempBox.parentNode.clientWidth) {
        fontSize = window.getComputedStyle(tempBox, null).fontSize;
        newSize = parseInt(fontSize.substring(0, fontSize.length - 2)) - 10;
        box.setAttribute('style', 'font-size:' + newSize + 'px;');
        tempBox.setAttribute('style', 'font-size:' + newSize + 'px;');
        console.log("Resizing");
    }*/
}

$('#nameBox').keypress(function(event) {
  if (event.keyCode == '13') {
     $(location).attr('href', '#pagetwo')
   }
});

var Timer = {
    lapTimes: [],
    _interval: null,
    _elem: null,
    init: function(element) {
        this._elem = element;
    },
    start: function() {
        this.lapTimes.push(new Date());
        this._interval = setInterval(function(that) {
            var t = new Date();
            that._elem.html(formatLapTime(t - that.lapTimes[0]));
        }, 10, this);
        console.log("started!");
    },
    lap: function() {
        var lapTime = new Date()
        var lastTime = this.lapTimes.slice(-1)[0];
        this.lapTimes.push(lapTime)
        var diff = lapTime - lastTime;
        console.log("Lap time:" + formatLapTime(diff))
    },
    stop: function () {
        clearInterval(this._interval);
        console.log("stop!");
    }
}

var timer = Object.create(Timer);
timer.init($('#timer'));

function formatLapTime(time) {
    var timeString = '.' + pad(Math.round(time % 1000 / 10))
    var seconds = Math.floor(time / 1000);
    var minutes = 0;
    
    if (seconds > 60) {
        minutes = Math.floor(seconds / 60);
    }
    
    timeString = pad(minutes) + ":" + pad(seconds % 60) + timeString;
    
    return timeString;
}

function pad(time) {
    var str = '000000' + time;
    return str.substr(str.length - 2, 2);
}

var LapButton = {
    _elem: $('#lapButton'),
    _heldTime: null,
    _interval: null,
    _intervalTime: 1000,
    _pop: false,
    activate: function() {
        this._heldTime = new Date();
        this._interval = setInterval(function(that) {
            timeDiff = (that._heldTime - new Date()) + that._intervalTime;
            percent = ((1000 - timeDiff) / 1000) * 100;
            if (timeDiff < 5) {
                that._pop = true;
                clearInterval(that._interval);
            }
            if (percent > 100) {
                percent = 100;
            }
            $('.background').stop().animate({width: percent + '%'}, 99);
            
        }, 100, this)
    },
    deactivate: function() {
        clearInterval(this._interval);
        $('.background').animate({ width: '0%'}, 500);
        if (this._pop) {
            this.pop();
            this._pop = false;
        }        
    },
    pop: function() {
        timer.lap();
        console.log('Popped!');
    }
}

var lapButton = Object.create(LapButton);
$(function(){
  $( "div#lapButton" ).bind( "vmousedown", tapholddHandler );
    $( "div#lapButton" ).bind( "vmouseup", tapholduHandler );
 
  function tapholddHandler( event ){
    lapButton.activate();
  }
  function tapholduHandler( event ){
    lapButton.deactivate();
  }
});

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
        adjustWelcomeBox();
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
        adjustWelcomeBox();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('#nameBox');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

