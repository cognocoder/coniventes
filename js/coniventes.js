
let updatecovidinfo = function updatecovidinfo(deaths, confirmed) {
	document.title = "Coniventes com " + deaths + " vítimas fatais.";
	document.getElementById("deaths").innerHTML = deaths;
	document.getElementById("confirmed").innerHTML = confirmed;
}

let updatecongressmencount = function updatecongressmencount(parlamentares) {
	let count = 0;
	for (let parlamentar of parlamentares) {
		if (parlamentar.voto && parlamentar.voto == "Sim") {
			count++;
		}
	}
	document.getElementById("conniving").innerHTML = parlamentares.length - count;
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

let shuffle = function shuffle(array) {
  var ci = array.length, e, ri;
  while (ci != 0) {
    ri = Math.floor(Math.random() * ci);
    ci -= 1;

    e = array[ci];
    array[ci] = array[ri];
    array[ri] = e;
  }
  return array;
}

let parlamentares;

let buildcards = function buildcards(array) {
	let main = document.getElementById("main");
	let cards = document.getElementById("cards").remove();
	cards = document.createElement("div");
	cards.id = "cards";
	
	let card;
	let data, position, info;

	for (let parlamentar of array) {
		if (parlamentar.voto == "Sim") {
			continue;
		}

		card = document.createElement("div");
		card.id = parlamentar.id;
		card.className = "col card";

		data = document.createElement("div");
		data.className = "person-data";

		position = document.createElement("p");
		position.className = "person-position";
		position.innerHTML = parlamentar.cargo;

		info = document.createElement("p");
		info.className = "person-info";
		info.innerHTML = `${parlamentar.partido} (${parlamentar.uf})`;

		data.appendChild(position);
		data.appendChild(info);

		card.appendChild(data);

		cards.appendChild(card);
	}
	main.appendChild(cards);
}

let getcongressmen = function getcongressmen() {
	let url = "https://raw.githubusercontent.com/" + 
		"cognocoder/coniventes/master/resources/crawled.json";
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
			parlamentares = data;
			fuse = new Fuse(data, options);
			updatecongressmencount(data);
			buildcards(data);
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

let options = {
  // isCaseSensitive: false,
  // includeScore: false,
  shouldSort: false,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.2,
  // distance: 100,
  // useExtendedSearch: false,
  keys: [
    "cargo",
    "partido",
    "uf",
    "voto",
    "nome",
    "mail"
  ]
};
let fuse;

let register_searchinput = function register_searchinput() {
	let input = document.getElementById("search-input");
	let timeout = null;
	input.addEventListener('keyup', function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
			if (input.value) {
				console.log(`.${input.value}.`);
				let fusearr = fuse.search(input.value);
				let pararr = [];
				for (let i = 0; i < fusearr.length; i++) {
					pararr.push(fusearr[i].item);
				}
				buildcards(pararr);
			}
			else {
				buildcards(parlamentares);
			}
    }, 1000);
	});
}

let urlfotodeputados = "https://www.camara.leg.br/internet/" +
  "deputado/bandep/pagina_do_deputado/";
let urlfotosenadores = "https://www.senado.leg.br/senadores/" + 
  "img/fotos-oficiais/senador";
let urlfotoerro = "https://www.camara.leg.br/tema/assets/images/" +
  "foto-deputado-sem-foto-grd.png";
let fotoext = ".jpg";

window.onload = (event) => {
	register_onclick();
	register_searchinput();
	getcovidinfo();
	getcongressmen();
}
