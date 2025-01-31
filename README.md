# Northcoders News API

[summary]

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
- `git remote set-url origin [YOUR_NEW_REPO_URL_HERE]`
- `git branch -M main`
- `git push -u origin main`
2. To connect to the two databases locally you need to create two `.env` files named `.env.test` and `.env.development`.
3. In `.env.test` add `PGDATABASE=nc_news_test` and in `.env.development` add `PGDATABASE=nc_news`.
4. Run `npm install` to install the required dependencies.
5. You will then want to run `npm run prepare` to setup husky.
6. Then you will want to set the database up using `npm run setup-dbs`.
7. You can then run the tests using `npm test`.

## Endpoints
- **GET /api/topics**: Retrieves an array of topic objects.
- **GET /api/articles**: Retrieves an array of article objects.
- **GET /api/articles/:article_id**: Retrieves a specific article by ID.
- **GET /api/articles/:article_id/comments**: Retrieves comments for a specific article.
- **PATCH /api/articles/:article_id**: Updates a specific article.
- **POST /api/articles/:article_id/comments**: Adds a comment to a specific article.
- **GET /api/users**: Retrieves user information.
- **DELETE /api/comments/:comment_id**: Deletes a specific comment.

## Links
Link to live version: [Here](https://first-project-my3j.onrender.com) (please note that there can be a bit of a delay when loading - This is caused by the free hosting service after a period of inactivity)

---
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
