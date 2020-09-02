function loadWikipedia(url, id){
  // var div = document.getElementById('submitText');
  var el = document.getElementById( 'article' );
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  var html = document.createElement("div");
  html.id = "temp";

  if (el){
    $("#article").load(CORS_PROXY+url+" #"+id, function(responseTxt, statusTxt, xhr){
      if (statusTxt == "success"){
        html.innerHTML=responseTxt;
        var tables = el.getElementsByTagName("table");
        for (i=0;i<tables.length;i++){
          tables[i].parentNode.removeChild(tables[i]);
          // tables[i].remove();
        }
        var toc = el.getElementsByClassName("toc");
        if (toc.length==0){
          toc = el.getElementsByTagName("h2");
        }
        while(toc[0].nextSibling){
          var element = toc[0].nextSibling;
          element.parentNode.removeChild(element);
        }
        toc[0].parentNode.removeChild(toc[0]);
        // el.innerHTML = html.innerHTML;
      }
    });
  }
}


function loadHeroes(url, id){
  var el = document.getElementById(id);
  $.getJSON(url, function(json) {
    herolist = json;
    var lis = herolist.map(item => {
      let li = document.createElement('li');
      let s1 = document.createElement('span');
      s1.innerHTML = `<a onclick="expandHero('${item['people']})','${item['wiki']}');">${item['people']}</a>`;
      li.appendChild(s1);
      let s2 = document.createElement('span');
      s2.innerHTML = '&#x1f44d;'+item['vote']+' ';
      let a1 = document.createElement('a');
      a1.href= item['wiki'];
      a1.innerText = 'wikipedia';
      li.appendChild(a1);
      el.appendChild(li);
    });
  })

}

function vote_hero(hash){
  console.log(hash)
  var btn = document.getElementById("vote-"+hash)
  var cell = document.getElementById("vote-cnt-"+hash)
  btn.parentNode.removeChild(btn)
  var count = parseInt(cell.innerText) + 1
  console.log(count)
  cell.innerText = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  var form = document.getElementById("vote-form")
  var inputhash = document.getElementById("input-hash")
  inputhash.value=hash
  form.submit()
  // let result = document.getElementById('bot-message'); 
  // $('#vote-form').submit(function(){
  //     $.ajax({
  //       url: $('#form').attr('action'),
  //       type: 'POST',
  //       data : $('#form').serialize(),
  //       success: function(response){
  //         result.innerHTML  = `<p>${response}</p>` +result.innerHTML 
  //         console.log('vote succeed');
  //       }
  //     });
  //     return false;
  // });
  // let votedata = {
  //   hash: hash
  // }
  // // Converting JSON data to string 
  // var data = JSON.stringify(votedata); 
  // let url = 'http://localhost:3000/api/vote'
  // sendJSON(votedata, CORS_PROXY+url)
  return false
}

function sendJSON(data, url){ 
  let result = document.getElementById('bot-message'); 
     
  // Creating a XHR object 
  let xhr = new XMLHttpRequest(); 

  // open a connection 
  xhr.open("POST", url, true); 

  // Set the request header i.e. which type of content you are sending 
  xhr.setRequestHeader("Content-Type", "application/json"); 

  // Create a state change callback 
  xhr.onreadystatechange = function () { 
      if (xhr.readyState === 4 && xhr.status === 200) { 

          // Print received data from server 
          result.innerHTML = this.responseText; 

      } 
  }; 

  // Sending data with the request 
  xhr.send(data); 
} 