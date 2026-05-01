-- Relocate.biz Platform Safety & Enforcement Migration (MySQL/Supabase Compatibility)

-- 1. Edge Case Events
CREATE TABLE IF NOT EXISTS edge_case_events (
    id CHAR(36) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    actor_id VARCHAR(128) NOT NULL,
    risk_score TINYINT UNSIGNED DEFAULT 0,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_type (type)
);

-- 2. Enforcement Actions
CREATE TABLE IF NOT EXISTS enforcement_actions (
    id CHAR(36) PRIMARY KEY,
    event_id CHAR(36),
    action_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    automated BOOLEAN DEFAULT TRUE,
    applied_by VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES edge_case_events(id),
    INDEX idx_target (target_id),
    INDEX idx_action (action_type)
);

-- 3. Dispute Cases
CREATE TABLE IF NOT EXISTS dispute_cases (
    id CHAR(36) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    raised_by VARCHAR(128) NOT NULL,
    assigned_to VARCHAR(128),
    evidence_urls JSON,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_raised (raised_by)
);

-- 4. Blacklist Registry (Identity & Device)
CREATE TABLE IF NOT EXISTS blacklist_registry (
    id CHAR(36) PRIMARY KEY,
    identity_value VARCHAR(255) UNIQUE NOT NULL, -- e.g. Aadhaar number, Email, Phone
    identity_type ENUM('AADHAAR', 'EMAIL', 'PHONE', 'DEVICE_ID') NOT NULL,
    reason TEXT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    banned_by VARCHAR(128) NOT NULL,
    INDEX idx_identity (identity_value)
);

-- 5. Property Price History (Rent Locking Enforcement)
CREATE TABLE IF NOT EXISTS property_price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    old_price DECIMAL(15, 2),
    new_price DECIMAL(15, 2) NOT NULL,
    changed_by VARCHAR(128) NOT NULL,
    change_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_property (property_id)
);

-- 6. System Audit Logs (Forensic Grade)
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(128) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    before_value JSON,
    after_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_actor (actor_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action)
);

-- 7. Fraud Risk Scores
CREATE TABLE IF NOT EXISTS fraud_risk_scores (
    user_id VARCHAR(128) PRIMARY KEY,
    risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    violation_count INT UNSIGNED DEFAULT 0,
    last_flagged_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_risk (risk_level)
);
