<?php
/**
 * Task Manager - PHP/MySQL REST API Bridge for cPanel & Local Hosting
 * Auto-creates the database schemas inside your phpMyAdmin on first run.
 * 
 * Instructions:
 * 1. Upload this file (api.php) to your cPanel hosting directory alongside built index.html / assets.
 * 2. Edit the database credentials below to match your MySQL database in phpMyAdmin.
 * 3. Open your browser and navigate to this URL to test connectivity!
 */

// Enable Error Reporting for diagnostics (disable in strict production if desired)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS Headers - Allows local testing & cross-origin hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ----------------- DATABASE CONFIGURATION -----------------
// Change these settings to match your cPanel MySQL Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');             // Your MySQL Username (e.g. cpanel_dbuser)
define('DB_PASS', '');                 // Your MySQL Password (e.g. SeCrEt_PaSs_123)
define('DB_NAME', 'task_manager_db');  // Your MySQL Database Name (e.g. cpanel_dbname)
// -----------------------------------------------------------

function respondJSON($status, $dataOrMessage, $extra = []) {
    $response = array_merge([
        "status" => $status,
        "timestamp" => time()
    ], $extra);
    
    if ($status === "success") {
        if (is_array($dataOrMessage)) {
            $response = array_merge($response, $dataOrMessage);
        } else {
            $response["message"] = $dataOrMessage;
        }
    } else {
        $response["error"] = $dataOrMessage;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Establish Connection to MySQL Server
$conn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    respondJSON("error", "خطا در اتصال به سرور پایگاه‌داده: " . $conn->connect_error, [
        "hint" => "لطفاً فایل api.php را باز کرده و تنظیمات DB_USER، DB_PASS و DB_NAME را مطابق دیتابیس خود در cPanel ویرایش کنید."
    ]);
}

// Ensure the Database exists and select it
if (!$conn->select_db(DB_NAME)) {
    $db_name_safe = $conn->real_escape_string(DB_NAME);
    $create_db = $conn->query("CREATE DATABASE IF NOT EXISTS `$db_name_safe` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    if (!$create_db || !$conn->select_db(DB_NAME)) {
        respondJSON("error", "خطا در ایجاد یا مواجهه با دیتابیس: " . $conn->error);
    }
}

// Auto-Establish connection charset encoding
$conn->set_charset("utf8mb4");

// Create Tables if they do not exist
$tables_sql = [
    "users" => "CREATE TABLE IF NOT EXISTS `users` (
        `id` VARCHAR(50) PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `role` VARCHAR(100) NOT NULL,
        `initials` VARCHAR(10) NOT NULL,
        `avatarColor` VARCHAR(50) NOT NULL,
        `password` VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
    
    "tasks" => "CREATE TABLE IF NOT EXISTS `tasks` (
        `id` VARCHAR(50) PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT NULL,
        `category` VARCHAR(100) NULL,
        `status` VARCHAR(50) NOT NULL,
        `priority` VARCHAR(50) NOT NULL,
        `dueDate` VARCHAR(50) NULL,
        `progress` INT DEFAULT 0,
        `estimatedHours` FLOAT DEFAULT 0,
        `actualHours` FLOAT DEFAULT 0,
        `assignedUsers` TEXT NULL, -- JSON formatted array
        `authorId` VARCHAR(50) NULL,
        `chatMessages` TEXT NULL, -- JSON formatted array
        `attachments` TEXT NULL, -- JSON formatted array
        `alarms` TEXT NULL, -- JSON formatted array
        `createdAt` VARCHAR(50) NULL,
        `updatedAt` VARCHAR(50) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "notifications" => "CREATE TABLE IF NOT EXISTS `notifications` (
        `id` VARCHAR(50) PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `message` TEXT NOT NULL,
        `type` VARCHAR(50) NOT NULL,
        `time` VARCHAR(50) NOT NULL,
        `read_status` TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

foreach ($tables_sql as $name => $query) {
    if (!$conn->query($query)) {
        respondJSON("error", "خطا در ایجاد جدول $name: " . $conn->error);
    }
}

// Automatically add column `alarms` if users have an existing `tasks` table without it
$checkColumn = $conn->query("SHOW COLUMNS FROM `tasks` LIKE 'alarms'");
if ($checkColumn && $checkColumn->num_rows == 0) {
    $conn->query("ALTER TABLE `tasks` ADD COLUMN `alarms` TEXT NULL AFTER `attachments`;");
}

// Seed admin user on clean install so user can sign in
$userCheck = $conn->query("SELECT COUNT(*) as count FROM `users`")->fetch_assoc();
if ($userCheck['count'] == 0) {
    $stmt = $conn->prepare("INSERT INTO `users` (id, name, role, initials, avatarColor, password) VALUES (?, ?, ?, ?, ?, ?)");
    $seed_id = "user_admin";
    $seed_name = "سرپرست سیستم";
    $seed_role = "مدیر شیفت کالسنتر";
    $seed_initials = "سر";
    $seed_color = "bg-indigo-600";
    $seed_pass = "1234";
    $stmt->bind_param("ssssss", $seed_id, $seed_name, $seed_role, $seed_initials, $seed_color, $seed_pass);
    $stmt->execute();
    $stmt->close();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'status':
        respondJSON("success", "متصل به پایگاه‌داده MySQL", [
            "database" => DB_NAME,
            "host" => DB_HOST,
            "php_version" => phpversion()
        ]);
        break;

    case 'get_all':
        // Load all data
        $users = [];
        $res = $conn->query("SELECT * FROM `users`");
        while($row = $res->fetch_assoc()) {
            $users[] = $row;
        }

        $tasks = [];
        $res = $conn->query("SELECT * FROM `tasks`");
        while($row = $res->fetch_assoc()) {
            // Decode stored JSON lists back to PHP structures/arrays
            $row['assignedUsers'] = json_decode($row['assignedUsers'] ?: '[]', true);
            $row['chatMessages'] = json_decode($row['chatMessages'] ?: '[]', true);
            $row['attachments'] = json_decode($row['attachments'] ?: '[]', true);
            $row['alarms'] = json_decode(isset($row['alarms']) ? ($row['alarms'] ?: '[]') : '[]', true);
            $row['progress'] = (int)$row['progress'];
            $row['estimatedHours'] = (float)$row['estimatedHours'];
            $row['actualHours'] = (float)$row['actualHours'];
            $tasks[] = $row;
        }

        $notifications = [];
        $res = $conn->query("SELECT * FROM `notifications`");
        while($row = $res->fetch_assoc()) {
            $row['read'] = (bool)$row['read_status'];
            unset($row['read_status']);
            $row['createdAt'] = $row['time']; // Map MySQL 'time' back to 'createdAt' for TypeScript app
            $notifications[] = $row;
        }

        respondJSON("success", [
            "users" => $users,
            "tasks" => $tasks,
            "notifications" => $notifications
        ]);
        break;

    case 'sync_all':
        // Bulk save/overwrite current client status as real-time master database sync
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respondJSON("error", "داده ارسالی نامعتبر است.");
        }

        $conn->begin_transaction();
        try {
            // Sync users if details provided
            if (isset($input['users']) && is_array($input['users'])) {
                // Remove existing ones that aren't in the incoming list
                if (!empty($input['users'])) {
                    $uIds = array_map(function($u) use ($conn) { return "'" . $conn->real_escape_string($u['id']) . "'"; }, $input['users']);
                    $conn->query("DELETE FROM `users` WHERE `id` NOT IN (" . implode(",", $uIds) . ")");
                }
                
                foreach ($input['users'] as $u) {
                    $stmt = $conn->prepare("INSERT INTO `users` (id, name, role, initials, avatarColor, password) VALUES (?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE name=?, role=?, initials=?, avatarColor=?, password=?");
                    $stmt->bind_param("sssssssssss", $u['id'], $u['name'], $u['role'], $u['initials'], $u['avatarColor'], $u['password'],
                        $u['name'], $u['role'], $u['initials'], $u['avatarColor'], $u['password']);
                    $stmt->execute();
                    $stmt->close();
                }
            }

            // Sync tasks if details provided
            if (isset($input['tasks']) && is_array($input['tasks'])) {
                // Clean up removed tasks (so they reflect board delete operations)
                if (empty($input['tasks'])) {
                    $conn->query("DELETE FROM `tasks`");
                } else {
                    $tIds = array_map(function($t) use ($conn) { return "'" . $conn->real_escape_string($t['id']) . "'"; }, $input['tasks']);
                    $conn->query("DELETE FROM `tasks` WHERE `id` NOT IN (" . implode(",", $tIds) . ")");
                }

                foreach ($input['tasks'] as $t) {
                    $assigned = json_encode($t['assignedUsers'] ?: [], JSON_UNESCAPED_UNICODE);
                    $chats = json_encode($t['chatMessages'] ?: [], JSON_UNESCAPED_UNICODE);
                    $attachments = json_encode($t['attachments'] ?: [], JSON_UNESCAPED_UNICODE);
                    $alarms = json_encode(isset($t['alarms']) ? $t['alarms'] : [], JSON_UNESCAPED_UNICODE);
                    
                    $stmt = $conn->prepare("INSERT INTO `tasks` (id, title, description, category, status, priority, dueDate, progress, estimatedHours, actualHours, assignedUsers, authorId, chatMessages, attachments, alarms, createdAt, updatedAt) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE title=?, description=?, category=?, status=?, priority=?, dueDate=?, progress=?, estimatedHours=?, actualHours=?, assignedUsers=?, authorId=?, chatMessages=?, attachments=?, alarms=?, createdAt=?, updatedAt=?");
                    
                    $stmt->bind_param("sssssssssssssssssssssssssssssssss", 
                        $t['id'], $t['title'], $t['description'], $t['category'], $t['status'], $t['priority'], $t['dueDate'], $t['progress'], $t['estimatedHours'], $t['actualHours'], $assigned, $t['authorId'], $chats, $attachments, $alarms, $t['createdAt'], $t['updatedAt'],
                        $t['title'], $t['description'], $t['category'], $t['status'], $t['priority'], $t['dueDate'], $t['progress'], $t['estimatedHours'], $t['actualHours'], $assigned, $t['authorId'], $chats, $attachments, $alarms, $t['createdAt'], $t['updatedAt']
                    );
                    $stmt->execute();
                    $stmt->close();
                }
            }

            // Sync notifications if details provided
            if (isset($input['notifications']) && is_array($input['notifications'])) {
                if (empty($input['notifications'])) {
                    $conn->query("DELETE FROM `notifications`");
                } else {
                    $nIds = array_map(function($n) use ($conn) { return "'" . $conn->real_escape_string($n['id']) . "'"; }, $input['notifications']);
                    $conn->query("DELETE FROM `notifications` WHERE `id` NOT IN (" . implode(",", $nIds) . ")");
                }

                foreach ($input['notifications'] as $n) {
                    $read_status = isset($n['read']) && $n['read'] ? 1 : 0;
                    $time = isset($n['createdAt']) ? $n['createdAt'] : (isset($n['time']) ? $n['time'] : '');
                    $stmt = $conn->prepare("INSERT INTO `notifications` (id, title, message, type, time, read_status) VALUES (?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE title=?, message=?, type=?, time=?, read_status=?");
                    $stmt->bind_param("sssssssssss", $n['id'], $n['title'], $n['message'], $n['type'], $time, $read_status,
                        $n['title'], $n['message'], $n['type'], $time, $read_status);
                    $stmt->execute();
                    $stmt->close();
                }
            }

            $conn->commit();
            respondJSON("success", "تمامی اطلاعات به صورت همزمان داخل دیتابیس MySQL هاست بازنویسی و سینک شد.");
        } catch (Exception $e) {
            $conn->rollback();
            respondJSON("error", "سیستم با خطای ذخیره مواجه شد: " . $e->getMessage());
        }
        break;

    default:
        respondJSON("error", "اکشن درخواستی یافت نشد.");
        break;
}

$conn->close();
?>
