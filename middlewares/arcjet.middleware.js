import aj from "../config/arcjet.js";


const arcjetMiddleWare = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 }); // we are protecting the req, and tell me your decision if you want to deny it or let it through

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate Limit Reached' });
            if (decision.reason.isBot()) return res.status(403).json({ error: "Bot detected" });

            // other wise
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    } catch (error) {
        console.error(`Arcjet Middleware Error: ${error}`);
        next();
    }
};


export default arcjetMiddleWare;