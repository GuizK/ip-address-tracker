// map

var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);


//button listener (form)

function searchBar(event){
    event.preventDefault();
    let valeurChercher=document.getElementById("search").value.trim();
    console.log(valeurChercher);

    if(adressIpValid(valeurChercher)){
        AppelIpifyAPI(valeurChercher);
        return
    }
    if (domaineValid(valeurChercher)) {
        AppelIpifyAPI(valeurChercher);
        return
    }
    alert ("adresse non reconnue");
}

document.getElementById("form").addEventListener("submit",searchBar);



//vérifaction si valeur ip ou domaine ok

function adressIpValid(value){
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value);
}

function domaineValid(value){
    return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
}

//appel ipify + affichage

// function AppelIpifyAPI(value, type="ip"){
//     searchValue = "ipAddress=" + value;
//     if (type == "domain") {
//         searchValue = searchValue.replace("ipAddress", "domain");
//     }

//     fetch("https://geo.ipify.org/api/v1?apiKey=at_D7Km16tFhAtGQVwzGVaIzejjv7k1y&" + searchValue)
//     .then(function(res) {
//         if (res.ok) {
//          return res.json();
//         }
//     })
//     .then(function(value) {

//         document.getElementById("IpAddress").innerHTML = value.ip;
//         document.getElementById("Location").innerHTML = value.location.city + ", " + value.location.region + " " + value.location.postalCode;
//         document.getElementById("Timezone").innerHTML = "UTC " + value.location.timezonevalue       
//         document.getElementById("ISP").innerHTML = value.isp;
//         console.log(value);
//     })
//     .catch(function(err) {
//         alert("Problem" +err)
//     });
//     console.log(fetch);
// }

function AppelIpifyAPI(value, searchType = "ip") {
    searchQuery = "ipAddress=" + value;
    if (searchType == "domain") {
        searchQuery = searchQuery.replace("ipAddress", "domain");
    }

    fetch("https://geo.ipify.org/api/v1?apiKey=at_D7Km16tFhAtGQVwzGVaIzejjv7k1y&" + searchQuery)
        .then(response => {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(data => {
            let lng = data.location.lng;
            let lat = data.location.lat;    

            // Render data to the appropriate label
            document.getElementById("IpAddress").innerHTML = data.ip;
            document.getElementById("Location").innerHTML = data.location.city + ", " + data.location.region + " " + data.location.postalCode;
            document.getElementById("Timezone").innerHTML = "UTC" + data.location.timezone;
            document.getElementById("ISP").innerHTML = data.isp;

            mymap.setView([lat, lng], 15);
            if (marker != null) {
                // Remove marker from map
                marker.remove();
            }
            marker = L.marker([lat, lng]).addTo(mymap);

        // Add marker to map
            marker.addTo(mymap);
        })
        .catch(error => {
            alert("Probleme\n" + error);
        });

}



function userLocationGranted(position) {

   fetch("https://api.ipify.org?format=json")
        .then(response => {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(data => {
            // searchInput.value = data.ip;
            AppelIpifyAPI(data.ip);
        })
        .catch(error => {
            alert("Probleme\n" + error);
        });
}
navigator.geolocation.getCurrentPosition(userLocationGranted);