const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//allows express to use static files in local directory
app.use(express.static("public"));

//sends signup file when home directory is requested
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req,res){
    //get raw data from post request
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    
    //convert raw data into JSON object
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //convert json data into json flatpack
    var jsonData = JSON.stringify(data);


    var url = "https://us11.api.mailchimp.com/3.0/lists/c5fc93411e";
    var options = {
        method: "POST",
        auth: "hanis:114eb9357ec0aed388f3e0f1501d6cbc-us11"
    };

    //sends https request to mailchimp API
    const request = https.request(url, options, function(response){
        //checks status code and displays success/failure page
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is listening on port 3000");
});

// 114eb9357ec0aed388f3e0f1501d6cbc-us11

// c5fc93411e