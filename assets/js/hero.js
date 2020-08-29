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
