const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'node',
    password: 'admin',
    port: 5432,
});
const bodyParser = require('body-parser');
const cors = require('cors');
let config = require('./config');
let jwt = require('jsonwebtoken');
let middleware = require('./middleware');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());
client.connect();

app.get('/', function(req,res){
    res.json({
        success:true,
        message:'Server running'
    });
});
app.post('/login', async function(req,res){
  if(req.body.password){
    client.query('select * from users where email=$1',[req.body.email], async function (error, results, fields) {
      if (error) {
        res.send({
          "success":false,
          "message":"Something went wrong. please try again.!!!"
        })  
      }else{
        if(results.rowCount > 0){
          const comparision = await bcrypt.compare(req.body.password,results.rows[0].password);
          if(comparision){
            let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
              res.send({
                "success":true,
                "message":"login sucessfull",
                "token":token,
                "user":req.body.email,
                "login":"email"
              })
          }else{
            res.send({
                 "success":false,
                 "message":"Credential doen't match"
            })
          }
        }else{
          res.send({
            "success":false,
            "message":"Account not registered. Please register.."
          });
        }
      }
      });
  }else{
    client.query('select * from users where email=$1 and custom_login=$2',[req.body.email,req.body.token], async function (error, results, fields) {
      if (error) {
        res.send({
          "success":false,
          "message":"Something went wrong. please try again.!!!"
        })
      }else{
        if(results.rowCount > 0){
            let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
              res.send({
                "success":true,
                "message":"login sucessfull",
                "token":token,
                "user":req.body.email,
                "login":"google"
              })
        }else{
          let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
          client.query("INSERT INTO users (name,email,custom_login) VALUES ($1,$2,$3)",[req.body.name,req.body.email,req.body.token],function (error, results, fields) {
            if (error) {
              res.send({
                "success":false,
                "message":"something went wrong. please try again.!!!"
              })
            } else {
              res.send({
                "success":true,
                "message":"Registered sucessfully",
                "token":token,
                "user":req.body.email,
                "login":"google"
              })
            }
           });
        }
      }
      });
  }
  /*if(req.body.password){
    var email= req.body.email;
    var password = req.body.password;
    client.query('select * from users where email=$1',[email], async function (error, results, fields) {
      if (error) {
        res.send({
          "success":false,
          "message":"Account not registered. Please register.."
        })
      }else{
        if(results.rowCount > 0){
          const comparision = await bcrypt.compare(password,results.rows[0].password);
          if(comparision){
            let token = jwt.sign({username: email},config.secret,{ expiresIn: '24h'});
              res.send({
                "success":true,
                "message":"login sucessfull",
                "token":token,
                "user":email
              })
          }else{
            res.send({
                 "success":false,
                 "message":"Credentials does not match"
            })
          }
        }else{
          res.send({
            "success":false,
            "message":"Email does not exits"
          });
        }
      }
      });
  }else{
    client.query('select * from users where email=$1',[req.body.email], async function (error, results, fields) {
      if (error) {
        let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
        client.query("INSERT INTO users (name,email,custom_login) VALUES ($1,$2,$3)",[req.body.name,req.body.email,req.body.token],function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"something went wrong. please try again.!!!"
          })
        } else {
          res.send({
            "success":true,
            "message":"Registered sucessfully",
            "token":token,
            "user":req.body.email
          })
        }
       });
      }else{
        let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
        res.send({
          "success":true,
          "message":"Registered sucessfully",
          "token":token,
          "user":req.body.email
        })
      }
      });
  }*/
  /*var email= req.body.email;
  var password = req.body.password;
  client.query('select * from users where email=$1',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        "success":false,
        "message":"Account not registered. Please register.."
      })
    }else{
      if(results.rowCount > 0){
        const comparision = await bcrypt.compare(password,results.rows[0].password);
        if(comparision){
          let token = jwt.sign({username: email},config.secret,{ expiresIn: '24h'});
            res.send({
              "success":true,
              "message":"login sucessfull",
              "token":token,
              "user":email
            })
        }else{
          res.send({
               "success":false,
               "message":"Credentials does not match"
          })
        }
      }else{
        res.send({
          "success":false,
          "message":"Email does not exits"
        });
      }
    }
    });*/
});
app.post('/logout', function(req, res){
    res.json({
        success:true,
        message:'Logout success.!!'
    });

});
app.get('/admin', middleware.checkToken, function(req,res){
    res.json({
        success:true,
        message:'Server running'
    });
});

app.listen(3300, ()=>{
    console.log('Server running in port 3300')
});