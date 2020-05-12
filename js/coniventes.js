
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

let urlfotodeputados = "https://www.camara.leg.br/internet/" +
	"deputado/bandep/pagina_do_deputado/";
let urlperfildeputados = "https://www.camara.leg.br/deputados/";
let urlfotosenadores = "https://www.senado.leg.br/senadores/" + 
	"img/fotos-oficiais/senador";
let urlperfilsenadores = "https://www25.senado.leg.br/web/" + 
	"senadores/senador/-/perfil/";

let buildcards = function buildcards(array) {
	let main = document.getElementById("main");
	let cards = document.getElementById("cards").remove();
	cards = document.createElement("div");
	cards.id = "cards";
	
	let card, data;
	let type;
	let position, info, mail;
	let img, imgurl;
	let linkpage, pageurl;
	let linkmail;

	let mailmessage = "?subject=" + 
		encodeURIComponent("Deixe de ser Conivente") + "&body=" +
		encodeURIComponent(`Vossa Excelência aprovaria a abertura um processo de
			impeachment contra o Excelentíssimo Senhor Presidente da República Jair
			Messias Bolsonaro?
			
			Acesse https://cognocoder.github.io/coniventes/html/responder.html para
			responder e deixar de ser Conivente.
			Utilize seu e-mail oficial e lembre-se, para não ser Conivente, é
			necessário uma resposta afirmativa.
			
			https://cognocoder.github.io/coniventes/`);

	for (let parlamentar of array) {
		if (parlamentar.voto == "Sim") {
			continue;
		}

		type = parlamentar.cargo.includes("Senador") ? "senador" : "deputado";
		if (type == "senador") {
			imgurl = `${urlfotosenadores}${parlamentar.id}.jpg`;
			pageurl = `${urlperfilsenadores}${parlamentar.id}`;
		}
		else if (type == "deputado") {
			imgurl = `${urlfotodeputados}${parlamentar.id}.jpg`;
			pageurl = `${urlperfildeputados}${parlamentar.id}`;
		}
		
		card = document.createElement("div");
		card.id = parlamentar.id;
		card.className = "col card";

		img = document.createElement("img");
		img.id = "img" + parlamentar.id;
		img.className = "person-img"
		img.onerror = () => { 
			this.src = "https://www.camara.leg.br/tema/assets/images/foto-deputado-sem-foto-grd.png";
		}
		img.onclick = eval(`() => { 
			document.getElementById("img${parlamentar.id}").src="${imgurl}";
		}`);
		img.src = "https://www.camara.leg.br/tema/assets/images/foto-deputado-sem-foto-grd.png";

		data = document.createElement("div");
		data.className = "person-data";
		
		linkpage = document.createElement("a");
		linkpage.href = pageurl;
		linkpage.target = "_blank";

		position = document.createElement("span");
		position.className = "person-position";
		position.innerHTML = parlamentar.cargo;

		info = document.createElement("span");
		info.className = "person-info";
		info.innerHTML = 
			`${parlamentar.partido} (${parlamentar.uf}) - ${parlamentar.nome}`;

		linkmail = document.createElement("a");
		linkmail.href = `mailto:${parlamentar.mail}${mailmessage}`;

		mail = document.createElement("span");
		mail.className = "person-mail";
		mail.innerHTML = parlamentar.mail;

		linkpage.appendChild(position);
		linkpage.appendChild(document.createElement("br"));
		linkpage.appendChild(info);

		linkmail.appendChild(mail);

		data.appendChild(linkpage);
		data.appendChild(document.createElement("br"));
		data.appendChild(document.createElement("br"));
		data.appendChild(linkmail);

		card.appendChild(img);
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
  shouldSort: false,
  threshold: 0.35,
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

window.onload = (event) => {
	register_onclick();
	register_searchinput();
	getcovidinfo();
	getcongressmen();
}
