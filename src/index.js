import express from 'express';
import path from 'path';
import LogInCollection from './mongo.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up paths
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const templatePath = path.join(__dirname, '../template');
const publicPath = path.join(__dirname, '../public');

// Set Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Serve static files from the public directory
app.use(express.static(publicPath));

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await LogInCollection.findOne({ name });

        if (existingUser) {
            return res.send("User details already exist");
        }

        await LogInCollection.insertOne({ name, password });
        res.status(201).render("home", { naming: name });
    } catch (error) {
        console.error(error);
        res.send("Error while signing up");
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await LogInCollection.findOne({ name });

        if (user && user.password === password) {
            res.status(201).render("home", { naming: name });
        } else {
            res.send("Incorrect username or password");
        }
    } catch (error) {
        console.error(error);
        res.send("Error while logging in");
    }
});

// Start the server
const port = 4001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
