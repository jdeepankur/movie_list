//Based on example code by Saleem Bhatti on Studres


const express = require("express")

const app = express()
  
const filename = "/movie_metadata_subset.json" ;

const fs = require('fs');

app.get("/", (req, res) => {
	console.log("Received request to /");
	// res.send("Hello from express!");
	res.sendFile(__dirname + "/main.html")
})

const os = require("os")

app.get("/api/getMovieList", (req, res) => {
    console.log("getMovieList");
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
                        	res.send(genTable(contents));
			}
		});
})


app.get("/api/deleteAtId", (req, res) => {
    row  = req.query["id"];
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
				contents = JSON.parse(contents);
				contents.splice(row, 1);
				newContents = JSON.stringify(contents);
				fs.writeFileSync(__dirname + filename, newContents);
				res.send(genTable(newContents));
			}
		});
})

app.get("/api/editAtId", (req, res) => {
    row  = req.query["id"];
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
				contents = JSON.parse(contents);
				res.send(genEditTable(contents[row], row));
			}
		});
})


app.get("/api/pushEdit", (req, res) => {
    row  = req.query["id"];
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
				contents = JSON.parse(contents);
				for (i in contents) {
					if (contents[i]["movie_imdb_link"] == req.query["link"] && i!=row) {
						//prevent edit from happening if duplicate of IMDb link is found
						console.log(i, + " " + row);
						res.send({edited:false});
						return;
					}
				}
				contents[row] = {director_name:req.query["dir"], actor_2_name:req.query["act2"], genres:req.query["genres"], actor_1_name:req.query["act1"], movie_title:req.query["title"], actor_3_name:req.query["act3"],plot_keywords:req.query["pk"], movie_imdb_link:req.query["link"]};
				newContents = JSON.stringify(contents);
				fs.writeFileSync(__dirname + filename, newContents);
				res.send({edited:true});
			}
		});
})

app.get("/api/addItem", (req, res) => {
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
				contents = JSON.parse(contents);
				res.send(genEditTable({director_name:"", actor_2_name:"", genres:"", actor_1_name:"", movie_title:"", actor_3_name:"",plot_keywords:"", movie_imdb_link:""}, contents.length));
			}
		});
})


app.get("/res/getStyleInfo", (req, res) => {
    console.log("Stylesheet Loaded");
	res.sendFile(__dirname + "/styles.css");
})

app.get("/res/getClientScript", (req, res) => {
    console.log("Client-side script loaded");
	res.sendFile(__dirname + "/movie_client.js");
})


const port = 62062 //change this if needed
app.listen(port, () => console.log("Listening at port: " + port));


function genTable(database) {
    table = JSON.parse(database);
	tableString = "<tr><td>Movie Name</td><td>Director</td><td>Leading Actor</td><td>Second Actor</td><td>Third Actor</td><td>Genres</td><td>Plot Keywords</td><td>IMDb Link</td></tr>";

	for (row in table) {
		tableString += "<tr>" +"<td>" + table[row]["movie_title"] + "<button class=\"yes\" onclick=\"editItem(" + row + ")\">Edit</button>" + "<button class=\"no\" onclick=\"deleteItem(" + row + ")\">Delete</button>" + "</td>" + "<td>" + table[row]["director_name"] + "</td>" +"<td>" + table[row]["actor_1_name"] + "</td>" + "<td>" + table[row]["actor_2_name"] + "</td>" + "<td>" + table[row]["actor_3_name"] + "</td>" + "</td>" + "<td>" + table[row]["genres"] + "</td>" + "<td>" + table[row]["plot_keywords"] + "</td>" + "<td><a href="+ table[row]["movie_imdb_link"] + ">" + table[row]["movie_imdb_link"] + "</a></td>" + "</tr>";
	}

	return tableString;
}

function genEditTable(entry, row) {
	tableString = "<tr><td>Movie Name</td><td>Director</td><td>Leading Actor</td><td>Second Actor</td><td>Third Actor</td><td>Genres</td><td>Plot Keywords</td><td>IMDb Link</td></tr>";
	tableString += "<tr>" +"<td><input id=\"movie_title\" value=\"" + entry["movie_title"] + "\"><button class=\"yes\" onclick=\"submitEdit(" + row + ")\">Submit</button>" + "<button class=\"no\" onclick=\"location.href='/'\">Cancel</button>" + "</td>" + "<td><input id=\"director_name\" value=\"" + entry["director_name"] + "\"></td>" +"<td><input id=\"actor_1_name\" value=\"" + entry["actor_1_name"] + "\"></td>" + "<td><input id=\"actor_2_name\"value=\"" + entry["actor_2_name"] + "\"></td>" + "<td><input id=\"actor_3_name\"value=\"" + entry["actor_3_name"] + "\"></td>" + "<td><input id=\"genres\"value=\"" + entry["genres"] + "\"></td>" + "<td><input id=\"plot_keywords\"value=\"" + entry["plot_keywords"] + "\"></td>" + "<td><input id=\"link\"value=\"" + entry["movie_imdb_link"] + "\"></td>" + "</tr>";

	return tableString;
}
