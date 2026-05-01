-- Relocate.biz Staff Management Migration (MySQL Compatibility)

-- 1. Staff Profiles
CREATE TABLE IF NOT EXISTS staff_profiles (
    id CHAR(36) PRIMARY KEY,
    auth_user_id VARCHAR(128) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role ENUM('FIELD_VERIFICATION_STAFF', 'VISIT_ESCORT_STAFF', 'DISPUTE_RESOLUTION_STAFF', 'SUPPORT_STAFF') NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'on_leave') DEFAULT 'active',
    performance_score TINYINT UNSIGNED DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- 2. Staff Assignments
CREATE TABLE IF NOT EXISTS staff_assignments (
    id CHAR(36) PRIMARY KEY,
    staff_id CHAR(36) NOT NULL,
    property_id CHAR(36) NOT NULL,
    assignment_type ENUM('verification', 'visit_escort', 'dispute', 'support') NOT NULL,
    assigned_by VARCHAR(128) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'in_progress', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    deadline DATETIME,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    INDEX idx_property (property_id),
    INDEX idx_status (status),
    INDEX idx_assignment_type (assignment_type)
);

-- 3. Verification Reports
CREATE TABLE IF NOT EXISTS verification_reports (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    visit_time TIMESTAMP NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    report_notes TEXT,
    approval_status ENUM('approved', 'rejected', 'review_required'),
    media_urls JSON,
    document_status ENUM('verified', 'missing', 'fraudulent'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    INDEX idx_property (property_id)
);

-- 4. Visit Escort Logs
CREATE TABLE IF NOT EXISTS visit_escort_logs (
    id CHAR(36) PRIMARY KEY,
    visit_request_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    checkin_time TIMESTAMP NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    visit_status ENUM('scheduled', 'checked_in', 'completed', 'no_show', 'failed'),
    tenant_decision ENUM('interested', 'not_interested', 'pending'),
    report_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    INDEX idx_visit_request (visit_request_id)
);

-- 5. Support Tickets & Interactions
CREATE TABLE IF NOT EXISTS support_tickets (
    id CHAR(36) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    assigned_staff_id CHAR(36),
    category ENUM('payment', 'property', 'technical', 'fraud', 'other'),
    priority ENUM('low', 'medium', 'high', 'urgent'),
    status ENUM('open', 'in_progress', 'resolved', 'closed', 'escalated'),
    escalation_level TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_staff_id) REFERENCES staff_profiles(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS support_interactions (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    staff_id CHAR(36) NOT NULL,
    interaction_type VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id),
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id)
);

-- 6. Activity & Audit Logs
CREATE TABLE IF NOT EXISTS staff_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id CHAR(36) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(128),
    metadata JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    INDEX idx_staff (staff_id),
    INDEX idx_created_at (created_at)
);

-- 7. Performance Tracking
CREATE TABLE IF NOT EXISTS staff_performance (
    id CHAR(36) PRIMARY KEY,
    staff_id CHAR(36) UNIQUE NOT NULL,
    completed_tasks INT UNSIGNED DEFAULT 0,
    rejected_tasks INT UNSIGNED DEFAULT 0,
    escalation_count INT UNSIGNED DEFAULT 0,
    rating_score TINYINT UNSIGNED DEFAULT 100,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id)
);
