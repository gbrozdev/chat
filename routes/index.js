var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId

/* GET home page. */
router.get('/', async function (req, res) {
  res.render('index');
});
router.get('/demo', async function (req, res) {
  var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://climate-change-live1.p.rapidapi.com/news/guardian',
  headers: {
    'x-rapidapi-host': 'climate-change-live1.p.rapidapi.com',
    'x-rapidapi-key': 'cdb0dbdf68msh6e03439f69f86dep10f7dfjsn39ee290d53e2'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
  
  let array = [];
  array = response.data
  
  res.render('demo',{array});


}).catch(function (error) {
	console.error(error);
});

});


router.get('/like/:id',async(req,res)=>{
  let id = req.params.id
  let reviews = await db.get().collection('blogs').findOne({_id:ObjectId(id)})
  let likes = reviews.likes
  likes.push('userid')
  let numlikes = likes.length
  let myquery = {_id:ObjectId(id)}
  let newvalues = { $set: {"likes":likes,"numlikes":numlikes}}
  db.get().collection('reviews').updateOne(myquery,newvalues)
  res.redirect('/')
})

router.post('/upload', function (req, res) {
  let data = req.body
  console.log(data);
  db.get().collection('images').insertOne(data).then((response) => {
    let id = response.insertedId
    let userid = req.body.userid
    let image = req.files.image
    image.mv('./public/images/' + userid + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/users/myprofile/')
      } else {
        console.log(err);
      }
    })
  })

});


router.get('/delete/:id', (req, res) => {
  id = req.params.id
  db.get().collection('blogs').deleteOne({ _id: ObjectId(id) })
  res.redirect('/admin')
})



module.exports = router;
