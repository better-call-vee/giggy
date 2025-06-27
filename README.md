GIGGY - A Full-Stack Freelance Marketplace✨ Key FeaturesGIGGY is packed with features designed for a fluid and interactive user journey.🔐 Secure User Authentication: Full sign-up, login (including Google Sign-In), and session management handled by Firebase, ensuring user data is safe.📊 Dynamic User Dashboard: A personalized hub for authenticated users, featuring:At-a-Glance Stats: Visually appealing cards displaying key metrics like tasks created and bids placed.Recent Activity: A real-time list of recent bids, linking directly to the tasks.Sleek Layout: A modern two-column layout with dedicated navigation.📝 Full Task Management (CRUD): Users can create, view, update, and delete tasks they've posted.💸 Interactive Bidding System:Users can place bids on tasks posted by others.Built-in logic prevents users from bidding on their own tasks or placing duplicate bids.🎨 Stunning & Responsive UI:Built with Tailwind CSS for a utility-first, fully responsive design.Light & Dark Mode: A theme-toggle that persists across sessions, adapting all components for user comfort.Engaging Micro-interactions: Subtle animations, hover effects, and a floating navbar create a modern, polished feel.🔍 Advanced Sorting & Filtering: The "Browse Tasks" page allows users to sort all open tasks by budget (ascending/descending) and visually distinguishes expired tasks.🛠️ Tech Stack & ArchitectureThe project is built on a modern MERN-like stack, with each piece carefully chosen for its role.ArchitectureGIGGY uses a classic client-server model. The React frontend is a pure Single-Page Application (SPA) deployed statically on Vercel. It communicates via a REST API with the Node.js/Express backend, which runs as a serverless function, also on Vercel, for scalability and efficiency. MongoDB Atlas serves as the cloud-hosted NoSQL database.FrontendTechnologyVersionDescriptionReact^19.1.0The core UI library for building components.Vite^6.3.5Next-generation frontend tooling for a blazing-fast dev experience.React Router^7.6.0For client-side routing and navigation.Tailwind CSS^4.1.7A utility-first CSS framework for rapid and custom UI design.Firebase^11.7.3Handles all user authentication and session management.React Icons^5.5.0Provides a vast library of high-quality SVG icons.SweetAlert2^0.5.2For creating beautiful, responsive, and accessible alert modals.BackendTechnologyVersionDescriptionNode.jsv20.xJavaScript runtime for the server.Express^5.1.0Fast, unopinionated, minimalist web framework for Node.js.MongoDB(Driver)The database driver for interacting with our NoSQL database.CORS^2.8.5Middleware to enable Cross-Origin Resource Sharing.Dotenv^16.5.0Manages environment variables for configuration and secrets.Serverless-Http^3.2.0Allows an existing Express app to run in a serverless environment.🚀 Getting StartedTo get a local copy up and running, please follow these steps.PrerequisitesNode.js (v18 or later) and npm installed.A free MongoDB Atlas account.A free Firebase project with Email/Password and Google sign-in methods enabled.1. Set Up the Backend (giggy-server)# Clone the server repository
git clone httpss://[github.com/your-username/giggy-server.git](https://github.com/your-username/giggy-server.git)
cd giggy-server

# Install dependencies
npm install

# Create an environment file
touch .env
Now, open the .env file and add your secret credentials. This file is ignored by Git to keep your keys safe..env# Your MongoDB connection string from Atlas
DB_URI="mongodb+srv://<USER>:<PASSWORD>@cluster.mongodb.net/yourDbName?retryWrites=true&w=majority"

# You can name your user and pass anything, this is for MongoDB connection string
DB_USER="your_db_user"
DB_PASS="your_db_password"
2. Set Up the Frontend (giggy-client)# In a new terminal, clone the client repository
git clone httpss://[github.com/your-username/giggy-client.git](https://github.com/your-username/giggy-client.git)
cd giggy-client

# Install dependencies
npm install

# Create the environment file for Firebase keys
touch .env.local
Now, open .env.local and add your Firebase project's configuration keys. You can find these in your Firebase project settings..env.local# These keys are safe to expose on the client-side
VITE_APIKEY="YOUR_FIREBASE_API_KEY"
VITE_AUTHDOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_PROJECTID="YOUR_FIREBASE_PROJECT_ID"
VITE_STORAGEBUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_MESSAGINGSENDERID="YOUR_FIREBASE_SENDER_ID"
VITE_APPID="YOUR_FIREBASE_APP_ID"
3. Run the ApplicationStart the backend server by running npm start or node index.js in the giggy-server directory.Start the frontend development server by running npm run dev in the giggy-client directory.The application should now be live on http://localhost:5173 (or your configured Vite port)!📞 ContactTanvee Faiyaz - LinkedIn - tanveefaiyaz@gmail.comProject Link: httpss://github.com/tanveefaiyaz/giggy-client
