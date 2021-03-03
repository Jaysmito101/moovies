const express = require("express");
var beautiful = require('beautiful-scrape')
const request = require('request');


const route = express.Router();

route.use(express.json())

route.post('/search', (req, res) => {
	scrape(req, res, encodeURI(req.body.title));
});

route.get('/search/:title', (req, res) => {
	scrape(req, res, encodeURI(req.params.title));
});

route.get('/developer', (req, res) => {
	res.send("<center><b>Jaysmito Mukherjee</b></center>");
});

async function scrape(req, res, title){
	try{
		const soup = await beautiful.scrape('https://www.imdb.com/find?s=tt&q=' + title);
		var jsonResponse = {"matches":[]}; 
		soup.findAll("tr.findResult").forEach(movie =>{
      		const image = movie.children[1].children[1].children[0].attribs.src;
      		var name1 = movie.children[3].children[1].children[0].data;
      		var name2 = movie.children[3].children[2].data;
      		const name = name1 + name2;
      		const imdbid = (movie.children[3].children[1].attribs.href).substring(7).substring(0, ((movie.children[3].children[1].attribs.href).substring(7)).indexOf("/"));
      		jsonResponse.matches.push({
      			"name": name,
      			"imdbid": imdbid,
		      	"icon": image
    	  	});
    	});
    	res.json(jsonResponse);
	}catch(err){
		res.status(404).json({'status':404,'msg':'Not Found', 'err': err.message});
	}
}

module.exports = route;