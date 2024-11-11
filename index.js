const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app = express()

mongoose.connect('mongodb://localhost/urlShortener')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

//Route 1: display all Shortened Urls
app.get('/', async (req, res) => {
   try {
      const shortUrls = await ShortUrl.find()
      res.render('index', { shortUrls})
   } catch (error) {
      console.error('Error fetching URLs:', error)
      res.render('index', { shortUrls: [] }); // Pass an empty array if there’s an error
   }
})

app.post('/shortUrls', async (req, res) => {
   const fullUrl = req.body.fullUrl
 
   try {
     const shortUrl = nanoid(7)
     await ShortUrl.create({ full: fullUrl, short: shortUrl })
     res.redirect('/')
   } catch (error) {
     res.status(500).send("Error creating short URL")
   }
 })
 

app.get('/shortUrl', async (req, res) => {
  try { const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
   if (shortUrl == null) return res.sendStatus(404)

      shortUrl.clicks++
      shortUrl.save()

      res.redirect(shortUrl.full)
   } catch (error) {
      res.status(500).send("Error during redirection")
   }
})

app.listen(process.env.PORT || 5000);
