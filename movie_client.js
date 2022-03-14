//Based on example code by Saleem Bhatti on Studres

window.onload = function() {
    fetch("api/getMovieList").
        then(res => res.text()).
	then(res => document.getElementById("movie_list").innerHTML = res)
}


function deleteItem(row) {
    fetch("api/deleteAtId?id=" + row).
    then(res => res.text()).
then(res => document.getElementById("movie_list").innerHTML = res)
}

function editItem(row) {
    document.getElementsByTagName("button")[0].remove();
    fetch("api/editAtId?id=" + row).
    then(res => res.text()).
then(res => document.getElementById("movie_list").innerHTML = res)
}

function submitEdit(row) {
    if (isInvalidInput()) return;
    fetch("api/pushEdit?id=" + row + "&title=" + document.getElementById("movie_title").value + "&dir=" + document.getElementById("director_name").value + "&act1=" + document.getElementById("actor_1_name").value + "&act2=" + document.getElementById("actor_2_name").value + "&act3=" + document.getElementById("actor_3_name").value + "&genres=" + document.getElementById("genres").value + "&pk=" + document.getElementById("plot_keywords").value + "&link=" + document.getElementById("link").value).
    then(res => res.json()).
    then(res => checkEditAttempt(res))
}

function addItem() {
    document.getElementsByTagName("button")[0].remove();
    fetch("api/addItem").
    then(res => res.text()).
then(res => document.getElementById("movie_list").innerHTML = res)
}

function isInvalidInput() {
    valid_name = /^[a-z ,.'-:\u00A0]+$/i;
    if (!valid_name.test(document.getElementById("movie_title").value)){
        window.alert("Please enter a valid name for the movie!");
        return true;
    }
    else if (!valid_name.test(document.getElementById("director_name").value)){
        window.alert("Please enter a valid name for the director!");
        return true;
    }
    else if (!valid_name.test(document.getElementById("actor_1_name").value)){
        window.alert("Please enter a valid name for the leading actor!");
        return true;
    }
    else return false;
}

function checkEditAttempt(res){
    if (res["edited"]==false) window.alert("Your submission was rejected due to a duplicate IMDb link!");
    else location.href="/";
}