var mysql      = require('mysql'); //mysql 모듈을 mysql 변수에 할당함
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hkuser',
  password : 'hkpass',
  database : 'world'
});
 
connection.connect(); //접속하는 코드
 
connection.query('SELECT * FROM city', function (error, results, fields) { //result : 접속 결과 파라미터
    if (error) {
        console.log(error);
    }
    console.log(results);
});
 
connection.end();