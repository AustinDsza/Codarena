-- Add missing columns to contests table for create contest functionality
ALTER TABLE contests ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20);
ALTER TABLE contests ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS judging VARCHAR(20) DEFAULT 'auto';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS winner_criteria VARCHAR(20) DEFAULT 'timing';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS number_of_winners INTEGER DEFAULT 1;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS prize_structure VARCHAR(20) DEFAULT 'winner-takes-all';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS new_user_discount INTEGER DEFAULT 0;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS battle_mode JSONB DEFAULT '{"enabled": false, "type": "none"}';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS enable_proctoring BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS copy_paste_tracking BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS tab_switch_detection BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS image_proctoring BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS multi_monitor_detection BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS secure_mode BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS plagiarism_detection BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS coding_languages TEXT[] DEFAULT '{}';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS allowed_submissions TEXT[] DEFAULT '{}';
ALTER TABLE contests ADD COLUMN IF NOT EXISTS evaluation_criteria TEXT;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS time_per_question INTEGER DEFAULT 60;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS randomize_questions BOOLEAN DEFAULT false;
ALTER TABLE contests ADD COLUMN IF NOT EXISTS show_results BOOLEAN DEFAULT true;

-- Add missing columns to problems table
ALTER TABLE problems ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'dsa';
ALTER TABLE problems ADD COLUMN IF NOT EXISTS options TEXT[] DEFAULT '{}';
ALTER TABLE problems ADD COLUMN IF NOT EXISTS correct_answer INTEGER DEFAULT 0;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';
ALTER TABLE problems ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';
ALTER TABLE problems ADD COLUMN IF NOT EXISTS evaluation_criteria TEXT;
