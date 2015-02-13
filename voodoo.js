var downtown = new DonutShop("Downtown", 11, 80, 220, 10, 4),
    capitolHill = new DonutShop("Capitol Hill", 8, 5, 45, 45, 2),
    southLakeUnion = new DonutShop("South Lake Union", 17, 180, 250, 5, 6),
    wedgewood = new DonutShop("Wedgewood", 5, 20, 60, 20, 1.5),
    ballard = new DonutShop("Ballard", 12, 25, 175, 33, 1),
    customShop = "";

//Calculate the donuts per hour, and total donuts needed
downtown.calculateDonuts();
capitolHill.calculateDonuts();
southLakeUnion.calculateDonuts();
wedgewood.calculateDonuts();
ballard.calculateDonuts();

var transitioningTables = [];
var tableDiv = document.getElementById("tableDiv");
//Every location has a button, attach event listeners to each button
var locationButtons = document.querySelectorAll("th.locationButton");
var showHideButton = document.getElementById("showHideButton");
showHideButton.addEventListener("click", showCustom, false);

var customSubmit = document.getElementById("customSubmit");
customSubmit.addEventListener("click", submitCustom, false);

for(var i = 0; i < locationButtons.length; i++) {
  locationButtons[i].addEventListener('click', buttonClicked, false)
}

document.getElementById("forbiddenDonut").addEventListener('click', forbiddenFunction, false);

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

function buttonClicked(event) {

  if (event.target.activeSelection) {
    event.target.activeSelection = false;
    event.target.className = "locationButton";
    removeVoodoo(event);
  }

  else {

    var voodooTable = document.getElementById("voodooTable");
    if(voodooTable) {
          voodooTable.buttonOwner.activeSelection = false;
          voodooTable.buttonOwner.className = "locationButton";
          removeVoodoo(event);
    }
    event.target.activeSelection = true;
    event.target.className = "locationButtonSelected";
    displayVoodoo(event);
  }

}

function displayVoodoo(event) {

  /*currentLocation is set to the "id" of whatever button is currently firing
  the event*/
  var currentLocation = window[event.target.getAttribute("donutObject")],
      voodooTable;

  voodooTable = document.createElement("table");
  voodooTable.buttonOwner = event.target;
  voodooTable.id = "voodooTable";
  voodooTable.appendChild(voodooHead(currentLocation));
  voodooTable.appendChild(voodooBody(currentLocation));
  voodooTable.appendChild(voodooFoot(currentLocation));

  voodooTable.addEventListener("transitionend", transitionFinished, false);
  voodooTable.className = "newTable";
  tableDiv.appendChild(voodooTable);

  setTimeout(function() {voodooTable.className = "currentTable";}, 10);

}

function voodooHead(currentLocation) {

  var newTableHead,
      newRow,
      newHead;

  newTableHead = document.createElement("thead")
  newRow = document.createElement("tr");
  newHead = document.createElement("th");
  newHead.setAttribute("colspan", "2");
  newHead.textContent = currentLocation.address;
  newHead.id = "locationHead"
  newRow.appendChild(newHead);
  newTableHead.appendChild(newRow);

  newRow = document.createElement("tr");
  newHead = document.createElement("th");
  newHead.textContent = "Time";
  newRow.appendChild(newHead);

  newHead = document.createElement("th");
  newHead.textContent = "Donuts";
  newRow.appendChild(newHead);

  newTableHead.appendChild(newRow);

  return newTableHead;
}

function voodooBody(currentLocation) {

  var newTableBody,
      newRow,
      newHead,
      newData;

  newTableBody = document.createElement("tbody");
  for (var i = 0; i < currentLocation.donutsEachHour.length; i++) {
    //Create initial table row element
    newRow = document.createElement("tr");

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
    newHead.setAttribute("align", "center");
    newRow.appendChild(newHead);

    //Create and fill in table data element containing the number of donuts
    newData = document.createElement("td");
    newData.setAttribute("align", "center");
    newData.textContent = currentLocation.donutsEachHour[i];
    newRow.appendChild(newData);

    newTableBody.appendChild(newRow);
  }

  return newTableBody;
}

function voodooFoot(currentLocation) {

  var newTableFoot,
      newRow,
      newHead,
      newData;

  newTableFoot = document.createElement("tfoot")
  newRow = document.createElement("tr");
  newRow.setAttribute("height", "10");
  newTableFoot.appendChild(newRow);

  newRow = document.createElement("tr");
  newHead = document.createElement("th");
  newHead.textContent = "Total";
  newData = document.createElement("td");
  newData.setAttribute("align", "center");
  newData.textContent = currentLocation.totalDonuts;
  newRow.appendChild(newHead);
  newRow.appendChild(newData);

  newTableFoot.appendChild(newRow);

  return newTableFoot;
}

function removeVoodoo(event) {

  var oldTable = document.getElementById("voodooTable");
  oldTable.id = "";
  oldTable.className = "oldTable";

}

function transitionFinished(event) {

  if (event.target.className == "currentTable") {
    event.target.finishedTransition = true;
    //voodooTable.removeEventListener("transitionend", transitionFinished, false);
  }
  else {
    event.target.removeEventListener("transitionend", transitionFinished, false);
    tableDiv.removeChild(event.target);
  }
}

function showCustom(event) {

  var customDonuts = document.getElementById("customDonuts");

  if (customDonuts.className == "customDonutsHidden") {
    customDonuts.className = "customDonutsShown";
    event.target.textContent = "-";
  }
  else {
    customDonuts.className = "customDonutsHidden";
    event.target.textContent = "+";
  }
}

function submitCustom(event) {

    var customName = document.getElementById("customName").value,
        customTime = parseInt(document.getElementById("customTime").value),
        customLowTraffic = parseInt(document.getElementById("customLowTraffic").value),
        customHighTraffic = parseInt(document.getElementById("customHighTraffic").value),
        customEntering = parseInt(document.getElementById("customEntering").value),
        customDonutPerEntrant = parseInt(document.getElementById("customDonutPerEntrant").value);

    customShop = new DonutShop(customName, customTime, customLowTraffic, customHighTraffic, customEntering, customDonutPerEntrant);
    customShop.calculateDonuts();

    buttonClicked(event);
}

function forbiddenFunction(event) {

  var body = document.getElementById("bodyContainer"),
      message = document.getElementById("forbiddenMessage");

  if(body.className == "forbiddenAnimation") {
    body.className = undefined;
    message.style.display = "none";
  }

  else {
    body.className = "forbiddenAnimation";
    message.style.display = "block";
  }

}
