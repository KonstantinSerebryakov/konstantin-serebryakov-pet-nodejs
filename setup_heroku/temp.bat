
heroku config:set JWT_SECRET=paxDcneVcsMpzj7v --app share-portfolio-accounts
heroku config:set JWT_EXP_H=555555555 --app share-portfolio-accounts
heroku config:set AMQP_USER=oyjgvksf --app share-portfolio-accounts
heroku config:set AMQP_PASSWORD=fsi7lO8vg0MjCHwbP9Nyvxc5bzjiPkbI --app share-portfolio-accounts
heroku config:set AMQP_HOSTNAME=stingray.rmq.cloudamqp.com --app share-portfolio-accounts
heroku config:set AMQP_VHOSTNAME=oyjgvksf --app share-portfolio-accounts
heroku config:set AMQP_EXCHANGE=rmq --app share-portfolio-accounts
heroku config:set AMQP_QUEUE_ACCOUNTS=rmq.accounts --app share-portfolio-accounts
heroku config:set AMQP_QUEUE_API=rmq.api --app share-portfolio-accounts
heroku config:set AMQP_QUEUE_PROFILES=rmq.profiles --app share-portfolio-accounts
heroku config:set DATABASE_URL_ACCOUNTS=postgresql://postgres:Tki6y8sM7xM04vpl@db.mzrawswjsvajmwgepfhk.supabase.co:5432/postgres?schema=accounts --app share-portfolio-accounts
heroku config:set DATABASE_URL_PROFILES=postgresql://postgres:Tki6y8sM7xM04vpl@db.mzrawswjsvajmwgepfhk.supabase.co:5432/postgres?schema=profiles --app share-portfolio-accounts
