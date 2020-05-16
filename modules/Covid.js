
import RequestJSON from "./RequestJSON.js"

async function GetInfo() {
  const url = "https://corona-api.com/countries/br"
  const resp = await RequestJSON(url)

  const deaths = resp.data.latest_data.deaths
  const confirmed = resp.data.latest_data.confirmed

  return { deaths: deaths, confirmed: confirmed }
}

async function UpdateInfo() {
  let covid = await GetInfo()

  document.getElementById("deaths").innerHTML = covid.deaths
  document.getElementById("confirmed").innerHTML = covid.confirmed
}

export default { UpdateInfo }
