const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){
    const firstName = req.body.fname;
    const secondName = req.body.lname;
    const email = req.body.email;
    
    const data = {
        members : [
            {
                email_address: email,
                status : "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/86455e0514";
    
    const options = {
        method : "POST",
        auth : "nipun1:c093c0c9d9afb2d7c415daca5c49f712-us8"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("server started at port 3000");
});

// Mailchimp apikey
// c093c0c9d9afb2d7c415daca5c49f712-us8

// List id
// 86455e0514