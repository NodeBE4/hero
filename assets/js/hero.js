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
        if (toc[0]==undefined){
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