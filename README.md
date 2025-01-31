# Northcoders News API

To connect to the two databases locally you need two .env files named .env.test and .env.development.
Add PGDATABASE=nc_news_test; to test and PGDATABASE=nc_news; to development.

Link to live version: [Here](https://first-project-my3j.onrender.com) (please note that there can be a bit of a delay when loading - This is caused by the free hosting service after a period of inactivity)

## Project Description
The `be-nc-news` repository is a **Northcoders News API** that mimics the functionality of a social news feed. It allows users to access and manipulate articles, comments, topics, and users. The API is built using **Node.js** and **Express**, with data stored in **PostgreSQL**.

## Key Features
- **Topics**: Users can view topics.
- **Articles**: Users can veiw and update articles.
- **Comments**: Users can veiw, add and delete comments on articles.
- **Users**: Users can view the different users.

## Installation Requirements
- **Node.js**: Version 17 or above.
- **PostgreSQL**: Version 13.6 or above.

## Setup Instructions
1. Create a local clone of the repository, then in the ternimal use the following:
`git remote set-url origin [YOUR_NEW_REPO_URL_HERE]
git branch -M main
git push -u origin main`
3. 
4. Run `npm install --production=false` to install project and developer dependencies.
5. Set up environment variables by creating `.env.test` and `.env.development` files.
6. Add `PGDATABASE=nc_news_test` to test and `PGDATABASE=nc_news` to development.
7. Start the app using `npm start`.
8. Test the app using `npm test`.

## Endpoints
- **GET /api/topics**: Retrieves an array of topic objects.
- **GET /api/articles**: Retrieves an array of article objects.
- **GET /api/articles/:article_id**: Retrieves a specific article by ID.
- **GET /api/articles/:article_id/comments**: Retrieves comments for a specific article.
- **PATCH /api/articles/:article_id**: Updates a specific article.
- **POST /api/articles/:article_id/comments**: Adds a comment to a specific article.
- **GET /api/users**: Retrieves user information.
- **DELETE /api/comments/:comment_id**: Deletes a specific comment.


---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
