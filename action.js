let { Octokit } = require('@octokit/rest')
let { loadWikipedia, generateArticle, googlePhoto } = require('./lib')
const crypto = require('crypto');
let fs = require('fs')

require('dotenv').config()

let TOKEN = process.env.TOKEN
let REPOSITORY = process.env.REPOSITORY
let [OWNER, REPO] = REPOSITORY.split('/')

let octokit = new Octokit({
  auth: TOKEN
})

const FILE = '100644'; // commit mode
const encoding = 'utf-8';
const ref = 'heads/master';

async function performTasks() {
  let { data } = await octokit.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open'
  })

  let promises = data.map(async (issue) => {
    try {
      if (issue.title.substring(0,12)=='add_request:'){
        let titletext = issue.title.split(" ")[1]
        let people = titletext.split("-")[0].trim()
        let keyword = titletext.replace(people,'').replace("-",'')
        let wiki = issue.body.split('\n')[0]
        let match = /^https:\/\/(zh|en).wikipedia.org\/wiki\//
        if (match.test(wiki)){
            let rawfile = await octokit.repos.getContent({
                            owner: OWNER,
                            repo: REPO,
                            path: `index.json`,
                            ref: ref
                        })
            let buff = new Buffer.from(rawfile.data.content, 'base64')
            let text = buff.toString('utf-8')
            let json = JSON.parse(text)
            let hash = crypto.createHash('md5').update(people+wiki).digest("hex")
            var thisperson = json.filter(function (item) {
                return item.wiki == wiki ;
            }); 
            if (thisperson.length > 0){
              await octokit.issues.createComment({
                owner: OWNER,
                repo: REPO,
                issue_number: issue.number,
                body: `${thisperson[0].people} 已经榜上有名了，试试到网页上的search他/她的名字`
              })
              await octokit.issues.update({
                owner: OWNER,
                repo: REPO,
                issue_number: issue.number,
                state: 'closed',
                title: articleData.title,
                labels: ['duplicated']
              })
            }else{
              let photourl = await googlePhoto(people + keyword)
              new Promise(resolve => setTimeout(resolve, 2000))

              let newhero = {
                people: people,
                keyword: keyword,
                wiki: wiki,
                vote: 1,
                hash: hash,
                photo: photourl
              }
              json.push({
                ...newhero
              });
              console.log(json);
              json.map(item =>{
                let votefile = `_data/votes/vote_${item.hash}`;
                if (fs.existsSync(votefile)) {
                  text = fs.readFileSync(votefile)
                  item.vote = parseInt(text)
                }
              })
              let content = JSON.stringify(json, undefined, 4);

              let committer = {
              name: 'NodeBE4',
              email: 'you@example.com'
              }

              let prTitle = `添加新人物-${people}`

              let intro = await loadWikipedia(newhero.wiki, "mw-content-text")
              let page = generateArticle(newhero, intro)

              fs.writeFileSync(`./index.json`, content)

              await octokit.issues.createComment({
                owner: OWNER,
                repo: REPO,
                issue_number: issue.number,
                body: page
              })
              await octokit.issues.update({
                owner: OWNER,
                repo: REPO,
                issue_number: issue.number,
                state: 'closed',
                title: prTitle,
                labels: ['success']
              })
            }
           }
          }
        } catch(error) {
          await octokit.issues.createComment({
            owner: OWNER,
            repo: REPO,
            issue_number: issue.number,
            body: `错误 ${error.toString()}`
          })
          await octokit.issues.update({
            owner: OWNER,
            repo: REPO,
            issue_number: issue.number,
            state: 'closed',
            labels: ['error']
          })
          throw error
        }

  })

  await Promise.all(promises)
}


performTasks()