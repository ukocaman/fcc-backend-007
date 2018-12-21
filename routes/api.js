/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// var expect = require('chai').expect;
// var MongoClient = require('mongodb');
// var ObjectId = require('mongodb').ObjectID;

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const Issue = require('../models/issue')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project
      const query = req.query
      Issue.find({ ...query, project })
      .then(issues => {
        res.json(issues)  
      })
      .catch(e => console.log(e))
    })
    
    .post(function (req, res){
      const project = req.params.project
      // console.log('POST')
      // console.log(req.body)
      const reqBody = req.body
      const requiredFields = ['issue_title', 'issue_text', 'created_by']
      const requiredFieldsMissing = requiredFields.map(f => reqBody[f] ? true : false).includes(false)
      if(requiredFieldsMissing) {
        res.send('required fields missing')
      } else {
        const issue = new Issue({...reqBody, project, open: true})
        issue.save()
        .then(issue => {
          res.json(issue)
        })
        .catch(e => console.log(e))
      }
    })
    
    .put(function (req, res){
      // var project = req.params.project;
      // console.log('UPDATE')
      // console.log(req.body)
      
      let updateObject = Object.keys(req.body).reduce((acc, key) => {
        if(key !== '_id' && req.body[key]) { //update obj includes all the fields with a value excluding id
          return { ...acc, [key]: req.body[key] }
        } else {
          return acc
        }
      }, {})
      // console.log(updateObject)
      
      if(Object.keys(updateObject).length === 0) {
        res.send('no updated field sent')
      } else {
        const { _id } = req.body
        Issue.findOneAndUpdate({_id}, updateObject, { new: true })
        .then(issue => res.send('successfully updated'))
        .catch(e => {
          // console.log(e)
          res.send('could not update ' + _id)
        })
      }
    })
    
    .delete(function (req, res){
      // const project = req.params.project
      // console.log('DELETE')
      const { _id } = req.body
      if(!_id){
        res.send('_id error')
      } else {
        Issue.findByIdAndDelete(_id)
        .then(issue => {
          if(issue) {
            res.send('deleted ' + _id)
          } else {
            res.send('could not delete ' + _id)
          }
        })
        .catch(e => {
          console.log(e)
          res.send('could not delete ' + _id)
        })
      }
    });
    
};
