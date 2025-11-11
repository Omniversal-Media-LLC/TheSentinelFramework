// Sentinel Framework Login & Notifications

// Access codes (in production, these would be server-side)
const ACCESS_CODES = {
    'SENTINEL2025': 'protected',
    'OSHA-WHISTLEBLOWER': 'regulatory',
    'OMNIVERSAL-MEDIA': 'admin'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    setupNotifications();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if already logged in
    checkExistingSession();
}

function handleLogin(e) {
    e.preventDefault();
    
    const accessCode = document.getElementById('accessCode').value;
    const email = document.getElementById('email').value;
    
    if (ACCESS_CODES[accessCode]) {
        const accessLevel = ACCESS_CODES[accessCode];
        
        // Store session
        localStorage.setItem('sentinelAccess', accessLevel);
        localStorage.setItem('sentinelEmail', email);
        localStorage.setItem('sentinelLoginTime', Date.now());
        
        // Show success and redirect
        showAccessGranted(accessLevel);
        
        setTimeout(() => {
            window.location.href = getRedirectUrl(accessLevel);
        }, 2000);
        
    } else {
        showAccessDenied();
    }
}

function checkExistingSession() {
    const access = localStorage.getItem('sentinelAccess');
    const loginTime = localStorage.getItem('sentinelLoginTime');
    
    if (access && loginTime) {
        const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) { // 24-hour session
            showSessionActive(access);
        } else {
            clearSession();
        }
    }
}

function showAccessGranted(level) {
    const message = document.createElement('div');
    message.className = 'access-message success';
    message.innerHTML = `
        <h3>🛡️ Access Granted</h3>
        <p>Level: ${level.toUpperCase()}</p>
        <p>Redirecting to protected area...</p>
    `;
    
    document.querySelector('.login-form').appendChild(message);
}

function showAccessDenied() {
    const message = document.createElement('div');
    message.className = 'access-message denied';
    message.innerHTML = `
        <h3>❌ Access Denied</h3>
        <p>Invalid access code. Contact legal@omniversalmedia.org for access.</p>
    `;
    
    document.querySelector('.login-form').appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showSessionActive(level) {
    const message = document.createElement('div');
    message.className = 'access-message active';
    message.innerHTML = `
        <h3>✅ Session Active</h3>
        <p>Access Level: ${level.toUpperCase()}</p>
        <a href="${getRedirectUrl(level)}" class="btn primary">Continue to Protected Area</a>
        <button onclick="clearSession()" class="btn secondary">Logout</button>
    `;
    
    document.querySelector('.login-form').appendChild(message);
}

function getRedirectUrl(level) {
    switch(level) {
        case 'protected': return 'protected-downloads.html';
        case 'regulatory': return 'regulatory-access.html';
        case 'admin': return 'admin-panel.html';
        default: return 'index.html';
    }
}

function clearSession() {
    localStorage.removeItem('sentinelAccess');
    localStorage.removeItem('sentinelEmail');
    localStorage.removeItem('sentinelLoginTime');
    location.reload();
}

// Push Notifications
function setupNotifications() {
    const enableBtn = document.getElementById('enableNotifications');
    if (enableBtn) {
        enableBtn.addEventListener('click', requestNotificationPermission);
    }
    
    // Check if notifications are already enabled
    if ('Notification' in window && Notification.permission === 'granted') {
        updateNotificationStatus('enabled');
    }
}

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications');
        return;
    }
    
    if ('serviceWorker' in navigator) {
        // Register service worker for notifications
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        updateNotificationStatus('enabled');
        
        // Send welcome notification
        new Notification('🛡️ Sentinel Framework', {
            body: 'Notifications enabled! You\\'ll receive updates on framework developments.',
            icon: '/assets/img/logo.png',
            badge: '/assets/img/logo.png'
        });
        
        // Store notification preference
        localStorage.setItem('sentinelNotifications', 'enabled');
        
    } else {
        updateNotificationStatus('denied');
    }
}

function updateNotificationStatus(status) {
    const btn = document.getElementById('enableNotifications');
    if (btn) {
        switch(status) {
            case 'enabled':
                btn.textContent = '✅ Notifications Enabled';
                btn.disabled = true;
                btn.classList.add('enabled');
                break;
            case 'denied':
                btn.textContent = '❌ Notifications Blocked';
                btn.disabled = true;
                btn.classList.add('denied');
                break;
        }
    }
}

// Utility function to send notifications (for admin use)
function sendFrameworkNotification(title, body, url = '/') {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/assets/img/logo.png',
            badge: '/assets/img/logo.png',
            data: { url: url }
        });
        
        notification.onclick = function() {
            window.open(url);
            notification.close();
        };
    }
}

// Export for global use
window.SentinelAuth = {
    checkAccess: () => localStorage.getItem('sentinelAccess'),
    getEmail: () => localStorage.getItem('sentinelEmail'),
    logout: clearSession,
    notify: sendFrameworkNotification
};