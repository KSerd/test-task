const express = require('express');
const Preposition = require('./services/preposition');
const ArticleParser = require('./services/article-parser');
const SchemaValidator = require('./services/schema-validator');
const mongoose = require('mongoose');
const router = express.Router();

const schemaValidator = new SchemaValidator({
  allErrors: true,
  removeAdditional: 'all'
});

mongoose.connection.openUri(`mongodb://${process.env.HostnameDB}/preposition`).on('error', (error) => {
  console.error(error);
});
mongoose.Promise = global.Promise;


router.get('/article', async (req, res, next) => {
  try {
    let url = req.query.articleURL;
    let articleParser = new ArticleParser(url);
    let article = await articleParser.parse();
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
});

router.get('/prepositions', (req, res, next) => {
  let filter = {};
  if (req.query.isApproved === 'true') {
    filter = {
      isApproved: true
    };
  } else if (req.query.isApproved === 'false') {
    filter = {
      isApproved: false
    };
  }

  Preposition.find(filter, (err, prepositions) => {
    if (err) {
      let error = new Error('Problem with DB');
      error.code = 500;
      return next(error);
    }

    res.status(200).json(prepositions);
  });
});

router.post('/prepositions', schemaValidator.validateSchema('prepositions-post'), (req, res, next) => {
  let body = req.body;
  let newPreposition = Preposition({
    articleUrl: body.articleUrl,
    originalText: body.originalText,
    usersText: body.usersText,
    isApproved: false
  });

  newPreposition.save((err) => {
    if (err) {
      let error = new Error('Problem with DB');
      error.code = 500;
      return next(error);
    }
  
    res.status(201).json({
      message: 'success'
    });
  });
});

router.put('/prepositions/:id', schemaValidator.validateSchema('prepositions-put'), (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    let error = new Error('Preposition id is incorrect');
    error.code = 422;
    return next(error);
  }

  let body = req.body;
  Preposition.findById(id, (err, preposition) => {
    if (err) {
      let error = new Error('Problem with DB');
      error.code = 500;
      return next(error);
    }

    preposition.articleUrl = body.articleUrl;
    preposition.originalText = body.originalText;
    preposition.usersText = body.usersText;
    preposition.isApproved = body.isApproved;

    preposition.save((err) => {
      if (err) {
        let error = new Error('Problem with DB');
        error.code = 500;
        return next(error);
      }

      res.status(200).json({
        message: 'success'
      })
    });
  });
});

router.delete('/prepositions/:id', (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    let error = new Error('Preposition id is incorrect');
    error.code = 422;
    return next(error);
  }

  Preposition.findByIdAndRemove(id, (err) => {
    if (err) {
      let error = new Error('Problem with DB');
      error.code = 500;
      return next(error);
    }

    res.status(200).json({
      message: 'success'
    })
  });
});

module.exports = router;
