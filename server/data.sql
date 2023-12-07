CREATE DATABASE KanbanApp;

CREATE TABLE todos (
    todo_id VARCHAR(255) PRIMARY KEY,
    list_id VARCHAR(255),
    user_email VARCHAR(255),
    title VARCHAR(30),
    date VARCHAR(255),
    completed BOOLEAN NOT NULL,
    important BOOLEAN NOT NULL
);
ALTER TABLE todos 
    ADD CONSTRAINT fk_todoLists_todos FOREIGN KEY (list_id)
        REFERENCES todoLists (list_id)
        ON DELETE CASCADE


CREATE TABLE todolists (
    list_id VARCHAR(255) PRIMARY KEY,
    list_title VARCHAR(30),
    user_email VARCHAR(255),
    date VARCHAR(255)
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    hashed_password VARCHAR(255)
);

CREATE TABLE task (
    task_id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30),
    date VARCHAR(255),
    completed BOOLEAN NOT NULL,   
);

SELECT todo_id, todos.list_id, todos.user_email, title, todos.date, completed, myday, list_title
FROM todos
INNER JOIN todolists
on todolists.list_id = todos.list_id
UNION ALL
SELECT todo_id, list_id, user_email, title, date, completed, myday, list_title
FROM task
WHERE (user_email = 'test@gmail.com' AND myday=TRUE);