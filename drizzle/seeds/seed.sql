-- Demo user (no password — auth-managed; used for local dev/demo only)
INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES
    ('demo-user-1', 'Demo User', 'demo@example.com', 1,
     strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Categories
INSERT INTO category (displayId, userId, name, description, createdAt, updatedAt) VALUES
    ('cat-1', 'demo-user-1', 'Work',     'Work-related tasks and projects', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
    ('cat-2', 'demo-user-1', 'Personal', 'Personal errands and goals',      strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
    ('cat-3', 'demo-user-1', 'Health',   'Health and wellness activities',   strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Activities
INSERT INTO activity (displayId, userId, categoryId, name, description, duration, createdAt, updatedAt) VALUES
    ('act-1', 'demo-user-1', 1, 'Ship v1 feature',    'Focus on core flow only',  '3 hours',  strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
    ('act-2', 'demo-user-1', 1, 'Review PR feedback',  'Address review comments',  '30 min',   strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
    ('act-3', 'demo-user-1', 2, 'Call family',         'Weekly catch-up call',     '30 min',   strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
    ('act-4', 'demo-user-1', 3, 'Morning walk',        '30 minutes around park',   '30 min',   strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Suggestion history
INSERT INTO suggestionHistory (displayId, userId, activityId, userInput, suggestionOutput, createdAt) VALUES
    ('sug-1', 'demo-user-1', 1,
     'Work task, need to focus',
     'Break the task into small steps and tackle one at a time.',
     strftime('%s', 'now') * 1000);
