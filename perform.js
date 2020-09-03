let fs = require('fs')
let querystring = require('querystring')
let urlMod = require('url')
const crypto = require('crypto')
const https = require('https')
const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let { loadRefSites, loadWikipedia, generateArticle, googlePhoto } = require('./lib')
let URL = urlMod.URL

let db_news_url = 'https://nodebe4.github.io/waimei/search.json'
let db_oped_url = 'https://nodebe4.github.io/opinion/search.json'
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

let settings = { method: "Get" }

async function perform() {
  let rawdata = fs.readFileSync('./index.json', {encoding:'utf8', flag:'r'})
  let heroes = JSON.parse(rawdata)
  // console.log(heroes)

  await Promise.all(heroes.map(item =>{
    let votefile = `_data/votes/vote_${item.hash}`;
    if (fs.existsSync(votefile)) {
      text = fs.readFileSync(votefile)
      item.vote = parseInt(text)
    }
    if (('photo' in item)==false || (typeof(item.photo)!=='string')){
      item.photo = googlePhoto(item.people + item.keyword)
      new Promise(resolve => setTimeout(resolve, 2000))
    }
  }))
  let content = JSON.stringify(heroes, undefined, 4)
  fs.writeFileSync(`./index.json`, content)
  
  await loadRefSites()

  await Promise.all(heroes.map(async (item) => {
    let intro = await loadWikipedia(item.wiki, "mw-content-text")
    generateArticle(item, intro)
  }));
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  return a
}

perform()

