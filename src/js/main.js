// Theme Toggle Logic
const htmlElement = document.documentElement;
const themeToggles = document.querySelectorAll('[data-theme-toggle]');
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const getSavedTheme = () => {
    try {
        const theme = localStorage.getItem('theme');
        return theme === 'light' || theme === 'dark' ? theme : null;
    } catch {
        return null;
    }
};

const setSavedTheme = (theme) => {
    try {
        localStorage.setItem('theme', theme);
    } catch {
        // Ignore storage errors (private mode/restricted storage)
    }
};

const resolveTheme = () => {
    const savedTheme = getSavedTheme();
    if (savedTheme) {
        return savedTheme;
    }
    return systemThemeQuery.matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    htmlElement.classList.toggle('dark', isDark);
    htmlElement.style.colorScheme = isDark ? 'dark' : 'light';

    themeToggles.forEach((button) => {
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
};

applyTheme(resolveTheme());

themeToggles.forEach((button) => {
    button.addEventListener('click', () => {
        const nextTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        setSavedTheme(nextTheme);
        applyTheme(nextTheme);
    });
});

systemThemeQuery.addEventListener('change', () => {
    if (!getSavedTheme()) {
        applyTheme(resolveTheme());
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        applyTheme(resolveTheme());
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Simple Animation on Scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});
