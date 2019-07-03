var express = require('express');
var router = express.Router();
const excelToJson = require('convert-excel-to-json');
var Student = require('../models/Student.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/upload', (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('../fileupload/public/assets/uploaded-files/' + req.files.file.name, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      const result = excelToJson({
        sourceFile: '../fileupload/public/assets/uploaded-files/' + req.files.file.name,
        columnToKey: {
          A: 'id',
          B: 'names'
        }
      });
      res.json(result);
    }
  });
});

router.get('/students/:id', (req, res) => {
  Student.find({studentId:req.params.id}, function (err, student) {
    if(err){
      console.log(err);
      res.send("student not found");
    }else{
       res.json(student).status(200);
    }
  })
});

router.post('/students/save', (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('../fileupload/public/assets/uploaded-files/' + req.files.file.name, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      const result = excelToJson({
        sourceFile: '../fileupload/public/assets/uploaded-files/' + req.files.file.name,
        columnToKey: {
          A: 'id',
          B: 'names',
          C:'email'
        }
      });
      var sts = [];
      result.Sheet1.forEach(student => {
        var st = new Student({
          studentId:student.id,
          names:student.names,
          email:student.email
        });
        Student.create(st, function (err,student) {
          if(err){
            console.log(err);
          }
          // res.send(success);
        })
        sts.push(st)
      });
      console.log(sts);
      res.send("ok");
      // res.json(result.Sheet1);
    }
  });
});

module.exports = router;