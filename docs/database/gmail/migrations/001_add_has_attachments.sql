-- Add has_attachments column to emails table
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS has_attachments boolean DEFAULT false;

-- Update existing records
UPDATE emails e
SET has_attachments = EXISTS (
    SELECT 1
    FROM email_attachments a
    WHERE a.email_id = e.id
); 