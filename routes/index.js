var express = require('express');
var fh = require('node-fetch');
var router = express.Router();
const clientId = '{}';
const clientSecret = '{}';
/* GET home page. */
router.get('/', function (req, res, next) {
  var endpoint = "https://accounts.google.com/o/oauth2/v2/auth?" +
    "client_id=" + encodeURI(clientId) + "&" +
    "redirect_uri=http://localhost:3001/auth" +
    "&" +
    "access_type=" + "online" + "&" +
    "state=test_state" + "&" +
    "response_type=code&" +
    "scope=" + encodeURI("email profile");
  res.render('index', {
    title: 'sample',
    OAuth_url: endpoint
  });
});



router.all('/auth', async function (req, res, next) {

  const code = req.query.code;
  console.log(req.query);
  const state = req.query.state;

  const obj = {
    "code": code,
    "client_id": clientId,
    "client_secret": clientSecret,
    "redirect_uri": "http://localhost:3001/auth",
    "grant_type": "authorization_code"
  };
  let pjson;
  try {
    pjson = await fh("https://www.googleapis.com/oauth2/v4/token", {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(obj) // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
    });
  } catch (e) {
    //cathc
  }
  let jsona = await pjson.json();
  console.log(jsona);

  const usr = await fh('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + encodeURI(jsona.access_token), {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let user_info = await usr.json();
  console.log(user_info);
  //location.href = endpoint;
  res.render('user', {
    title: 'sample',
    email: user_info.email,
    name: user_info.name,
    picture: user_info.picture
  });
})


module.exports = router;