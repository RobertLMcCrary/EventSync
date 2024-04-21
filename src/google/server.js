require('dotenv').config({ path: '.env.local'});
const express = require('express');
const { google } = require('googleapis');
const jwt = require("jsonwebtoken");
const { OAuth2Client, UserRefreshClient } = google.auth;
const cors = require('cors');
const { getUser, updateUser, createUser, updateMeetup, db } = require('../db');
const { User } = require('../types/dist/types/index.js/types/index');


const app = express();
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL }));
app.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    'postmessage'
);


async function refreshAccessToken(userID, refreshToken) {
    const user = new UserRefreshClient(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        refreshToken,
    );

    const { credentials } = await user.refreshAccessToken(); // obtain new tokens

    await updateUser(
        userID,
        { $set: { "googleAccount": credentials } }
    );

    return credentials;
}



app.post('/auth/google', async (req, res) => {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    // Get user info from tokens
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const { data } = await oauth2.userinfo.get();

    if (req.body.inviteEmail && req.body.inviteEmail !== data.email) {
        return res.status(401).json({error: `Please use ${req.body.inviteEmail} to signup and accept this invite`});
    }
    if (req.body.integrationEmail && req.body.integrationEmail !== data.email) {
        return res.status(401).json({error: `Please use ${req.body.integrationEmail} to connect your google account`});
    }
    // Check if user exists in database
    // If user exists, update tokens
    // If user does not exist, create user with tokens
    const user = await getUser({email: data.email});
    if (user) {
        if (!user.verified){
            return res.status(401).json({error: "Please verify your email to use google to login"});
        }
        await updateUser(user._id,
            {$set:
                {"googleAccount":
                        {
                            "access_token": tokens.access_token,
                            "refresh_token": tokens.refresh_token,
                            "scope": tokens.scope,
                            "token_type": tokens.token_type,
                            "id_token": tokens.id_token,
                            "expiry_date": tokens.expiry_date,
                        }
                }
            }
            );

        const token = jwt.sign({ userID: user._id, type: 'user' }, process.env.JWT_SECRET, {
            expiresIn: '100m',
        });

        return res.json({token});
    } else {
        // Create user with tokens
        const newUser = new User({
            email: data.email,
            username: data.name,
            password: "",
            avatar: data.picture,
            googleAccount: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                scope: tokens.scope,
                token_type: tokens.token_type,
                id_token: tokens.id_token,
                expiry_date: tokens.expiry_date,
            },
            verified: true,
        });

        // TODO: Find all meetups where the user is invited and create notifications

        const meetupCollection = db.collection('meetups');
        const meetups = await meetupCollection.find({invited: newUser.email}).toArray();

        for (const meetup of meetups) {
            // TODO: Create notification
            await updateMeetup(meetup._id, {$pull: {invited: newUser.email}});
            await updateMeetup(meetup._id, {$push: {invited: newUser._id}});
        }

        await createUser(newUser);
        const token = jwt.sign({ userID: newUser._id, type: 'user' }, process.env.JWT_SECRET, {
            expiresIn: '100m',
        });
        return res.json({token: token, id: newUser._id});
    }
});

/*
app.post('/revoke', async (req, res) => {
    return;
});
*/

app.post('/user', async (req, res) => {
    const {tokens, userID} = req.body;

    if (!tokens || !userID) {
        return res.status(400).json({message: "Invalid request"});
    }

    const decodedToken = jwt.decode(tokens.id_token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTimestamp) {
        const credentials = await refreshAccessToken(userID, tokens.refresh_token);
        oAuth2Client.setCredentials(credentials);
    } else {
        oAuth2Client.setCredentials(tokens);
    }

    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });

    try {
        const { data } = await oauth2.userinfo.get();
        return res.json(data);

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // The access token has been revoked by the user
            // Remove the Google connection here
            await updateUser(
                userID,
                { $set: { googleAccount: null } }
            );
            return res.status(401).json({message: "The user has revoked access."});
        }
    }
});

app.post('/google/createEvent', async (req, res) => {

    const {tokens, userID, meetup} = req.body;
    if (!tokens || !userID || !meetup) {
        return res.status(400).json({message: "Invalid request"});
    }

    const decodedToken = jwt.decode(tokens.id_token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTimestamp) {
        const credentials = await refreshAccessToken(userID, tokens.refresh_token);
        oAuth2Client.setCredentials(credentials);
    } else {
        oAuth2Client.setCredentials(tokens);
    }

    const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
    const event = {
        summary: meetup.title,
        location: meetup.location,
        description: meetup.description,
        start: {
            dateTime: meetup.date,
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: meetup.date,
            timeZone: 'America/Los_Angeles',
        },
        attendees: meetup.invited.map(email => ({email})),
        reminders: {
            useDefault: false,
            overrides: [
                {method: 'email', minutes: 24 * 60},
                {method: 'popup', minutes: 10},
            ],
        },
    };



    await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    }, (err, data) => {
        if (err) {
            console.error(err);
            return res.json(err);
        }
        return res.json(data);
    });
});


app.listen(3002, () => console.log(`server is running`));