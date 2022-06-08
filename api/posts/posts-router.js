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

router.get('/:id', (request, response) => {
    Posts.findById(request.params.id)
        .then(possiblePost => {
            if (!possiblePost) {
                response.status(404).json({
                    message: 'The post with the specified ID does not exist'
                });
            } else {
                response.json(possiblePost);
            }
        })
        .catch(error => {
            response.status(500).json({
                message: 'The post information could not be retrieved'
            });
        });
});

router.post('/', (request, response) => {
    const { title, contents } = request.body;
    if (!title || !contents) {
        response.status(400).json({
            message: 'Please provide title and contents for the post'
        });
    } else {
        Posts.insert(request.body)
            .then(({ id }) => {
                return Posts.findById(id);
            })
            .then(newPost => {
                response.status(201).json(newPost);
            })
            .catch(error => {
                response.status(500).json({
                    message: 'There was an error while saving the post to the database'
                });
            });
    }
});

module.exports = router;