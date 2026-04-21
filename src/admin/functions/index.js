const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));

/**
 * Proxy: /api/web-settings
 */
app.get('/web-settings', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('main').get();
        if (!doc.exists) return res.status(404).json({ error: true, message: "Settings not found" });
        res.json({ error: false, message: "Data Fetched Successfully", data: doc.data() });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/**
 * Proxy: /api/homepage-data
 */
app.get('/homepage-data', async (req, res) => {
    try {
        const doc = await db.collection('homepage').doc('main').get();
        if (!doc.exists) return res.status(404).json({ error: true, message: "Homepage data not found" });
        res.json({ error: false, message: "Data Fetched Successfully", data: doc.data() });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/**
 * Proxy: /api/get_categories
 */
app.get('/get_categories', async (req, res) => {
    try {
        const snapshot = await db.collection('categories').get();
        const categories = snapshot.docs.map(doc => doc.data());
        res.json({ error: false, message: "Data Fetched Successfully", data: categories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/**
 * Proxy: /api/get_property
 */
app.get('/get_property', async (req, res) => {
    try {
        let query = db.collection('properties');
        
        // Handle basic filters (category, type, etc.)
        if (req.query.category_id) query = query.where('category_id', '==', req.query.category_id);
        if (req.query.type) query = query.where('propery_type', '==', parseInt(req.query.type));
        
        const snapshot = await query.get();
        const properties = snapshot.docs.map(doc => doc.data());
        res.json({ error: false, message: "Data Fetched Successfully", data: properties });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);

/**
 * Trigger: On Property Created (Notification)
 */
exports.onPropertyCreated = functions.firestore
    .document('properties/{propertyId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const payload = {
            notification: {
                title: 'New Property Available!',
                body: `${newValue.title} is now listed. Check it out!`,
            },
            topic: 'global_data_sync'
        };
        return admin.messaging().send(payload);
    });
