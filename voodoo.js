var downtown = new DonutShop("Downtown", 11, 80, 220, 10, 4),
    capitolHill = new DonutShop("Capitol Hill", 8, 5, 45, 45, 2),
    southLakeUnion = new DonutShop("South Lake Union", 14, 180, 250, 5, 6),
    wedgewood = new DonutShop("Wedgewood", 5, 20, 60, 20, 1.5),
    ballard = new DonutShop("Ballard", 12, 25, 175, 33, 1);

//Calculate the donuts per hour, and total donuts needed
downtown.calculateDonuts();
capitolHill.calculateDonuts();
southLakeUnion.calculateDonuts();
wedgewood.calculateDonuts();
ballard.calculateDonuts();

//Every location has a button, attach event listeners to each button
var locationButtons = document.querySelectorAll("th.locationButton");

for(var i = 0; i < locationButtons.length; i++) {
  locationButtons[i].addEventListener('mouseover', function(e) {displayVoodoo(e);}, false)
  locationButtons[i].addEventListener('mouseout', function(e) {displayVoodoo(e);}, false)
}

function DonutShop(address, hoursOpen, footTrafficLow, footTrafficHigh, percentEntering, donutsPerEntrant) {

  this.address = address;
  this.hoursOpen = hoursOpen;
  this.footTrafficLow = footTrafficLow;
  this.footTrafficHigh = footTrafficHigh;
  this.percentEntering = percentEntering;
  this.donutsPerEntrant = donutsPerEntrant;
  //var self = this;
  //.bind .apply data binding
  //var _something - underscore is used to denote private
  this.totalDonuts = 0;
  this.donutsEachHour = [];

  this.randomTraffic = function() {
    return Math.round(this.footTrafficLow + Math.floor(Math.random() * (this.footTrafficHigh - this.footTrafficLow + 1)));
  };

  this.donutsThisHour = function() {
    return Math.round(this.donutsPerEntrant * this.randomTraffic() * (this.percentEntering / 100));
  };

  this.calculateDonuts = function() {
    for(var i = 0; i < this.hoursOpen; i++) {
      this.donutsEachHour[i] = this.donutsThisHour();
      this.totalDonuts += this.donutsEachHour[i];
    }
  };

}

function displayVoodoo(event) {

  /*currentLocation is set to the "id" of whatever button is currently firing
  the event*/
  var currentLocation = window[event.target.id],
      voodooTable = document.getElementById("voodooTable"),
      newHead,
      newRow,
      newData,
      timeConversion;

  //Clear the <tbody> of any content that it might already contain
  while (voodooTable.firstChild) {
    voodooTable.removeChild(voodooTable.firstChild);
  }

  /*If the mouse is LEAVING a button area, we've removed the <tbody> content
  already, and can simply clear the "Location" & "Total" text, then return*/
  if (event.type == "mouseout") {
    document.getElementById("locationName").textContent = "No Location Selected";
    document.getElementById("total").textContent = "";
    return;
  }

  //Fill in the location name in the pre-existing table data element
  document.getElementById("locationName").textContent = currentLocation.address;

  for (var i = 0; i < currentLocation.donutsEachHour.length; i++) {
    //Create initial table row element
    newRow = document.createElement("tr");
    newRow.setAttribute("bgcolor", "cfcfcf");

    //Create and fill in table header element containing the hour of the day
    newHead = document.createElement("th");
    /*Convert the current hour (0, 1, 2, etc.) to a more human readable
    form (10 am, 11 am, 12 pm, etc.).*/
    newHead.textContent = 7 + i;
    if (newHead.textContent == 12) {
      newHead.textContent += " pm";
    }
    else if (newHead.textContent > 12) {
      newHead.textContent -= 12;
      newHead.textContent += " pm";
    }
    else {
      newHead.textContent += " am";
    }
    newRow.appendChild(newHead);

    //Create and fill in table data element containing the number of donuts
    newData = document.createElement("td");
    newData.setAttribute("align", "center");
    newData.textContent = currentLocation.donutsEachHour[i];
    newRow.appendChild(newData);

    voodooTable.appendChild(newRow);
  }

  //Fill in the total donuts for the day in the pre-existing table data element
  document.getElementById("total").textContent = currentLocation.totalDonuts;

}

