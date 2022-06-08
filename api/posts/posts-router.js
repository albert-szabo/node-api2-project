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

router.delete('/:id', async (request, response) => {
    const possiblePost = await Posts.findById(request.params.id);
    if (!possiblePost) {
        response.status(404).json({
            message: 'The post with the specified ID does not exist'
        });
    } else {
        Posts.remove(request.params.id)
            .then(numberOfPostsDeleted => {
                response.json(possiblePost);
            })
            .catch(error => {
                response.status(500).json({
                    message: 'The post could not be removed'
                });
            });
    }
});

router.put('/:id', (request, response) => {
    const { title, contents } = request.body;
    if (!title || !contents ) {
        response.status(400).json({
            message: 'Please provide title and contents for the post'
        });
    } else {
        Posts.findById(request.params.id)
            .then(post => {
                if (!post) {
                    response.status(404).json({
                        message: 'The post with the specified ID does not exist'
                    });
                } else {
                    return Posts.update(request.params.id, request.body);
                }
            })
            .then(numberOfPostsUpdated => {
                if (numberOfPostsUpdated) {
                    return Posts.findById(request.params.id);
                }
            })
            .then(updatedPost => {
                if (updatedPost) {
                    response.json(updatedPost);
                }
            })
            .catch(error => {
                response.status(500).json({
                    message: 'The post information could not be modified'
                });
            });
    }
});

module.exports = router;