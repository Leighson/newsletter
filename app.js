const port = process.env.PORT || 3000;

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// retrieve home page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});


// captures request for sign up page ("/") and saves user inputs
app.post("/", function(req, res) {

    // user information
    const firstName = req.body["firstNameInput"];
    const lastName = req.body["lastNameInput"];
    const email = req.body["emailInput"];

    const data = {
        members: [{
            email_address : email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }


    const jsonData = JSON.stringify(data);

    // define server and authentication information
    const dataCentre = "us10";
    const listID = "93d2db359f";
    const endpoint = `lists/${listID}`;

    const url = `https://${dataCentre}.api.mailchimp.com/3.0/${endpoint}`;

    const options = {
        method: "POST",
        auth: "lee1:c16c4f26af083410f397c20e659341e5-us10"
    }

    // create object that opens API request and responds accordingly
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

    });

    // executes request
    request.write(jsonData);
    request.end();

});

// respond to response pages (success or failure) by redirecting back to the sign up page ("/")
app.post("/success", function(req, res) {
    res.redirect("/");
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

// run server command
app.listen(port, function() {
    console.log(`Server is running on port ${port}.`);
});