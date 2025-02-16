import { Router } from 'express';
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();


subscriptionRouter.get('/', (req, res) => res.send({ title: 'Get all subscriptions' })); // do this controller on my own in subscription.controller.js

subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get subscription details' })); // do this controller on my own in subscription.controller.js

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update a subscriptions' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete subscriptions' }));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'Cancel a user subscriptions' }));


subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'Get upcoming renewals' }));

export default subscriptionRouter;