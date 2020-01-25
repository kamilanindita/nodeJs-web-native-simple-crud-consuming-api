//------------------------------------------Module-------------------------------------------
//module bawaan/default atau tidak perlu install
var http  = require('http');
var url   = require('url');
var qString   = require('querystring');
//module yang perlu install terlebih dahulu
var router = require('routes')();
var view  = require('swig');
var request = require("request");


//------------------------------------------Route--------------------------------------------
//index
router.addRoute('/',function(req,res){
    var html=view.compileFile('./templates/index.html')({
        title:"Index",
    });
    res.writeHead(200,{"Content-Type" : "text/html"});
    res.end(html);
});

//buku
router.addRoute('/buku',function(req,res){
    request.get("http://127.0.0.1:5000/buku", (err, response, body) => {
    if(err) throw err;
    var data=JSON.parse(body);
    
        var html=view.compileFile('./templates/buku.html')({
            title:"Buku",
            data : data['data'],
        });

        res.writeHead(200,{"Content-Type" : "text/html"});
        res.end(html);
    });    
    
});

//tambah
router.addRoute('/buku/tambah',function(req,res){
    if(req.method.toUpperCase()=='POST'){
        var data_post="";
        req.on('data',function(chuncks){
            data_post += chuncks;
        });
        req.on('end',function(){
            data_post =qString.parse(data_post);
        
            const requestOptions = {
                url: 'http://127.0.0.1:5000/buku',
                method: 'POST',
                formData:  {
                    'penulis':data_post['penulis'],
                    'judul':data_post['judul'],
                    'kota':data_post['kota'],
                    'penerbit':data_post['penerbit'],
                    'tahun':data_post['tahun'],
                },
                
            };
            request(requestOptions, (err, response, body) => {
                if(err) throw err;
                res.writeHead(302,{"Location" : "/buku"});
                res.end();
            });
        });

    }else{
        var html=view.compileFile('./templates/tambah.html')({
            title:"Tambah",
        });
        res.writeHead(200,{"Content-Type" : "text/html"});
        res.end(html);
    }

});

//edit
router.addRoute('/buku/edit/:id',function(req,res){
    var params=this.params.id;
    if(req.method.toUpperCase()=='POST'){
        var data_post="";
        req.on('data',function(chuncks){
            data_post += chuncks;
        });
        req.on('end',function(){
            data_post =qString.parse(data_post);
        
            const requestOptions = {
                url: 'http://127.0.0.1:5000/buku/'+params,
                method: 'PUT',
                formData:  {
                    'penulis':data_post['penulis'],
                    'judul':data_post['judul'],
                    'kota':data_post['kota'],
                    'penerbit':data_post['penerbit'],
                    'tahun':data_post['tahun'],
                },
                
            };
            request(requestOptions, (err, response, body) => {
                if(err) throw err;
                res.writeHead(302,{"Location" : "/buku"});
                res.end();
            });
        });

    }else{
        const requestOptions = {
            url: 'http://127.0.0.1:5000/buku/'+params,
            method: 'GET',
          };
          request(requestOptions, (err, response, body) => {
            if(err) throw err;
            var data=JSON.parse(body);
    
            var html=view.compileFile('./templates/edit.html')({
                title:"Edit",
                data : data['data'],
            });
            res.writeHead(200,{"Content-Type" : "text/html"});
            res.end(html);
            
          });
    }

});

//hapus
router.addRoute('/buku/delete/:id',function(req,res){
    var params=this.params.id;

    const requestOptions = {
        url: 'http://127.0.0.1:5000/buku/'+params,
        method: 'DELETE',
      };
      request(requestOptions, (err, response, body) => {
        if(err) throw err;
        res.writeHead(302,{"Location" : "/buku"});
        res.end();
        
      });
});
 
 //--------------------------------------End Route-------------------------------------------
 
 //---------------------------------------Server---------------------------------------------
 //membuat server
http.createServer(function(req,res){
    var path =url.parse(req.url).pathname;
    var match=router.match(path);
	//menampilkan request url
	console.log(req.method+' '+req.url);

    if(match){
        match.fn(req,res);
    }else{
        var html=view.compileFile('./templates/404.html')();
        res.writeHead(404,{"Content-Type" : "text/html"});
        res.end(html);
    }
  
}).listen(8000);
 
console.log('Server is running at port 8000');


//cataan
/*   
cara fetch data resfull api/comsuming api

-HTTP – the Standard Library
-Request ,kode di atas menggunakan ini
-Axios
-SuperAgent
-Got

refrensi:https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html




API to send request
			x-www-form-urlencoded		form-data
fetch()		body as URLSearchParams		body as FormData
request()	form option					formData option
axios()		data as URLSearchParams		data as FormData

API to handle response
For x-www-form-urlencoded, use bodyParser, which will parse payload into req.body in the format of { key, value }.

refrensi:https://dev.to/getd/x-www-form-urlencoded-or-form-data-explained-in-2-mins-5hk6





options lengkap request uttuk api
 // Set the headers
	var headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/x-www-form-urlencoded'
	}

	// Configure the request
	var options = {
		url:  'http://127.0.0.1:8080/buku/'+_id,
		method: 'PUT',
		headers: headers,
		form: data_update,
	}

	// Start the request
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			res.redirect('/buku')
			console.log(body)
		}
	})

*/