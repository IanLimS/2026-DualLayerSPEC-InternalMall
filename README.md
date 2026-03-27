# Internal welfare mall

Based on Vue 3 and Express.js enterprise internal welfare mall system。

## Project structure

```
InternalEnterpriseMall/
├── backend/                # Backend services
│   ├── src/               # source code
│   ├── package.json       # Depend on configuration
│   ├── server.js          # Entry file
│   └── .env               # environment variables
├── frontend/              # Front-end application
│   ├── src/               # source code
│   ├── package.json       # Depend on configuration
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # HTML template
├── spec/                  # Project Specification Document
│   ├── Me2AI/             # User requirements document
│   └── AI2AI/             # Architecture documentation maintained by AI
├── start-services.bat      # Quick start service script
├── preview-frontend.bat    # Front-end preview script
├── stop-services.bat       # Stop service script
└── README.md              # Project Description
```

## quick start

### Method 1：Use batch script（recommend）

#### Start all services
Double click to run `start-services.bat` document，The script will：
1. Check and stop processes that may be occupying ports
2. Start backend service（port 3001）
3. Start front-end service（Port 5173）
4. Automatically open the browser to access the front-end application

#### Preview frontend only
Double click to run `preview-frontend.bat` document，The script will：
1. Check service status
2. if needed，Start backend service
3. Start front-end service
4. Open the browser to access the front-end application

#### Stop all services
Double click to run `stop-services.bat` document，The script will：
1. Stop the backend service process
2. Stop the front-end service process

### Method 2：Manual start

#### Backend startup
```bash
# Enter the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend service will be in `http://localhost:3001` start up。

#### Front end startup
```bash
# Enter the front-end directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The front-end application will be `http://localhost:5173` start up。

## Connectivity test

1. Open browser to visit `http://localhost:5173`
2. Click"Service connectivity testing"button
3. In the connectivity test page，The following tests can be performed：
   - Basic connectivity test
   - Database connectivity test
   - User login test
   - User interface testing
   - Administrator interface test

## Test account

The system has preset the following test accounts：

### Ordinary user account
- username: `user1`，password: `password1`，integral: 100
- username: `user2`，password: `password2`，integral: 200
- username: `user3`，password: `password3`，integral: 150

### Administrator account
- username: `admin`，password: `admin123`，Role: administrator

## Current functional status

- ✅ Back-end basic framework construction
- ✅ Database initialization and table structure creation
- ✅ User authentication and JWT tokens
- ✅ Basic API interface implementation
- ✅ Front-end basic framework construction
- ✅ Connectivity test page
- ✅ quick start script
- ⏳ Complete user function implementation
- ⏳ Complete administrator function implementation
- ⏳ Product management function
- ⏳ Order management function
- ⏳ Shopping cart function

## technology stack

### rear end
- Node.js
- Express.js
- SQLite3
- JWT authentication
- Bcrypt password encryption

### front end
- Vue 3
- Element Plus UI component library
- Vue Router
- Pinia state management
- Axios HTTP client
- Vite build tools

## API documentation

Please refer to the detailed API documentation `spec/AI2AI/Protocols and Data.md`

## Project specifications

The project adopts a two-layer Spec-driven development approach：

1. **Me2AI**: User requirements and technical constraints documentation，Maintained by humans
2. **AI2AI**: Architecture and implementation status documentation，Maintained by AI

All specification documents are stored in `./spec` under folder。