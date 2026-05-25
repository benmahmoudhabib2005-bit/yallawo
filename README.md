# YallaWork PHP + MySQL

## Installation
1. Copy this folder into your local server folder:
   - XAMPP: `htdocs/yallawork`
   - WAMP: `www/yallawork`

2. Open phpMyAdmin and import `database.sql`.

3. Edit `php/config.php` if your MySQL username/password differ from the defaults (root / empty password).

4. Make sure the `uploads/cv/` folder is writable by Apache:
   - Windows (XAMPP): usually fine by default
   - Linux: `chmod 755 uploads/cv/`

5. Start Apache and MySQL.

6. Open: `http://localhost/yallawork/`

## What was fixed
- **php/config.php** — PDO connection + shared helpers (jsonResponse, post)
- **php/register.php** — validates all fields, checks duplicate email, hashes password with bcrypt
- **php/login.php** — verifies password with password_verify(), starts PHP session
- **php/apply.php** — validates fields, checks MIME type (PDF only), saves CV to uploads/cv/ with unique filename, stores path in DB
- **php/search_offers.php** — parameterised keyword + location search, returns jours_passes
- **php/send_message.php** — requires login session, saves message to DB

## File structure
yallawork/
├── index.html
├── styles.css
├── script.js
├── database.sql
├── README.md
├── uploads/
│   └── cv/          ← uploaded CVs saved here (writable)
└── php/
    ├── config.php
    ├── register.php
    ├── login.php
    ├── apply.php
    ├── search_offers.php
    └── send_message.php
