# mesg-lighthouse-ci

Run a [lighthouse](https://developers.google.com/web/tools/lighthouse/) audit of your website through mesg, triggered by webhook by your favorite CI.

Deploy the necessary services:

```bash
mesg-core service deploy https://github.com/eisenbergrobin/mesg-lighthouse
mesg-core service deploy https://github.com/eisenbergrobin/mesg-http
mesg-core service deploy https://github.com/mesg-foundation/service-webhook
```

Start the application:

```bash
open http://localhost:8080/report-mesg-com
```

Request a lighthouse audit of `https://mesg.com`:

```bash
curl -X POST \
  http://localhost:3000/webhook \
  -H 'Content-Type: application/json' \
  -d '{ "task": "lighthouse", "url": "https://mesg.com" }'
```

View the results:

```bash
open http://localhost:8080/report-mesg-com
```

![lighthouse-report](https://user-images.githubusercontent.com/4547030/52914707-0c255080-32cc-11e9-9e41-e83d0890bd08.png)
