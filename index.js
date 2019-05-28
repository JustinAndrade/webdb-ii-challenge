const express = require('express');

const helmet = require('helmet');

const server = express();
const knex = require('knex');

const knexConfig = require('./knexfile').development;

const db = knex(knexConfig);

server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/', (req, res) => {
	res.json('Welcome to the Zoo Api!');
});

server.get('/zoos', async (req, res) => {
	db('zoos')
		.then((zoos) => {
			res.status(200).json(zoos);
		})
		.catch(console.log(err));
});

server.get('/zoos/:id', async (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.then((animal) => {
			res.status(200).json(animal);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

server.post('/zoos', async (req, res) => {
	db('zoos')
		.insert(req.body, 'id')
		.then((res) => {
			res.status(200).json(res);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

server.put('/zoos/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.update(req.body)
		.then((count) => {
			if (count > 0) {
				res.status(200).json(`${count} records updated!`);
			} else {
				res.status(404).json('Id not found');
			}
		})
		.catch((err) => res.status(500).json(err));
});

server.delete('/zoos/:id', async (req, res) => {
	db('zoos')
		.where({ id: req.params.id }, 'id')
		.delete()
		.then((count) => {
			if (count > 0) {
				res.status(210).status(`${count} has been deleted`);
			} else {
				res.status(404).json('id not found');
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
