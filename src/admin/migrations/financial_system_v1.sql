-- Relocate.biz Financial & Fintech Migration (MySQL Compatibility)

-- 1. Wallets & Transactions
CREATE TABLE IF NOT EXISTS wallets (
    id CHAR(36) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    locked_balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id CHAR(36) PRIMARY KEY,
    wallet_id VARCHAR(128) NOT NULL,
    transaction_type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    reference_id VARCHAR(128),
    reference_type VARCHAR(50),
    status ENUM('pending', 'completed', 'failed', 'reversed') DEFAULT 'pending',
    reason TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(user_id),
    INDEX idx_reference (reference_id, reference_type)
);

-- 2. Escrow & Commissions
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id CHAR(36) PRIMARY KEY,
    booking_id VARCHAR(128) UNIQUE NOT NULL,
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    held_amount DECIMAL(15, 2) NOT NULL,
    released_amount DECIMAL(15, 2) DEFAULT 0.00,
    commission_deducted DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_booking (booking_id)
);

CREATE TABLE IF NOT EXISTS commission_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_type ENUM('direct', 'agent') NOT NULL,
    property_category VARCHAR(50),
    tenant_commission_type ENUM('percentage', 'fixed'),
    tenant_commission_value DECIMAL(10, 2),
    owner_commission_type ENUM('percentage', 'fixed'),
    owner_commission_value DECIMAL(10, 2),
    tax_percentage DECIMAL(5, 2) DEFAULT 18.00,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Manual Payment (Maker-Checker)
CREATE TABLE IF NOT EXISTS manual_payment_entries (
    id CHAR(36) PRIMARY KEY,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_reference VARCHAR(128) UNIQUE NOT NULL,
    transaction_type VARCHAR(50),
    property_deal_id VARCHAR(128),
    notes TEXT,
    proof_url TEXT,
    status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    created_by VARCHAR(128) NOT NULL,
    approved_by VARCHAR(128),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_deal (property_deal_id),
    INDEX idx_status (status)
);

-- 4. Immutable Financial Ledger
CREATE TABLE IF NOT EXISTS financial_ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(128) NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    debit_account VARCHAR(100) NOT NULL,
    credit_account VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('posted', 'reversed') DEFAULT 'posted',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transaction (transaction_id),
    INDEX idx_accounts (debit_account, credit_account)
);

-- 5. Audit Logs
CREATE TABLE IF NOT EXISTS payment_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    actor_id VARCHAR(128) NOT NULL,
    entity_id VARCHAR(128),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_actor (actor_id),
    INDEX idx_action (action_type)
);
