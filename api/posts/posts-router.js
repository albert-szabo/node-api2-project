// implement your posts router here

const express = require('express');

const Posts = require('./posts-model');

const router = express.Router();

router.get('/', (request, response) => {
    Posts.find()
        .then(posts => {
            response.json(posts);
        })
        .catch(error => {
            response.status(500).json({
                message: 'The posts information could not be retrieved'
            });
        });
});

module.exports = router;