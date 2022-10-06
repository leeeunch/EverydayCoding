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
        if (queryData.id == undefined) {
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
    }
    } else { //id 값이 있는 경우 
        db.query(`SELECT * FROM country LIMIT 3`, function(error, rows, fields) {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM country WHERE Code = ${queryData.id}`, function(error2, rows, fields){
                if (error2) {
                    throw error2;
                }
                console.log(rows);
                var title = rows[0].Code;
                var description = rows[0].Name;
                var list = template.list(rows);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`)
            });
            response.writeHead(200);
            response.end(html);
        });
  }})
app.listen(3000);