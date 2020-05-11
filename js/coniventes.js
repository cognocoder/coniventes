
let updatecovidinfo = function updatecovidinfo(deaths, confirmed) {
	document.title = "Coniventes com " + deaths + " vítimas fatais.";
	document.getElementById("deaths").innerHTML = deaths;
	document.getElementById("confirmed").innerHTML = confirmed;
}

let getcovidinfo = function getcovidinfo() {
	let url = "https://corona-api.com/countries/br";
	let request = new Request(url, { method: "GET" });
	let data = {};
	fetch(request)
	  .then(function(res) {
	  	if (!res.ok) throw res;
			else return res.blob();
	  }).then(function(blob) {
			return blob.text();
	  }).then(function(text) {
			data = JSON.parse(text).data.latest_data;
			delete data.calculated;
			delete data.critical;
			delete data.recovered;
			updatecovidinfo(data.deaths, data.confirmed);
	  }).catch(error => {
			console.log(error);
	  });
}

let getcongressmen = function getcongressmen() {
	let url = "https://raw.githubusercontent.com/" + 
		"cognocoder/coniventes/master/resources/crawtst.json";
	let request = new Request(url, { method: "GET" });
	let data = {};
	fetch(request)
	  .then(function(res) {
	  	if (!res.ok) throw res;
			else return res.blob();
	  }).then(function(blob) {
			return blob.text();
	  }).then(function(text) {
			data = JSON.parse(text);
			console.log(data);
	  }).catch(error => {
			console.log(error);
	  });
}

let focus_search = function focus_search() {
	document.getElementById("search-input").focus();
}

function register_onclick() {
	document.getElementById("header").onclick = getcovidinfo;
  document.getElementById("search-container").onclick = focus_search;
  document.getElementById("search-icon").onclick = focus_search;
}

getcovidinfo();
getcongressmen();

let urlfotodeputados = "https://www.camara.leg.br/internet/" +
  "deputado/bandep/pagina_do_deputado/";
let urlfotosenadores = "https://www.senado.leg.br/senadores/" + 
  "img/fotos-oficiais/senador";
let urlfotoerro = "https://www.camara.leg.br/tema/assets/images/" +
  "foto-deputado-sem-foto-grd.png";
let fotoext = ".jpg";

window.onload = function() {
	register_onclick();
}
