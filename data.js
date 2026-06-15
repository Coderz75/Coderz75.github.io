//data.js
const links = {
    uw:       "https://www.cs.washington.edu/",
    github:   "https://github.com/Coderz75",
    linkedin: "https://www.linkedin.com/in/nuaym-syed",
    MM:       "https://www.mustangmath.com/",
    mitbc26:  "./post.html#slug=mitbc26"
};

const a = (href, text) => `<a href="${href}" target="_blank" class="text-white font-medium underline underline-offset-4 decoration-white/50 hover:decoration-white hover:text-gray-100 transition-all duration-300 tracking-wide">${text}</a>`;

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
        aboutExtended: `Hi my name is Nuaym! Currently aspiring to be either a Computer Scientist or an Electrical Engineer, I love combining my interests in programming, mathematics and science. I am a volunteer programmer at ${a(links.MM,"Mustang Math")}, ${a(links.mitbc26,"MIT Battlecode 2026 Finalist")}, ${a(links.mitbc26,"Cambridge Battlecode 2026 Second Place")}, and overall am a programming and science enthusiast!`
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
            role: "Mustang Math Software Developer",
            organization: "Mustang Math",
            location: "Bellevue, WA",
            date: "July 2025 - Present",
            bullets: [
                "A software developer at a non-profit organization focused on delivering tests, classes, and more to middle schoolers. ",
                "Worked as a group in both server side and web-based frameworks to facilitate better data transfer with tools such as Supabase within and outside of the organization."
            ]
        },
        {
            role: "Tyee Science Club Coach",
            organization: "Tyee Middle School",
            location: "Bellevue, WA",
            date: "Sep 2024 - April 2026",
            bullets: [
                "Worked with a team to create high school to college level lectures on a variety of disciplines: Earth and Space, Biology, Physics, Chemistry, Mathematics, Energy",
                "Graded homework, trained National Science Bowl teams, and had a lot of fun!"
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