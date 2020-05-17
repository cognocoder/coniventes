
let message = {}

message.subject = "Deixe de ser Conivente"
message.encoded_subject = encodeURIComponent(message.subject)
message.body = "Vossa Excelência aprovaria a abertura um processo de impeachment contra o Excelentíssimo Senhor Presidente da República Jair Messias Bolsonaro?\n\nDestaca-se o apartidário pedido de impeachment da Associação Brasileira de Imprensa: http://www.abi.org.br/wp-content/uploads/2020/05/Documento-impeachment.pdf\n\nAcesse https://cognocoder.github.io/coniventes/html/responder.html para responder e deixar de ser Conivente. Utilize seu e-mail oficial e lembre-se, para não ser Conivente, é necessário uma resposta afirmativa.\n\nhttps://cognocoder.github.io/coniventes/"
message.encoded_body = encodeURIComponent(message.body)

function GetMailLink(to, cc, subject, body) {
  subject = subject || message.encoded_subject
  body = body || message.encoded_body
  
  let link = `mailto:${to}?`
  if (cc) link += `cc=${cc.join(",")}&`
  link += `subject=${subject}&body=${body}`

  return link
}

async function CreateMailGroup(node_id, list, fixed) {
  let node = document.getElementById(node_id)
  let frag = document.createDocumentFragment()
  let text, link

  for (let key of Object.keys(list).sort()) {
    text = `${key} (${list[key].length})`
    link = GetMailLink(fixed, list[key])

    let a = document.createElement("a")
    a.alt = "Enviar mensagem a todos parlamentares do " + key
    a.href = link

    let li = document.createElement("li")
    li.innerHTML = text

    frag.appendChild(a)
    a.appendChild(li)
  }

  node.appendChild(frag)
}

export default { GetMailLink, CreateMailGroup }
