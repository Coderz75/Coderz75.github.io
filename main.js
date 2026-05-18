//main.js
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    renderNavbar();
    renderHero();
    renderAbout();
    renderSkills();
    await renderProjects('All');
    renderExperience();
    await renderBlog();
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
    const navItems = ['About', 'Skills', 'Projects', 'Experience', 'Writing', 'Contact'];
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
    const { name, role, bio, github, linkedin } = profileData.profile;
    const html = `
        <span class="text-indigo-500 font-mono mb-4 block">Hi, my name is</span>
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">${name}</h1>
        <h2 class="text-3xl md:text-5xl font-bold text-slate-400 mb-8">${role}</h2>
        <p class="text-slate-400 max-w-xl text-lg mb-10 leading-relaxed">${bio}</p>
        <div class="flex space-x-6 items-center">
            <a href="${github}" target="_blank" class="hover:text-indigo-400 transition-colors text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            </a>
            <a href="${linkedin}" target="_blank" class="hover:text-indigo-400 transition-colors text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>
            <a href="#contact" class="hover:text-indigo-400 transition-colors text-slate-300">
                <i data-lucide="mail" class="w-6 h-6"></i>
            </a>
        </div>
    `;
    setHtml('hero', html);
}

function renderAbout() {
    const { aboutExtended, photo } = profileData.profile;
    setHtml('about', `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="md:col-span-2">
                <h2 class="text-3xl font-bold mb-8 flex items-center">
                    <span class="text-indigo-500 font-mono text-xl mr-2">01.</span> About Me
                </h2>
                <div class="text-slate-400 space-y-4 leading-relaxed">
                    <p>${aboutExtended}</p>
                    <p>Currently studying <span class="text-white font-medium">Calculus, Differential Equation, Linear Algebra, and Real Analysis</span>, <span class="text-white font-medium">Optics and Quantum Physics</span>, <span class="text-white font-medium">Architecture</span>, and <span class="text-white font-medium">Competitive Programming</span> .</p>
                </div>
            </div>
            <div class="relative group">
                <div class="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div class="relative bg-slate-900 aspect-square rounded-2xl border border-slate-800 overflow-hidden">
                    ${photo
                        ? `<img src="${photo}" alt="Profile photo" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500">`
                        : `<div class="w-full h-full flex items-center justify-center"><i data-lucide="user" class="w-20 h-20 text-slate-700"></i></div>`
                    }
                </div>
            </div>
        </div>
    `);
}

async function renderBlog() {
    let posts;
    try {
        const res = await fetch('posts/index.json');
        posts = await res.json();
    } catch {
        console.warn('No posts/index.json found');
        return;
    }
    if (!posts.length) return;

    const cardsHtml = posts.map(post => `
        <a href="post.html?slug=${post.slug}" class="group block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div class="p-8">
                <div class="flex flex-wrap items-center gap-2 mb-4">
                    ${post.tags.map(t => `<span class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">${t}</span>`).join('<span class="text-[10px] text-slate-500">•</span>')}
                </div>
                <h3 class="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-6 line-clamp-2">${post.summary}</p>
                <div class="flex items-center justify-between">
                    <span class="text-slate-600 text-xs font-mono">${post.date}</span>
                    <span class="text-indigo-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
                </div>
            </div>
        </a>
    `).join('');

    setHtml('blog', `
        <h2 class="text-3xl font-bold mb-12">Writing</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">${cardsHtml}</div>
    `);
    lucide.createIcons();
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

async function renderProjects(filter = 'All') {
    let projects;
    try {
        const res = await fetch('projects/index.json');
        projects = await res.json();
    } catch {
        console.warn('No projects/index.json found');
        return;
    }

    // 1. Combine tech and tags to generate the filter buttons
    const allTags = ['All', ...new Set(projects.flatMap(p => [...(p.tags || []), ...(p.tech || [])]))];
    
    const filterHtml = allTags.map(tag => `
        <button onclick="renderProjects('${tag}')" class="px-4 py-1.5 rounded-full text-xs font-medium border ${filter === tag ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-800 text-slate-400 hover:border-slate-600'} transition-all">
            ${tag}
        </button>
    `).join('');
    setHtml('project-filters', filterHtml);

    // 2. Filter logic: check if the selected filter exists in EITHER tech or tags
    const filtered = filter === 'All' 
        ? projects 
        : projects.filter(p => [...(p.tags || []), ...(p.tech || [])].includes(filter));

    const gridHtml = filtered.map(p => {
        const readMoreLink = p.customLink ? p.customLink : `post.html?type=project&slug=${p.slug}`;
        const readMoreTarget = p.customLink && p.customLink.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';

        // 3. Combine tech and tags for the badges on the card (removing duplicates)
        const combinedBadges = [...new Set([...(p.tech || []), ...(p.tags || [])])];

        return `
        <div class="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${p.featured ? 'md:col-span-2' : ''}">
            <div class="h-64 overflow-hidden">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-8">
                <div class="flex flex-wrap items-center gap-2 mb-4">
                    ${combinedBadges.map(item => `<span class="text-[10px] font-mono text-indigo-400 uppercase">${item}</span>`).join('<span class="text-[10px] text-slate-500">•</span>')}
                </div>
                <h3 class="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">${p.title}</h3>
                <p class="text-slate-400 mb-6 line-clamp-2">${p.description}</p>
                <div class="flex space-x-4 items-center">
                    <a href="${p.github}" target="_blank" class="text-slate-300 hover:text-white"><i data-lucide="github" class="w-5 h-5"></i></a>
                    ${p.demo ? `<a href="${p.demo}" target="_blank" class="text-slate-300 hover:text-white"><i data-lucide="external-link" class="w-5 h-5"></i></a>` : ''}
                    
                    <a href="${readMoreLink}" ${readMoreTarget} class="ml-auto text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
                        See More <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');

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
    /*
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
    */
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