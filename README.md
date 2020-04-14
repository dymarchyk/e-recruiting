# E-rectuiting

Recruiting questionnaire builder.

This application powered by [React JS](https://ru.reactjs.org/) and [Adonis JS](https://adonisjs.com/).

### Building app

Create `.env` file like the `.env.example` and insert varibles do to local enviroment.

Install all dependecies runnning `yarn` in project root.

If you have no mysql installed - run `docker-compose up -d`. This will create virtual image with mysql db.

Create database and user with privileges. Read [this](https://matomo.org/faq/how-to-install/faq_23484/) article.

Then in project root run `adonis migration:run`. This will create all database tables.

To seed database run `adonis seed`.
This also create default user with credentials:

```javascript
email:    admin@erecruiting.com,
password: 123456
```

After all apckages installed and configurations done - run `yarn buid` and then `yarn start`.

