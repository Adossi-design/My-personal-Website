-- Add the personal-life section used by the broader digital-home layout.
INSERT INTO "ContentBlock" ("id", "key", "label", "value", "type", "group", "sortOrder", "defaultValue", "updatedAt")
SELECT
  'c' || substring(md5(seeded.key), 1, 24),
  seeded.key,
  seeded.label,
  seeded.value,
  seeded.type::"BlockType",
  seeded.group_name,
  seeded.sort_order,
  seeded.value,
  CURRENT_TIMESTAMP
FROM (VALUES
  ('personal.eyebrow', 'Personal section eyebrow', 'Beyond the code', 'TEXT', 'personal', 0),
  ('personal.title', 'Personal section heading', 'Community, entrepreneurship, and the person behind the work', 'TEXT', 'personal', 1),
  ('personal.subtitle', 'Personal section introduction', 'Technology is only one part of my story. Leadership, business, sport, creativity, and helping other students have also shaped how I work and who I want to become.', 'TEXTAREA', 'personal', 2)
) AS seeded(key, label, value, type, group_name, sort_order)
ON CONFLICT ("key") DO UPDATE SET
  "label" = EXCLUDED."label",
  "value" = EXCLUDED."value",
  "type" = EXCLUDED."type",
  "group" = EXCLUDED."group",
  "sortOrder" = EXCLUDED."sortOrder",
  "defaultValue" = EXCLUDED."defaultValue",
  "updatedAt" = CURRENT_TIMESTAMP;
