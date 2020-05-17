
import Postman from "./Postman.js"

let urls = {
  deputados: {
    foto: "https://www.camara.leg.br/internet/deputado/bandep/pagina_do_deputado/",
    perfil: "https://www.camara.leg.br/deputados/",
  },
  senadores: {
    foto: "https://www.senado.leg.br/senadores/img/fotos-oficiais/senador",
    perfil: "https://www25.senado.leg.br/web/senadores/senador/-/perfil/",
  },
  imgonerror: "https://www.camara.leg.br/tema/assets/images/foto-deputado-sem-foto-grd.png",
}

function AppendNodes(parent, ...nodes) {
  for (let node of nodes) {
    if (node === "br") parent.appendChild(document.createElement("br"))
    else parent.appendChild(node)
  }
}

async function Create(person, fixed) {
  let card = document.createElement("div")
  let img = document.createElement("img")
  let data = document.createElement("div")
  let profile_link = document.createElement("a")
  let pos = document.createElement("span")
  let info = document.createElement("span")
  let mail_link = document.createElement("a")
  let mail = document.createElement("span")
  let br = "br"

  AppendNodes(card, img, data)
  AppendNodes(profile_link, pos, br, info)
  AppendNodes(mail_link, mail)
  AppendNodes(data, profile_link, br, br, mail_link)

  card.className = "material card"
  data.className = "data"
  info.className = "details"

  profile_link.target = "_blank"
  profile_link.alt = "Perfil oficial: " + person.cargo
  mail_link.alt = "Endereço de e-mail: " + person.cargo

  let urlspos = person.cargo.includes("Deputad") ?
    urls.deputados : urls.senadores
  
  profile_link.href = urlspos.perfil + person.id
  
  pos.innerHTML = person.cargo
  info.innerHTML = `${person.partido} (${person.uf}) - ${person.nome}`
  mail.innerHTML = person.mail
  
  let imgurl = urlspos.foto + person.id + ".jpg"
  if (person.id != fixed.id) {
    card.id = person.id

    img.id = `img${person.id}`
    img.src = urls.imgonerror
    img.onerror = eval(`() => { document.getElementById("img${person.id}").src="${urls.imgonerror}" }`)
    img.onclick = eval(`() => { document.getElementById("img${person.id}").src="${imgurl}" }`)

    mail_link.href = Postman.GetMailLink(person.mail, [fixed.mail])
  } 
  else {
    card.id = "fixed"
    img.src = imgurl

    mail_link.href = Postman.GetMailLink(fixed.mail)
  }

  return card
}

async function CreateFixed(fixed) {
  Create(fixed, fixed)
    .then(card => document.getElementById("fixed-card").appendChild(card))
}

async function CreateCards(list, fixed) {
  document.getElementById("cards").remove()
  let container = document.getElementById("container")
  let cards = document.createElement("section")
  let frag = document.createDocumentFragment()
  cards.id = "cards"
  for (let item of list) {
    Create(item, fixed)
      .then(card => {
        frag.appendChild(card)
        if (frag.children.length == list.length) {
          cards.appendChild(frag)
          container.appendChild(cards)
        }
      })
  }
}

export default { CreateFixed, CreateCards }
