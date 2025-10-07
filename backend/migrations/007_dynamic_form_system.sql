-- Dynamic Form Builder System Migration
-- Creates tables for dynamic forms, fields, and submissions

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS form_fields CASCADE;
DROP TABLE IF EXISTS forms CASCADE;

-- Create forms table
CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    success_message TEXT DEFAULT 'Thank you for your submission!',
    notification_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create form_fields table
CREATE TABLE form_fields (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'file', 'tel', 'url', 'date')),
    placeholder VARCHAR(255),
    required BOOLEAN DEFAULT false,
    field_order INTEGER DEFAULT 0,
    options JSONB, -- For select, radio, checkbox options
    validation_rules JSONB, -- Custom validation rules
    default_value TEXT,
    help_text TEXT,
    max_length INTEGER,
    min_length INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(form_id, name) -- Prevent duplicate field names in same form
);

-- Create form_submissions table
CREATE TABLE form_submissions (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'processed', 'archived'))
);

-- Create indexes for better performance
CREATE INDEX idx_forms_slug ON forms(slug);
CREATE INDEX idx_forms_active ON forms(active);
CREATE INDEX idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX idx_form_fields_order ON form_fields(form_id, field_order);
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_form_submissions_date ON form_submissions(submitted_at);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);

-- Insert default contact form
INSERT INTO forms (name, slug, description, notification_email) VALUES 
('Contact Us', 'contact', 'Main contact form for general inquiries', 'contact@sevenboson.com');

-- Insert contact form fields
INSERT INTO form_fields (form_id, label, name, type, placeholder, required, field_order, validation_rules) VALUES
((SELECT id FROM forms WHERE slug = 'contact'), 'Full Name', 'fullName', 'text', 'Enter your full name', true, 1, '{"minLength": 2, "maxLength": 100}'),
((SELECT id FROM forms WHERE slug = 'contact'), 'Email Address', 'email', 'email', 'your.email@example.com', true, 2, '{"pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"}'),
((SELECT id FROM forms WHERE slug = 'contact'), 'Phone Number', 'phone', 'tel', '+1 (555) 123-4567', false, 3, '{"pattern": "^[\\+]?[(]?[0-9\\s\\-\\(\\)\\+]{10,}$"}'),
((SELECT id FROM forms WHERE slug = 'contact'), 'Company', 'company', 'text', 'Your company name', false, 4, '{"maxLength": 200}'),
((SELECT id FROM forms WHERE slug = 'contact'), 'Subject', 'subject', 'select', null, true, 5, '{"options": [{"value": "general", "label": "General Inquiry"}, {"value": "investment", "label": "Investment Opportunity"}, {"value": "partnership", "label": "Partnership"}, {"value": "media", "label": "Media Inquiry"}, {"value": "other", "label": "Other"}]}'),
((SELECT id FROM forms WHERE slug = 'contact'), 'Message', 'message', 'textarea', 'Please describe your inquiry...', true, 6, '{"minLength": 10, "maxLength": 2000}');

-- Insert default application form
INSERT INTO forms (name, slug, description, notification_email) VALUES 
('Investment Application', 'apply', 'Application form for investment opportunities', 'applications@sevenboson.com');

-- Insert application form fields
INSERT INTO form_fields (form_id, label, name, type, placeholder, required, field_order, validation_rules) VALUES
((SELECT id FROM forms WHERE slug = 'apply'), 'Full Name', 'fullName', 'text', 'Enter your full name', true, 1, '{"minLength": 2, "maxLength": 100}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Email Address', 'email', 'email', 'your.email@example.com', true, 2, '{"pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Phone Number', 'phone', 'tel', '+1 (555) 123-4567', true, 3, '{"pattern": "^[\\+]?[(]?[0-9\\s\\-\\(\\)\\+]{10,}$"}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Investment Interest', 'investmentType', 'select', null, true, 4, '{"options": [{"value": "private-equity", "label": "Private Equity"}, {"value": "venture-capital", "label": "Venture Capital"}, {"value": "real-estate", "label": "Real Estate"}, {"value": "hedge-fund", "label": "Hedge Fund"}, {"value": "other", "label": "Other"}]}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Investment Amount', 'investmentAmount', 'select', null, true, 5, '{"options": [{"value": "under-1m", "label": "Under $1M"}, {"value": "1m-5m", "label": "$1M - $5M"}, {"value": "5m-10m", "label": "$5M - $10M"}, {"value": "10m-25m", "label": "$10M - $25M"}, {"value": "over-25m", "label": "Over $25M"}]}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Investment Experience', 'experience', 'select', null, true, 6, '{"options": [{"value": "first-time", "label": "First-time Investor"}, {"value": "some", "label": "Some Experience"}, {"value": "experienced", "label": "Experienced Investor"}, {"value": "professional", "label": "Professional Investor"}]}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Accredited Investor', 'accreditedInvestor', 'radio', null, true, 7, '{"options": [{"value": "yes", "label": "Yes, I am an accredited investor"}, {"value": "no", "label": "No, I am not an accredited investor"}]}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Additional Information', 'additionalInfo', 'textarea', 'Please provide any additional information about your investment goals...', false, 8, '{"maxLength": 2000}'),
((SELECT id FROM forms WHERE slug = 'apply'), 'Upload Documents', 'documents', 'file', null, false, 9, '{"accept": ".pdf,.doc,.docx", "maxSize": "10MB"}');

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_fields_updated_at BEFORE UPDATE ON form_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for form with fields
CREATE OR REPLACE VIEW forms_with_fields AS
SELECT 
    f.id,
    f.name,
    f.slug,
    f.description,
    f.active,
    f.success_message,
    f.notification_email,
    f.created_at,
    f.updated_at,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', ff.id,
                'label', ff.label,
                'name', ff.name,
                'type', ff.type,
                'placeholder', ff.placeholder,
                'required', ff.required,
                'field_order', ff.field_order,
                'options', ff.options,
                'validation_rules', ff.validation_rules,
                'default_value', ff.default_value,
                'help_text', ff.help_text,
                'max_length', ff.max_length,
                'min_length', ff.min_length
            ) ORDER BY ff.field_order
        ) FILTER (WHERE ff.id IS NOT NULL), 
        '[]'::json
    ) AS fields
FROM forms f
LEFT JOIN form_fields ff ON f.id = ff.form_id
GROUP BY f.id, f.name, f.slug, f.description, f.active, f.success_message, f.notification_email, f.created_at, f.updated_at;

COMMENT ON TABLE forms IS 'Main forms configuration table';
COMMENT ON TABLE form_fields IS 'Dynamic form fields with validation rules';
COMMENT ON TABLE form_submissions IS 'Form submission data storage';
COMMENT ON VIEW forms_with_fields IS 'View combining forms with their fields for easy querying';