//모듈 불러오기
var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title> 
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist) {
  var list = '<ul>'; //순서가 필요없는 목록을 만듦
  var i = 0;
  while(i < filelist.length) { //i가 filelist의 길이보다 작을 때만 돌아감
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>` //list(ul태그가 삽입됨)에 filelist의 요소들을 하나씩 삽입한 html 문서를 추가해줌 //순서가 없는 목록을 개별적으로 하나씩 만듦
    i = i + 1;                
  }
  list = list + '</ul>'; //순서 없는 목록을 끝내줌
  return list;
}

var app = http.createServer(function(request,response){ //request : 객체의 요청 //response : 객체의 응답
    var _url = request.url; //현재 접속한 서버의 url
    var queryData = url.parse(_url, true).query; //url.parse는 url을 쪼개주는 메소드 //url의 query부분을 따옴
    var pathname = url.parse(_url, true).pathname; //url의 pathname
    var title = queryData.id; //query id를 변수로 받음

    if (pathname === '/') { //원래 경로일때
      if(queryData.id == undefined) { //id값이 없는 경우
        fs.readdir('./data', function(error, filelist) {
          var title = 'Welcome';
          var description = 'Hello';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200); //제대로 정보 전달
          response.end(template); //응답 후 본문 작성
        })
       
    } else { //id 값이 있는 경우 
      fs.readdir(`./data`, function(err, filelist){ 
        var title = 'Welcome';
        var description = 'Hello';
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){ //queryData.id 파일 읽어옴
          var title = queryData.id;  //title은 queryData.id
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200); //제대로 정보 전달
        response.end(template); //응답 후 본문 작성
      }); 
        })
    } 
  } else {
      response.writeHead(404); //페이지를 찾을 수 없음
      response.end('Not found'); //응답 후 본문 작성
};
})
app.listen(3000);