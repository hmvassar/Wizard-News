const express = require("express");
const morgan = require("morgan")
const postBank = require("./postBank")
const timeAgo = require("node-time-ago")

const app = express();
const { PORT = 1337 } = process.env;
app.use(morgan('dev'));
app.use(express.static('public'));


app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class"news-list">
          <header>
            <img src="/logo.png"/>Wizard News</header>
            ${posts
              .map(
                (post) => `
              <div class='news-item'>
                <p>
                  <span class="news-position">${post.id}. ▲</span>
                  <a href="/posts/${post.id}">${post.title}</a>
                  <small>(by ${post.name})</small>
                </p>
                <small class="news-info">
                  ${post.upvotes} upvotes | ${post.date}
                </small>
              </div>`
              )
              .join("")}
        </div>
      </body>
    </html>
    `;
  res.send(html);
})

app.get('/posts/:id', (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);
  const howLongAgo = timeAgo(Date.now() - post.date);
  const date = new Date(post.date)
  const postDate =
    date.toDateString() + " " + date.getDate() + ", " + date.getFullYear();
    if(!post.id) {
    
    next();
  }
  else {
    const html = `<html>
        <head>
          <title>Wizard News</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <header>
            <img src="/logo.png"/>Wizard News</header>
              <div class='news-item'>
                <p>
                  <span class="news-position">${post.id}. ▲</span>
                  ${post.title}
                  <small>(by ${post.name})</small>
                </p>
                <small class="news-info">
                  ${post.upvotes} upvotes | ${howLongAgo} | ${postDate}
                </small>
              </div>
        </body>
      </html>
      `;
    res.send(html);
  }
})

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found on the server</h1>");
});


app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});