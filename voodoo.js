var downtown,
    capitolHill,
    southLakeUnion,
    wedgewood,
    ballard,
    customShop,
    $tableDiv;

$(function() {

  downtown = new DonutShop("Downtown", 11, 80, 220, 10, 4);
  capitolHill = new DonutShop("Capitol Hill", 8, 5, 45, 45, 2);
  southLakeUnion = new DonutShop("South Lake Union", 17, 180, 250, 5, 6);
  wedgewood = new DonutShop("Wedgewood", 5, 20, 60, 20, 1.5);
  ballard = new DonutShop("Ballard", 12, 25, 175, 33, 1);
  customShop = "";

  //Calculate the donuts per hour, and total donuts needed
  downtown.calculateDonuts();
  capitolHill.calculateDonuts();
  southLakeUnion.calculateDonuts();
  wedgewood.calculateDonuts();
  ballard.calculateDonuts();

  $tableDiv = $("#tableDiv");

  $("th.locationButton").on("click", buttonClicked);

  $("#showHideButton").on("click", showCustom);

  $("#customSubmit").on("click", submitCustom);

  $("#forbiddenDonut").on("click", forbiddenFunction);

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
        $voodooTable;

    $voodooTable = $("<table>");
    $voodooTable[0].buttonOwner = event.target;
    $voodooTable.attr("id", "voodooTable");
    $voodooTable.append(voodooHead(currentLocation));
    $voodooTable.append(voodooBody(currentLocation));
    $voodooTable.append(voodooFoot(currentLocation));

    $voodooTable.on("transitionend", transitionFinished);
    $voodooTable.attr("class", "newTable");
    $tableDiv.append($voodooTable);

    setTimeout(function() {$voodooTable.attr("class", "currentTable");}, 10);

  }

  function voodooHead(currentLocation) {

    var $newTableHead,
        $newRow,
        $newHead;

    $newTableHead = $("<thead>")
    $newRow = $("<tr>");
    $newHead = $("<th>");
    $newHead.attr("colspan", "2");
    $newHead.text(currentLocation.address);
    $newHead.attr("id", "locationHead");
    $newRow.append($newHead);
    $newTableHead.append($newRow);

    $newRow = $("<tr>");
    $newHead = $("<th>");
    $newHead.text("Time");
    $newRow.append($newHead);

    $newHead = $("<th>");
    $newHead.text("Donuts");
    $newRow.append($newHead);

    $newTableHead.append($newRow);

    return $newTableHead;
  }

  function voodooBody(currentLocation) {

    var $newTableBody,
        $newRow,
        $newHead,
        $newData;

    $newTableBody = $("<tbody>");
    for (var i = 0; i < currentLocation.donutsEachHour.length; i++) {
      //Create initial table row element
      $newRow = $("<tr>");

      //Create and fill in table header element containing the hour of the day
      $newHead = $("<th>");
      /*Convert the current hour (0, 1, 2, etc.) to a more human readable
      form (10 am, 11 am, 12 pm, etc.).*/
      $newHead.text(7 + i);
      if ($newHead.text() == 12) {
        $newHead.append(" pm");
      }

      // else if (newHead.textContent > 12) {  //Old non-Jquery way of doing below, left for posterity
      //   newHead.textContent -= 12;
      //   newHead.textContent += " pm";
      // }
      else if ($newHead.text() > 12) {
        $newHead.text($newHead.text() - 12);
        $newHead.append(" pm");
      }
      else {
        $newHead.append(" am");
      }
      $newHead.attr("align", "center");
      $newRow.append($newHead);

      //Create and fill in table data element containing the number of donuts
      $newData = $("<td>");
      $newData.attr("align", "center");
      $newData.text(currentLocation.donutsEachHour[i]);
      $newRow.append($newData);

      $newTableBody.append($newRow);
    }

    return $newTableBody;
  }

  function voodooFoot(currentLocation) {

    var $newTableFoot,
        $newRow,
        $newHead,
        $newData;

    $newTableFoot = $("<tfoot>")
    $newRow = $("<tr>");
    $newRow.attr("height", "10");
    $newTableFoot.append($newRow);

    $newRow = $("<tr>");
    $newHead = $("<th>");
    $newHead.text("Total");
    $newData = $("<td>");
    $newData.attr("align", "center");
    $newData.text(currentLocation.totalDonuts);
    $newRow.append($newHead);
    $newRow.append($newData);

    $newTableFoot.append($newRow);

    return $newTableFoot;
  }

  function removeVoodoo(event) {

    var $oldTable = $("#voodooTable");
    $oldTable.removeAttr("id");
    $oldTable.attr("class", "oldTable");

  }

  function transitionFinished(event) {


    if (event.target.className == "currentTable") {
      event.target.finishedTransition = true;
      //voodooTable.removeEventListener("transitionend", transitionFinished, false);
    }
    else {
      $(event.target).off("transitionend");
      $(event.target).remove();
    }
  }

  function showCustom(event) {

    var $customDonuts = $("#customDonuts");

    if ($customDonuts.attr("class") == "customDonutsHidden") {
      $customDonuts.attr("class", "customDonutsShown");
      event.target.textContent = "-";
    }
    else {
      $customDonuts.attr("class", "customDonutsHidden");
      event.target.textContent = "+";
    }
  }

  function submitCustom(event) {

      var customName = $("#customName").val(),
          customTime = parseInt($("#customTime").val()),
          customLowTraffic = parseInt($("#customLowTraffic").val()),
          customHighTraffic = parseInt($("#customHighTraffic").val()),
          customEntering = parseInt($("#customEntering").val()),
          customDonutPerEntrant = parseInt($("#customDonutPerEntrant").val());

      customShop = new DonutShop(customName, customTime, customLowTraffic, customHighTraffic, customEntering, customDonutPerEntrant);
      customShop.calculateDonuts();

      buttonClicked(event);
  }

  function forbiddenFunction(event) {

    var $body = $("#bodyContainer"),
        $message = $("#forbiddenMessage");

    if($body.attr("class") == "forbiddenAnimation") {
      $body.removeAttr("class");
      $message.css("display", "none");
    }

    else {
      $body.attr("class", "forbiddenAnimation");
      $message.css("display", "block");
    }

  }

});
