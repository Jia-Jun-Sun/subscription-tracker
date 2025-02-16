import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";


const REMINDERS = [7, 5, 2, 1]; // an array for reminders of days ahead of the renewal

export const sendReminders = serve(async (context) => { // this is an async function that will give us the context of that current workflow
    const { subscriptionId } = context.requestPayload; // extracting the subscription Id from a specific workflow
    const subscription = await fetchSubscription(context, subscriptionId); // then we will fetch the details of that subscription

    if (!subscription || subscription.status !== 'active') return; // if there's no subscription, or the subscription's status is not active, we are going to exit


    // and if there is an active subscription, we need to figure out the renewal date
    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) { // checks if the renewal date is before the current date and time
        console.log(`Renewal date has passed for the Subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    // calculates how many days till the
    for (const daysBefore of REMINDERS) { // fetches the number of days from the REMINDERS variable
        const reminderDate = renewalDate.subtract(daysBefore, 'day'); // this line is essentially saying let's say if the renewal date is sept 30th, 30 is going to subtract each of the days in REMINDER, so then we have a reminder on the 23rd, 25th, 28th, and 29th

        if (reminderDate.isAfter(dayjs())) {
            // schedule reminder
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription) // this will end up looking like "Reminder 5 days before"
        }
    }
})


export const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
};


const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`); // what is this label?
    await context.sleepUntil(label, date.toDate())
};


const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // later on we can send email, SMS, push notification, etc
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    })
}