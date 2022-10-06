//모듈 불러오기
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var template = require('./lib/template');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'hkuser',
    password : 'hkpass',
    database : 'world'
  });
   
db.connect();

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

var app = http.createServer(function(request,response){ //request : 객체의 요청 //response : 객체의 응답
    var _url = request.url; //현재 접속한 서버의 url
    var queryData = url.parse(_url, true).query; //url.parse는 url을 쪼개주는 메소드 //url의 query부분을 따옴
    var pathname = url.parse(_url, true).pathname; //url의 pathname
    var title = queryData.id; //query id를 변수로 받음

     if (pathname === '/') { 
      if(queryData.id == undefined) { 
        db.query(`SELECT * FROM country LIMIT 3`, function(error, rows, fields) {
            console.log(rows); //topics가 undefined
            var title = 'Welcome';
            var description = 'Hello';
            var list = template.list(rows);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>`)
            response.writeHead(200);
            response.end(html);
        });
    } else { //id 값이 있는 경우 
      fs.readdir(`./data`, function(err, filelist){ 
        db.query(`SELECT * FROM country LIMIT 3`, function(error, rows, fields) {
        var list = template.list(rows);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){ //queryData.id 파일 읽어옴
          var title = queryData.id;  //title은 queryData.id
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`, `<p>${description}</p>`);
        response.writeHead(200); //제대로 정보 전달
        response.end(html); //응답 후 본문 작성
        })}); 
        })
    } } else {
      response.writeHead(404); //페이지를 찾을 수 없음
      response.end('Not found'); //응답 후 본문 작성
    };})
app.listen(3000);