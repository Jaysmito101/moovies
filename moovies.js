const express = require("express");
var beautiful = require('beautiful-scrape')
const request = require('request');


const route = express.Router();

route.use(express.json())

route.post('/search', (req, res) => {
	scrape(req, res, encodeURI(req.body.title));
});

route.post('/plot', (req, res) => {
	getPlot(req.body.imdbid, (response, err)=>{
		if(response == undefined){
			res.status(404).json({"status":404, "msg":"Error : " + err});
		}else{
			res.json(response);
		}
	});
});

route.post('/cast', (req, res) => {
	getCast(req.body.imdbid, (response, err)=>{
		if(response == undefined){
			res.status(404).json({"status":404, "msg":"Error : " + err});
		}else{
			res.json(response);
		}
	});
});

route.get('/search/:title', (req, res) => {
	scrape(req, res, encodeURI(req.params.title));
});

route.get('/plot/:imdbid', (req, res) => {
	getPlot(req.params.imdbid, (response, err)=>{
		if(response == undefined){
			res.status(404).json({"status":404, "msg":"Error : " + err});
		}else{
			res.json(response);
		}
	});
});

route.get('/cast/:imdbid', (req, res) => {
	getCast(req.params.imdbid, (response, err)=>{
		if(response == undefined){
			res.status(404).json({"status":404, "msg":"Error : " + err});
		}else{
			res.json(response);
		}
	});
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



function searchTitle(title, callback){
	try{
		beautiful.scrape('https://www.imdb.com/find?s=tt&q=' + title).then((soup)=>{
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
    		callback(jsonResponse, undefined);
		});
	}catch(err){
		callback(undefined, err);
	}

}

function getPlot(imdbid, callback){
	try{
		beautiful.scrape('https://www.imdb.com/title/' + encodeURI(imdbid) + '/plotsummary').then((soup)=>{
			var jsonResponse = {"plotSummaries":[], "plotSynopsis":""}; 
			const plots = soup.findAll("li.ipl-zebra-list__item");
			var synopsis = plots[plots.length - 1];
			var synopsisText = "";
			if(synopsis.attribs.id == "no-synopsis-content"){
				synopsis = synopsis.children[1];
				if(JSON.stringify(synopsis).indexOf("It looks like we don't have a Synopsis for this title yet") !=-1){
					synopsisText = undefined;
				}
			}else{
				synopsis.children.forEach((child) => {
					if(child.data != "br/")
						synopsisText = synopsisText + child.data;
					else
						synopsisText = synopsisText + "\n";
				});
				synopsisText = decodeEntities(synopsisText);
			}
			jsonResponse.plotSynopsis = synopsisText;
			for(var i=0;i<plots.length-2;i = i + 1){
				var plot = plots[i];
				plot = decodeEntities(plot.children[1].children[0].data);
				jsonResponse.plotSummaries.push(plot);
			}
			callback(jsonResponse, undefined);
		});
	}catch(err){
		callback(undefined, err);
	}
}

function getCast(imdbid, callback){
	try{
		beautiful.scrape('https://www.imdb.com/title/' + encodeURI(imdbid) + '/fullcredits').then((soup)=>{
			var jsonResponse = {"cast":[]}; 
			const casts = soup.findAll("table.cast_list")[0].children;
			for(var i=3;i<casts.length;i = i + 2){
				var cast = casts[i];
				if(cast.attribs == undefined)
					continue;
				const name = cast.children[3].children[1].children[0].data.trim();
				const character = cast.children[7].children[1].children[0].data.trim();
				const castCode = (cast.children[3].children[1].data).substring(14).substring(0, ((cast.children[3].children[1].data).substring(14)).indexOf('/'));
				jsonResponse.cast.push({"name": name, "character": character, "castCode": castCode});
			}
			callback(jsonResponse, undefined);
		});
	}catch(err){
		callback(undefined, err);
	}
}

function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

module.exports = {
	mooviesBackend: route,
	searchTitle: searchTitle,
	getPlot: getPlot,
	getCast: getCast
};