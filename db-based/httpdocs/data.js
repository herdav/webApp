function loadData(slug) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("content").innerHTML = this.responseText;
      }
  };
  xhttp.open("GET", "data.php?slug=" + encodeURIComponent(slug), true);
  xhttp.send();
  history.pushState(null, null, slug);
}

// Funktion zum Überwachen der Adresszeile und Aufrufen von loadData
function monitorAddress() {
  var currentSlug = window.location.pathname.substring(1); // Entferne "/"
  if (currentSlug && currentSlug !== "") {
      loadData(currentSlug);
  }
}

// Lade beim Start und überwache Änderungen in der Adresse
document.addEventListener("DOMContentLoaded", function() {
  monitorAddress();
  window.addEventListener("popstate", monitorAddress);
});
