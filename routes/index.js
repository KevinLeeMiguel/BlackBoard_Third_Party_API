var express = require('express');
var router = express.Router();
const excelToJson = require('convert-excel-to-json');
var Student = require('../models/Student.js');
var mailer = require('../utilities/mailer');
var conv = require("json-2-csv");

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
  sampleFile.mv('public/assets/uploaded-files/' + req.files.file.name, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      const result = excelToJson({
        sourceFile: 'public/assets/uploaded-files/' + req.files.file.name,
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
  var rs = {};
  Student.find({ studentId: req.params.id }, function (err, student) {
    if (err) {
      console.log(err);
      rs.code = 300;
      rs.description = err;
      rs.object = null;
      res.json(rs).status(200);
    } else {
      rs.code = 200;
      if (student[0]) {
        rs.description = "success";
        rs.object = student[0];
      } else {
        rs.description = "student not found",
          rs.object = null;
      }
      res.json(rs).status(200);
    }
  })
});

router.post('/student/save', (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('public/assets/uploaded-files/' + req.files.file.name, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      const result = excelToJson({
        sourceFile: 'public/assets/uploaded-files/' + req.files.file.name,
        columnToKey: {
          A: 'id',
          B: 'names',
          C: 'email'
        }
      });
      var sts = [];
      result.Sheet1.forEach(student => {
        var st = new Student({
          studentId: student.id,
          names: student.names,
          email: student.email
        });
        Student.create(st, function (err, student) {
          if (err) {
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

router.post('/mail/send', async (req, res) => {
  var to = req.body.to;
  var subj = req.body.subject;
  var html = req.body.html;

  mailer.sendMail(to, html, subj);
  res.json("success").status(200);
});

router.get('/students', (req, res) => {
  var rs = {};
  Student.find({}, function (err, students) {
    if (err) {
      console.log(err);
      rs.code = 300;
      rs.description = err;
      rs.object = null;
      res.json(rs).status(200);
    } else {
      rs.code = 200;
      rs.description = "success";
      rs.object = students;
      res.json(rs).status(200);
    }
  })
});

router.post('/json2csv', (req, res) => {
    var data = req.body.data;
    conv.json2csv(data,(err,csv)=>{
      if(err){
        console.log(err);
      }else{
        var csvs = csv; 
         res.json(csvs).status(200);
      }
    })
});

module.exports = router;