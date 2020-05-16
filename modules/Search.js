
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@6.0.0/dist/fuse.esm.js"
import Card from "./Card.js"

let options = {}
options.shouldSort = true
options.threshold = 0.4
options.keys = [ "cargo", "partido", "uf", "nome", "mail" ]

let fuse = null
let input = document.getElementById("search-input")

async function Create(data) {
  fuse = new Fuse(data, options)
}

async function Apply(pattern) {
  let fusedata = fuse.search(pattern)
  let data = []
  for (let i = 0; i < fusedata.length; i++) { data.push(fusedata[i].item) }
  return data
}

async function Cards(data, fixed) {
  if (input.value) {
    let fusedata = await Apply(input.value)
    Card.CreateCards(fusedata, fixed)
  }
  else {
    Card.CreateCards(data, fixed)
  }
}

async function Register(data, fixed) {
  let timeout = null
  input.addEventListener("keyup", event => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      Cards(data, fixed)
    }, 1000);
  });
}

export default { Create, Cards, Register }
