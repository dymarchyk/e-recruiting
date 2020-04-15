# E-rectuiting

Recruiting questionnaire builder.

This application powered by [React JS](https://ru.reactjs.org/) and [Adonis JS](https://adonisjs.com/).

### Configuration

Create `.env` file like in the `.env.example`.

Generate app key by running `adonis key:generate`.

### Runing app

In project root exec `docker-compose up -d` to build containers.

If it is first launch - you need to run migrations.

Run `docker exec -it app bash` then `adonis migration:run --force`. For seeding data run `adonis seed --force`.

This also create default user with credentials:

```
email:    admin@erecruiting.com,
password: 123456
```

### Building app

Install all dependencies by running `yarn` in project root.

Create database and user with privileges. Read [this](https://matomo.org/faq/how-to-install/faq_23484/) article.

Then in project root run `adonis migration:run`. This will create all database tables.

To seed database run `adonis seed`.
This also create default user with credentials:
```
email:    admin@erecruiting.com,
password: 123456
```

After all packages installed and configurations done - run `yarn buid` and then `yarn start`.

