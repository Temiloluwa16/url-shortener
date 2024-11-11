const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener')
//   useNewUrlParser: true,
//    useUnifiedTopology: true,
//})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

//Route 1: display all Shortened Urls
app.get('/', async (req, res) => {
   try {
      const shortUrls = await ShortUrl.find()
      res.render('index', { ShortUrls: shortUrls})
   } catch (error) {
      console.error(error)
      res.sendStatus(500).send("Error retrieving URLs")
   }
})

app.post('/shortUrls', async (req, res) => {
    ShortUrl.create({full: req.body.fullUrl })
   
   try {
      const shortUrl = nanoid(7)
      await ShortUrl.create({ full: fullUrl, short: shortUrl })
      res.redirect('/')
   } catch (error) { 
   } res.status(500).send("Error creating short URL")
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
