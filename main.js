document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderNavbar();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects('All');
    renderExperience();
    renderLeadership();
    renderContact();
    setupIntersectionObserver();
    setupNavbarScroll();
    lucide.createIcons();
}

// Helper to set innerHTML safely
const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
};

function renderNavbar() {
    document.getElementById('nav-logo').textContent = profileData.profile.name.split(' ')[0];
    const navItems = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];
    const linksHtml = navItems.map(item => `
        <a href="#${item.toLowerCase()}" class="nav-link transition-colors hover:text-white">${item}</a>
    `).join('');
    setHtml('nav-links', linksHtml);
    setHtml('mobile-menu', linksHtml);

    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

function renderHero() {
    const { name, role, location, bio, github, linkedin } = profileData.profile;
    const html = `
        <span class="text-indigo-500 font-mono mb-4 block">Hi, my name is</span>
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">${name}</h1>
        <h2 class="text-3xl md:text-5xl font-bold text-slate-400 mb-8">${role}</h2>
        <p class="text-slate-400 max-w-xl text-lg mb-10 leading-relaxed">${bio}</p>
        <div class="flex space-x-6">
            <a href="${github}" class="hover:text-indigo-400 transition-colors"><i data-lucide="github"></i></a>
            <a href="${linkedin}" class="hover:text-indigo-400 transition-colors"><i data-lucide="linkedin"></i></a>
            <a href="#contact" class="hover:text-indigo-400 transition-colors"><i data-lucide="mail"></i></a>
        </div>
    `;
    setHtml('hero', html);
}

function renderAbout() {
    setHtml('about', `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="md:col-span-2">
                <h2 class="text-3xl font-bold mb-8 flex items-center">
                    <span class="text-indigo-500 font-mono text-xl mr-2">01.</span> About Me
                </h2>
                <div class="text-slate-400 space-y-4 leading-relaxed">
                    <p>${profileData.profile.aboutExtended}</p>
                    <p>Currently studying <span class="text-white font-medium">Math 13X (Honors Accelerated Calc)</span>, <span class="text-white font-medium">Phys 14X (Honors Physics)</span> and <span class="text-white font-medium">CSE 123 (Java)</span> at UW.</p>
                </div>
            </div>
            <div class="relative group">
                <div class="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div class="relative bg-slate-900 aspect-square rounded-2xl border border-slate-800 flex items-center justify-center">
                    <i data-lucide="user" class="w-20 h-20 text-slate-700"></i>
                </div>
            </div>
        </div>
    `);
}

function renderSkills() {
    const skillsHtml = profileData.skills.map(cat => `
        <div>
            <h3 class="text-indigo-400 font-mono text-sm mb-4 uppercase tracking-widest">${cat.category}</h3>
            <div class="flex flex-wrap gap-2">
                ${cat.items.map(s => `
                    <span class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm hover:border-indigo-500/50 transition-colors cursor-default">
                        ${s}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');

    setHtml('skills', `
        <h2 class="text-3xl font-bold mb-12">Technical Toolkit</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">${skillsHtml}</div>
    `);
}

function renderProjects(filter = 'All') {
    // Generate filters
    const allTags = ['All', ...new Set(profileData.projects.flatMap(p => p.tags))];
    const filterHtml = allTags.map(tag => `
        <button onclick="renderProjects('${tag}')" class="px-4 py-1.5 rounded-full text-xs font-medium border ${filter === tag ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-800 text-slate-400 hover:border-slate-600'} transition-all">
            ${tag}
        </button>
    `).join('');
    setHtml('project-filters', filterHtml);

    // Generate projects
    const filtered = filter === 'All' ? profileData.projects : profileData.projects.filter(p => p.tags.includes(filter));
    
    const gridHtml = filtered.map(p => `
        <div class="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${p.featured ? 'md:col-span-2' : ''}">
            <div class="h-64 overflow-hidden">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-8">
                <div class="flex flex-wrap gap-2 mb-4">
                    ${p.tech.map(t => `<span class="text-[10px] font-mono text-indigo-400 uppercase">${t}</span>`).join(' • ')}
                </div>
                <h3 class="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">${p.title}</h3>
                <p class="text-slate-400 mb-6 line-clamp-2">${p.description}</p>
                <div class="flex space-x-4">
                    <a href="${p.github}" class="text-slate-300 hover:text-white"><i data-lucide="github" class="w-5 h-5"></i></a>
                    ${p.demo ? `<a href="${p.demo}" class="text-slate-300 hover:text-white"><i data-lucide="external-link" class="w-5 h-5"></i></a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    setHtml('projects-grid', gridHtml);
    lucide.createIcons();
}

function renderExperience() {
    const expHtml = profileData.experience.map(exp => `
        <div class="relative pl-8 border-l border-slate-800 pb-12 last:pb-0">
            <div class="absolute -left-1.5 top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-4 border-slate-950"></div>
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                    <h3 class="text-xl font-bold text-white">${exp.role}</h3>
                    <p class="text-indigo-400 font-medium">${exp.organization}</p>
                </div>
                <p class="text-slate-500 text-sm mt-1 md:mt-0 font-mono">${exp.date}</p>
            </div>
            <ul class="mt-4 space-y-2">
                ${exp.bullets.map(b => `<li class="text-slate-400 text-sm flex items-start"><span class="text-indigo-500 mr-2">▹</span> ${b}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    setHtml('experience', `
        <h2 class="text-3xl font-bold mb-12">Professional Experience</h2>
        <div class="max-w-3xl mx-auto">${expHtml}</div>
    `);
}

function renderLeadership() {
    const leadHtml = profileData.leadership.map(lead => `
        <div class="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
            <h3 class="text-xl font-bold mb-1">${lead.role}</h3>
            <p class="text-indigo-400 text-sm mb-4">${lead.organization} | ${lead.date}</p>
            <ul class="space-y-2">
                ${lead.bullets.map(b => `<li class="text-slate-400 text-sm flex items-start"><span class="text-indigo-500 mr-2">▹</span> ${b}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    setHtml('leadership', `
        <h2 class="text-3xl font-bold mb-12">Leadership & Impact</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${leadHtml}</div>
    `);
}

function renderContact() {
    const { email } = profileData.profile;
    setHtml('contact', `
        <div class="text-center max-w-2xl mx-auto">
            <h2 class="text-indigo-500 font-mono mb-4 text-sm tracking-widest uppercase">04. What's Next?</h2>
            <h3 class="text-4xl font-bold mb-6">Get In Touch</h3>
            <p class="text-slate-400 mb-10">Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
            <div class="flex flex-col md:flex-row items-center justify-center gap-4">
                <a href="mailto:${email}" class="px-8 py-4 bg-transparent border border-indigo-500 text-indigo-500 rounded-xl font-medium hover:bg-indigo-500/10 transition-all">
                    Send Email
                </a>
                <button onclick="copyEmail('${email}')" id="copy-btn" class="px-8 py-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all flex items-center">
                    <i data-lucide="copy" class="w-4 h-4 mr-2"></i> Copy Email
                </button>
            </div>
        </div>
    `);
    document.getElementById('footer-text').textContent = `Built by ${profileData.profile.name} • 2026`;
}

function copyEmail(email) {
    navigator.clipboard.writeText(email);
    const btn = document.getElementById('copy-btn');
    const original = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-2"></i> Copied!`;
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = original;
        lucide.createIcons();
    }, 2000);
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupNavbarScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-slate-950/80', 'backdrop-blur-md', 'py-3', 'border-slate-900');
            nav.classList.remove('py-4', 'border-transparent');
        } else {
            nav.classList.remove('bg-slate-950/80', 'backdrop-blur-md', 'py-3', 'border-slate-900');
            nav.classList.add('py-4', 'border-transparent');
        }

        // Active Link Highlight
        let current = "";
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}