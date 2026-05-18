//data.js
const links = {
    uw:       "https://www.cs.washington.edu/",
    github:   "https://github.com/Coderz75",
    linkedin: "https://www.linkedin.com/in/nuaym-syed",
    MM:       "https://www.mustangmath.com/",
    mitbc26:  "./post.html?slug=mitbc26"
};

const a = (href, text) => `<a href="${href}" target="_blank" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">${text}</a>`;

const profileData = {
    profile: {
        name: "Nuaym Syed",
        photo: "assets/pfp.jpg",
        role: "Student",
        location: "Bellevue, WA",
        email: "n.syed.dev@gmail.com",
        github: "https://github.com/Coderz75",
        linkedin: "https://www.linkedin.com/in/nuaym-syed",
        bio: "First-year student at the University of Washington. Passionate about robotics, low-level programming, and mechanical engineering. Currently exploring the intersection of AI and physics-based simulations.",
        aboutExtended: `Hi my name is Nuaym! Currently aspiring to be either a Computer Scientist or an Electrical Engineer, I love combining my interests in programming, mathematics and science. I am a volunteer programmer at ${a(links.MM,"Mustang Math")}, ${a(links.mitbc26,"MIT Battlecode 2026 Finalist")}, and overall am a programming and science enthusiast! `
    },
    skills: [
        {
            category: "Languages",
            items: ["Python", "C++", "Java", "JavaScript", "More coming soon!"]
        },
        {
            category: "Frameworks & Tools",
            items: ["Tailwind CSS", "WPILib", "Git", "LaTeX", "SolidWorks"]
        },
        {
            category: "Engineering",
            items: ["Autonomous Programming", "Circuit Design", "Public Speaking", "Curriculum Development"]
        }
    ],
    experience: [
        {
            role: "Experience update coming soon!",
            organization: "Soon",
            location: "Bellevue, WA",
            date: "Date coming soon",
            bullets: [
                "Soon"
            ]
        },
    ],
    leadership: [
        {
            role: "Soon",
            organization: "Soon",
            location: "Soon",
            date: "Soon",
            bullets: [
                "Soon"
            ]
        }
    ],
};