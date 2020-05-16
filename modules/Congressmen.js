
import RequestJSON from "./RequestJSON.js"

let data = null
let mail_lists = null

async function UpdateInfo() {
  data = await RequestJSON("./resources/parlamentares.json")
  data.parlamentares = data.parlamentares.filter(item => item.voto != "Sim")
  return data
}

async function GetInfo() {
  if (data) return data
  return await UpdateInfo()
}

async function UpdateCount() {
  let data = await GetInfo()
  document.getElementById("conniving").innerHTML = data.parlamentares.length;
  return data;
}

async function GetMailLists(keys) {
  if (mail_lists) return mail_lists
  let data = await GetInfo()
  mail_lists = {}
  for (let key of keys) {
    if (!mail_lists[key]) mail_lists[key] = {}
    for (let item of data.parlamentares) {
      if (!mail_lists[key][item[key]]) mail_lists[key][item[key]] = []
      mail_lists[key][item[key]].push(item.mail)
    }
  }
  return mail_lists
}

export default { GetInfo, UpdateCount, GetMailLists }
