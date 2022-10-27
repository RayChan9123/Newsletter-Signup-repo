const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

//make all static files render to client
app.use(express.static("public"));
//parse data
app.use(bodyParser.urlencoded({extended: true}));
//send html file
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//configure api
client.setConfig({
  apiKey: "4c5268e8a3b6dd00c90426b03a87ef1d-us8",
  server: "us8",
});

app.post("/", function(req, res) {

  //sepecify the data we interested from user by accessing request
  const subscribingUser = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email}
  console.log(subscribingUser);
  //send data to mailchimp , add list member / audience
  const run = async () => {
    try {
        const response = await client.lists.addListMember("4e5cb82fad", {
        email_address: subscribingUser.email,
        status: "subscribed",
        //merge_fields is usually required
        merge_fields: {
          FNAME:subscribingUser.firstName,
          LNAME:subscribingUser.lastName
        }
      });
      console.log("The response to the API (Mailchimp) SUCCEED" + response.status);
      res.sendFile(__dirname + "/success.html");
    }
    catch(err) {
      console.log("Client FAIL to send data to API (Mailchimp) " + err.status);
      res.sendFile(__dirname + "/failure.html");
    }

    //check if response to client is successful
    console.log("Response status code to client : " + res.statusCode);
  };
  //call to send data to mailchimp
  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("The server has started on port 3000...");
});


//apiKey
//4c5268e8a3b6dd00c90426b03a87ef1d-us8
//audienceID/listID
//4e5cb82fad

//for mailchimp
// POST /lists/{list_id} --- Batch subscribe or unsubscribe
// path parameters --- 'list_id' is required
// body parameter --- 'member' is required, member is an object(array)
// member's property --- 'email_address' is required
// member's property --- 'status' is required
