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

app.get('/post', (req, res) => {
	const viewPostId = req.query.id
	const viewPost = data.filter((post) => {
		return (post.postId = viewPostId)
	})[0]

	res.render('viewpost', { title: 'B;og Web', viewPost, data })
})

app.post('/submit', (req, res) => {
	const date = new Date()
	// const postId = date.toISOString().replace(/[-:.TZ]/g, '')
	const timeOption = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}
	// const postTime = date.toLocaleString('en-AU', timeOption)
	// console.log(postId, postTime)

	const keyMap = {
		'post-title': 'postTitle',
		'post-content': 'postContent',
		'post-auther': 'postAuther',
	}

	const transformed = Object.fromEntries(
		Object.entries(req.body).map(([key, value]) => [keyMap[key] || key, value])
	)

	const newPost = {
		postId: date.toISOString().replace(/[-:.TZ]/g, ''),
		postDate: date.toLocaleString('en-AU', timeOption),
		...transformed,
	}

	data.push(newPost)
	res.redirect('/')
})
app.post('/edit', (req, res) => {
	console.log(req.body)
})


app.post('/delete', (req, res) => {
	const idToDelete = req.body.postId
	const indexToDelete = data.findIndex((post) => post.postId === idToDelete)
	data.splice(indexToDelete, 1)
	res.redirect('/')
})

app.listen(port, () => {
	console.log(`Server running on port:${3000}`)
})
