let fs = require('fs')
let querystring = require('querystring')
let urlMod = require('url')
const crypto = require('crypto')
const https = require('https')
const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let document = require('html-element').document
let URL = urlMod.URL

let db_news_url = 'https://nodebe4.github.io/waimei/search.json'
let db_oped_url = 'https://nodebe4.github.io/opinion/search.json'
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

let settings = { method: "Get" }

let news = []
let oped = []

function getElementById(node, id) {    
    return node.querySelector("#" + id);
}

async function loadWikipedia(url, id){
  // var div = document.getElementById('submitText');
  // const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  // var html = document.createElement("div");
  // html.id = "about";

  const response = await fetch(url, settings);
  const body = await response.text();

  const dom = new JSDOM(body)
  let content = dom.window.document.querySelector("#"+id);
  var tables = content.querySelector("table");
  tables.parentNode.removeChild(tables);
  // for (i=0;i<tables.length;i++){
  //   tables[i].parentNode.removeChild(tables[i]);
  //   // tables[i].remove();
  // }
  var toc = content.querySelector("#toc");
  if (toc == null ){
    var toc = content.querySelector("h2");
  }
  if (toc){
    while(toc.nextSibling){
      var element = toc.nextSibling;
      element.parentNode.removeChild(element);
    }
    toc.parentNode.removeChild(toc);
  }
  // el.innerHTML = html.innerHTML;
  // html.appencChild(content)

  return content.innerHTML;

}

function loadNews(hero){
  const html = (new JSDOM(`<div><h3></h3><ul></ul></div>`)).window.document.querySelector("div")
  const ul = html.querySelector("ul")
  const h3 = html.querySelector("h3")
  html.id = "recent-news"
  h3.innerHTML = "最近动态"
  let relatednews = news.map(item => {
    if (item['title'].includes(hero) || item['desc'].includes(hero)){
      var baseurl = "https://nodebe4.github.io/waimei"
      ul.innerHTML += `<li><a href="https://nodebe4.github.io${baseurl+item['url']}" title="${item['desc']}">${item['title']}</a><time>${item['date']}</time><a class="tag">${item['category']}</a></li>`
      return item
    }
  })
  return html.parentElement.innerHTML
}

function loadOped(hero){
  const html = (new JSDOM(`<div><h3></h3><ul></ul></div>`)).window.document.querySelector("div")
  const ul = html.querySelector("ul")
  const h3 = html.querySelector("h3")
  html.id = "open-opinion"
  h3.innerHTML = "过往言论"
  let relatednews = oped.map(item => {
    if (item['title'].includes(hero) || item['desc'].includes(hero)){
      var baseurl = "https://nodebe4.github.io/opinion"
      ul.innerHTML += `<li><a href="https://nodebe4.github.io${baseurl+item['url']}" title="${item['desc']}">${item['title']}</a><time>${item['date']}</time><a class="tag">${item['category']}</a></li>`
      return item
    }
  })
  return html.parentElement.innerHTML
}

async function perform() {
  let rawdata = fs.readFileSync('./index.json', {encoding:'utf8', flag:'r'})
  let heroes = JSON.parse(rawdata)
  console.log(heroes)

  await fetch(db_news_url, settings)
    .then(res => res.json())
    .then((json) => {
      news = json
    });

  await fetch(db_oped_url, settings)
    .then(res => res.json())
    .then((json) => {
      oped = json
    });


  await Promise.all(heroes.map(async (item) => {
    let intro = await loadWikipedia(item.wiki, "mw-content-text")
    generateArticle(item, intro)
  }));
}

function generateArticle(item, intro) {
  let today = new Date()
  let openoped = loadOped(item['people'])
  let recentnews = loadNews(item['people'])
  let md = intro + recentnews + openoped
  let dateString = "1989-06-04"
  let titletext = item.people.toString().replace(/"/g, '\\"').replace("...", '')
  let articlelink = new URL(item.wiki).href
  let header = `---
layout: post
title: "${titletext}"
date: ${dateString}
author: 维基百科
from: ${articlelink}
tags: [ ${titletext}, 维基百科 ]
categories: [ ${titletext} ]
---
`
  md = header + md
  let filename = `${dateString.substring(0, 10)}-${titletext.substring(0, 50)}.md`.replace(/\//g, '--')
  if (!fs.existsSync(`./_posts/${filename}`)) {
    fs.writeFileSync(`./_posts/${filename}`, md)
    console.log(`add ./_posts/${filename}`)
  }
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  return a
}

perform()
