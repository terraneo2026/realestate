const admin = require('firebase-admin');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// --- CONFIGURATION ---
const FIREBASE_PROJECT_ID = 'relocatebiz-ff841';
const STORAGE_BUCKET = `${FIREBASE_PROJECT_ID}.firebasestorage.app`;
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const LARAVEL_PUBLIC_PATH = path.join(__dirname, '..', 'admin.relocate.biz', 'admin.relocate.biz', 'public');

// --- INITIALIZATION ---
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Error: ${SERVICE_ACCOUNT_PATH} not found.`);
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function migrate() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'relowicy_appapp',
      password: process.env.DB_PASSWORD || 'relowicy_appapp',
      database: process.env.DB_NAME || 'relowicy_appapp',
      connectTimeout: 10000
    });
    console.log('✅ Connected to MySQL');
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    console.log('\nTIP: Ensure your MySQL server is running and accessible at 127.0.0.1:3306');
    console.log('If you are running this in a restricted environment, you may need to run it locally.');
    process.exit(1);
  }

  // --- HELPERS ---

  async function uploadFile(localRelativePath, destinationPath) {
    const fullLocalPath = path.join(LARAVEL_PUBLIC_PATH, localRelativePath);
    if (!fs.existsSync(fullLocalPath)) return null;

    try {
      const [file] = await bucket.upload(fullLocalPath, {
        destination: destinationPath,
        public: true,
        metadata: { cacheControl: 'public, max-age=31536000' },
      });
      return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    } catch (error) {
      console.error(`  ⚠️ Upload failed (${localRelativePath}):`, error.message);
      return null;
    }
  }

  async function batchUpload(collectionName, data, idField = 'id') {
    if (!data.length) return;
    console.log(`🚀 Uploading ${data.length} items to "${collectionName}"...`);
    
    const BATCH_SIZE = 500;
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = data.slice(i, i + BATCH_SIZE);
      
      chunk.forEach(item => {
        const docId = item[idField]?.toString() || db.collection(collectionName).doc().id;
        const docRef = db.collection(collectionName).doc(docId);
        // Remove helper fields before saving to Firestore
        const { _temp, ...cleanItem } = item;
        batch.set(docRef, cleanItem);
      });
      
      await batch.commit();
      console.log(`  ✅ Chunk ${i / BATCH_SIZE + 1} uploaded`);
    }
  }

  try {
    // 1. SETTINGS
    console.log('\n--- ⚙️ Migrating Settings ---');
    const [settings] = await connection.execute('SELECT * FROM settings');
    const mainSettings = {};
    for (const s of settings) {
      let value = s.data;
      if (['web_logo', 'web_favicon', 'web_placeholder_logo', 'web_footer_logo', 'company_logo'].includes(s.type)) {
        value = await uploadFile(path.join('images', 'logo', s.data), `settings/${s.data}`) || s.data;
      }
      mainSettings[s.type] = value;
    }
    // Map to fields expected by Next.js Admin
    mainSettings.system_name = mainSettings.company_name || 'Relocate';
    mainSettings.system_color = mainSettings.system_color || '#087C7C';
    await db.collection('settings').doc('main').set(mainSettings);
    console.log('✅ Settings migrated to settings/main');

    // 2. CATEGORIES
    console.log('\n--- 📁 Migrating Categories ---');
    const [categories] = await connection.execute('SELECT * FROM categories');
    for (const cat of categories) {
      if (cat.image) {
        cat.image = await uploadFile(path.join('images', 'category', cat.image), `categories/${cat.image}`) || cat.image;
      }
    }
    await batchUpload('categories', categories);

    // 3. PARAMETERS & FACILITIES (for lookup)
    const [parameters] = await connection.execute('SELECT * FROM parameters');
    for (const p of parameters) {
      if (p.image) p._img_url = await uploadFile(path.join('images', 'parameter_img', p.image), `parameters/${p.image}`);
    }
    const paramLookup = parameters.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

    const [facilities] = await connection.execute('SELECT * FROM outdoor_facilities');
    for (const f of facilities) {
      if (f.image) f._img_url = await uploadFile(path.join('images', 'facility_img', f.image), `facilities/${f.image}`);
    }
    const facilityLookup = facilities.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});

    // 4. PROPERTIES
    console.log('\n--- 🏠 Migrating Properties ---');
    const [props] = await connection.execute('SELECT * FROM propertys');
    const [pImages] = await connection.execute('SELECT * FROM property_images');
    const [pDocs] = await connection.execute('SELECT * FROM properties_documents');
    const [pParams] = await connection.execute('SELECT * FROM assign_parameters WHERE modal_type = "App\\\\Models\\\\Property"');
    const [pFacs] = await connection.execute('SELECT * FROM assigned_outdoor_facilities');

    const denormalizedProps = [];
    for (const p of props) {
      console.log(`  Processing: ${p.title}...`);
      
      // Main Image
      p.image = await uploadFile(path.join('images', 'property_title_img', p.title_image), `properties/${p.id}/main/${p.title_image}`) || p.title_image;
      
      // Gallery
      const gallery = [];
      const myImages = pImages.filter(img => img.propertys_id === p.id);
      for (const img of myImages) {
        const url = await uploadFile(path.join('images', 'property_gallery_img', p.id.toString(), img.image), `properties/${p.id}/gallery/${img.image}`);
        gallery.push({ ...img, url });
      }

      // Documents
      const docs = [];
      const myDocs = pDocs.filter(d => d.property_id === p.id);
      for (const d of myDocs) {
        const url = await uploadFile(path.join('images', 'property_documents', d.file), `properties/${p.id}/docs/${d.file}`);
        docs.push({ ...d, url });
      }

      // Parameters & Facilities
      const myParams = pParams.filter(param => param.modal_id === p.id).map(pp => ({
        ...pp,
        name: paramLookup[pp.parameter_id]?.name,
        image: paramLookup[pp.parameter_id]?._img_url
      }));

      const myFacs = pFacs.filter(f => f.property_id === p.id).map(ff => ({
        ...ff,
        name: facilityLookup[ff.facility_id]?.name,
        image: facilityLookup[ff.facility_id]?._img_url
      }));

      denormalizedProps.push({
        ...p,
        gallery,
        documents: docs,
        parameters: myParams,
        facilities: myFacs,
        price: parseFloat(p.price) || 0,
        created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString()
      });
    }
    await batchUpload('properties', denormalizedProps);

    // 5. SLIDERS & ARTICLES
    console.log('\n--- 🖼️ Migrating Sliders & Articles ---');
    const [sliders] = await connection.execute('SELECT * FROM sliders');
    for (const s of sliders) {
      if (s.image) {
        s.image = await uploadFile(path.join('images', 'slider_img', s.image), `sliders/${s.image}`) || s.image;
      }
    }
    await batchUpload('sliders', sliders);

    const [articles] = await connection.execute('SELECT * FROM articles');
    for (const a of articles) {
      if (a.image) {
        a.image = await uploadFile(path.join('images', 'article_img', a.image), `articles/${a.image}`) || a.image;
      }
    }
    await batchUpload('articles', articles);

    // 6. USERS & CUSTOMERS
    console.log('\n--- 👥 Migrating Users ---');
    const [admins] = await connection.execute('SELECT * FROM users');
    const [customers] = await connection.execute('SELECT * FROM customers');
    const mergedUsers = [
      ...admins.map(a => ({ ...a, role: 'admin', firestore_id: `admin_${a.id}` })),
      ...customers.map(c => ({ ...c, role: 'customer', firestore_id: `customer_${c.id}` }))
    ];
    await batchUpload('users', mergedUsers, 'firestore_id');

    console.log('\n✨ MIGRATION COMPLETED SUCCESSFULLY! ✨');
  } catch (error) {
    console.error('\n❌ Migration Failed:', error);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
