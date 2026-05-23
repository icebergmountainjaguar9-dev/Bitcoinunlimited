const qs = (s)=>document.querySelector(s)
const qsa = (s)=>document.querySelectorAll(s)

const tabHome = qs('#tab-home')
const tabDon = qs('#tab-donations')
const homeSec = qs('#home')
const donSec = qs('#donations')

tabHome.addEventListener('click',()=>{tabHome.classList.add('active');tabDon.classList.remove('active');homeSec.classList.remove('hidden');donSec.classList.add('hidden')})
tabDon.addEventListener('click',()=>{tabDon.classList.add('active');tabHome.classList.remove('active');donSec.classList.remove('hidden');homeSec.classList.add('hidden')})

const txField = qs('#txid')
const checkBtn = qs('#checkBtn')
const result = qs('#result')
const accelerateBtn = qs('#accelerateBtn')

const ACCELERATOR_SERVICES = [
  {name:'ViaBTC Transaction Accelerator', url:'https://www.viabtc.com/tools/txaccelerator/', needsTxid:false},
  {name:'Bitcoin Pool Accelerator Guide', url:'https://mempool.space/tx/', needsTxid:true},
  {name:'Blockchair Transaction View', url:'https://blockchair.com/bitcoin/transaction/', needsTxid:true},
]

function extractTxid(input){
  if(!input) return ''
  input = input.trim()
  // if link contains /tx/ return part after it
  try{
    const u = new URL(input)
    const parts = u.pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('tx')
    if(idx>=0 && parts[idx+1]) return parts[idx+1]
  }catch(e){}
  // otherwise assume raw txid
  return input.split(/\s+/)[0]
}

async function lookupTx(txid){
  result.textContent = 'Looking up...'
  const api = `https://blockstream.info/api/tx/${txid}`
  try{
    const r = await fetch(api)
    if(r.status===404){ result.innerHTML = '<b>Transaction not found in explorer.</b>'; return }
    if(!r.ok){ result.textContent = 'Explorer lookup failed.'; return }
    const data = await r.json()
    let html = `<p><b>TXID:</b> ${txid}</p>`
    if(data.status && data.status.confirmed){
      html += `<p>Status: Confirmed in block ${data.status.block_height} (blockhash ${data.status.block_hash})</p>`
    }else{
      html += `<p>Status: Unconfirmed (in mempool)</p>`
    }
    if(data.vsize) html += `<p>Virtual size: ${data.vsize} vbytes</p>`
    if(data.fee) html += `<p>Fee: ${data.fee} satoshis</p>`
    html += `<p>View on block explorer: <a href="https://blockstream.info/tx/${txid}" target="_blank">blockstream.info</a></p>`
    if(!data.status || !data.status.confirmed){
      html += `<div class="accelerator-list"><p><strong>Unconfirmed transaction.</strong> Use these options to request faster mining:</p><ul>`
      html += `<li><a href="https://www.viabtc.com/tools/txaccelerator/" target="_blank">ViaBTC Transaction Accelerator</a></li>`
      html += `<li><a href="https://blockchair.com/bitcoin/transaction/${txid}" target="_blank">Open TX on Blockchair</a> to review mempool details.</li>`
      html += `<li><a href="https://mempool.space/tx/${txid}" target="_blank">View on mempool.space</a> for fee and confirmation estimates.</li>`
      html += `</ul><p>Try RBF or CPFP if your wallet supports it, or paste the TXID into a pool accelerator.</p></div>`
    }
    result.innerHTML = html
  }catch(err){ result.textContent = 'Error while fetching transaction info.' }
}

checkBtn.addEventListener('click',()=>{
  const txid = extractTxid(txField.value)
  if(!txid){ result.textContent = 'Please enter a transaction ID or link.'; return }
  lookupTx(txid)
})

accelerateBtn.addEventListener('click',()=>{
  const txid = extractTxid(txField.value)
  if(!txid){ result.textContent = 'Please enter a transaction ID or link before accelerating.'; return }
  ACCELERATOR_SERVICES.forEach(service=>{
    const target = service.needsTxid ? `${service.url}${txid}` : service.url
    window.open(target,'_blank')
  })
})

// Donations copy
const copyBtn = qs('#copyDonation')
copyBtn.addEventListener('click',async()=>{
  const addr = qs('#donationAddress').textContent.trim()
  try{ await navigator.clipboard.writeText(addr); copyBtn.textContent='Copied' ; setTimeout(()=>copyBtn.textContent='Copy',1500)}catch(e){ alert('Copy your address: '+addr) }
})
