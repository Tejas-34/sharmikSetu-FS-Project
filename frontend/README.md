# WorkSite Portal

A React frontend connected to the Django backend in `../WorkSite Backend/worksite`.

## Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (3.11+ recommended)

## Project Structure
- `src/` - React Frontend
- `../WorkSite Backend/worksite` - Django REST backend

## 1. Start the Python Backend
```bash
cd "../WorkSite Backend/worksite"
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs on `http://localhost:8000/api/`.

## 2. Run the Frontend
```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## 3. Usage
- Register a new account or log in with existing Django users.
- Employers can post jobs and manage applicants.
- Workers can browse and apply.
- Admins can review users and jobs.
