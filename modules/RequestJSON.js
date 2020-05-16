
async function RequestJSON(url, cache = "no-store") {
  const request = new Request(url)
  try {
    const resp = await fetch(request, { cache: cache })
    return resp.json()
  }
  catch (error) {
    console.log(error)
  }
}

export default RequestJSON
