const data_file_name = "/movie_metadata_subset.csv" ;
const json_file_name = "/movie_metadata_subset.json" ;

const fs = require('fs');

///////////////////// Process movie database file ///////////////////// 

function processFileData( contents ) {
        let item_list = [];
	let stringContents = String( contents );
	let lines = stringContents.split(/\r?\n/);  // forces contents into a string= from object!
	for (let index = 1; index < lines.length; index++) { 
		let line = lines[ index ]; 
		if( line.length > 0 ) {
			let parts = line.split( "," ); // the line broken down into the individual parts
			//console.log("reached");
			let item = {director_name:parts[0], actor_2_name:parts[1], genres:parts[2], actor_1_name:parts[3], movie_title:parts[4], actor_3_name:parts[5],plot_keywords:parts[6],movie_imdb_link:parts[7]};
			//console.log(JSON.stringify(item));
			item_list.push(item);
			//console.log(item_list.length);
		}
	}
        console.log(item_list.length);
	return JSON.stringify(item_list);
}

function readCSV(filename) {
	fs.readFile(__dirname + filename,
		function(err, contents) {
			if( err ) {
				console.log("Error reading file:" + filename );
			} else {
                        fs.writeFileSync(__dirname + json_file_name, processFileData( contents ));
			}
		}
	);
}

readCSV(data_file_name)

