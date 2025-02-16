// this file handles who created a subscription and their details

import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";


export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder/`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};


export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check if the user is the same user that created the subscription
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}