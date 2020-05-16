
import Covid from "./modules/Covid.js"
import Congressmen from "./modules/Congressmen.js"
import Postman from "./modules/Postman.js"
import Card from "./modules/Card.js"
import Search from "./modules/Search.js"

let coniventes = {}

coniventes.onload = async function coniventes_onload() {
	let focus_search = () => { document.getElementById("search-input").focus(); }

	document.getElementById("search-container").onclick = focus_search
	document.getElementById("search-icon").onclick = focus_search

	Covid.UpdateInfo()
	setInterval(() => { Covid.UpdateInfo() }, 600000)

	coniventes.base = await Congressmen.UpdateCount()
	let mail_lists = await Congressmen.GetMailLists(["partido", "uf"])
	
	let parlamentares = coniventes.base.parlamentares
	let fixo = coniventes.base.fixo
	
	Card.CreateFixed(fixo)
	
	Postman.CreateMailGroup("grupo-partidos", mail_lists["partido"], fixo)
	Postman.CreateMailGroup("grupo-unidades-federativas", mail_lists["uf"], fixo)

	Search.Create(parlamentares)
	Search.Register(parlamentares, fixo)

	Search.Cards(parlamentares, fixo)
}

window.onload = (event) => {
	coniventes.onload()
}
