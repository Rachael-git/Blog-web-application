import express from 'express'
import { data } from './data.js'

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.render('index', { title: 'B;og Web', data })
})

app.get('/addpost', (req, res) => {
	res.render('addpost', { title: 'Add Post', clickedAdd: true })
})

app.get('/viewpost', (req, res) => {
	const viewPost = getTargetedPost(req.query.id)
	res.render('viewpost', { title: 'B;og Web', viewPost, data })
})

app.get('/editpost', (req, res) => {
	const editPost = getTargetedPost(req.query.id)
	res.render('editpost', { title: 'B;og Web', editPost, data })
})

app.get('/delete', (req, res) => {
	const idToDelete = req.query.id
	const indexToDelete = data.findIndex((post) => post.postId === idToDelete)
	data.splice(indexToDelete, 1)
	console.log(indexToDelete)
	res.redirect('/')
})

app.post('/submit', (req, res) => {
	const date = new Date()
	const timeOption = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}

	const transformed = convertKey(req.body)

	const newPost = {
		postId: date.toISOString().replace(/[-:.TZ]/g, ''),
		postDate: date.toLocaleString('en-AU', timeOption),
		...transformed,
	}

	data.push(newPost)
	res.redirect('/')
})

app.post('/edit', (req, res) => {
	const post = convertKey(req.body)
	const targetedPost = getTargetedPost(post.postId)
	targetedPost.postContent = post.postContent
	res.render('viewpost', { title: 'B;og Web', viewPost: targetedPost, data })
})

app.listen(port, () => {
	console.log(`Server running on port:${3000}`)
})

function convertKey(body) {
	const keyMap = {
		'post-id': 'postId',
		'post-title': 'postTitle',
		'post-content': 'postContent',
		'post-auther': 'postAuther',
	}
	const transformed = Object.fromEntries(
		Object.entries(body).map(([key, value]) => [keyMap[key] || key, value])
	)
	return transformed
}

function getTargetedPost(id) {
	return data.filter((post) => {
		return post.postId === id
	})[0]
}
