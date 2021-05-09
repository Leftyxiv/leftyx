Ticket resale application using micro-services
ticket resale application using micro-services deployed in k8s cluster

Technology Stack
* Express
    - mogoose
    - cookie-session
    - express-validator
    - jasonWebToken
    - custom-standard-error using typescript abstract classes

* NextJS
* Mongo
    - mongo container inside k8s cluster
* TypeScript
* ReactJS
* Stripe Payment
* Jest Testing
    - super-test
* Common code sharing using npm modules
* Skaffold for local k8s development

Infrastructure
* Docker Containers
* Docker for Windows for local Dev
* GCP Kubernetese cluster for local dev
* NATS streaming server as event bus

Services
- auth-service => Create, authorize user, generate JWT
- tickets-service => Manage tickets
- orders-serice => Manage Orders
- payment-service => Manage payments using stripe
- expiration-service => Lock tickets during buying process
- client-service => client side rendered react app using nextJS