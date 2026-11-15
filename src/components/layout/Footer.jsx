import React from 'react';
import { Heart, Mail } from 'lucide-react';

/**
 * =========================================================================
 * SOCIAL ACCOUNT LINKS CONFIGURATION
 * Edit your personal profile URLs below:
 * =========================================================================
 */
export const SOCIAL_LINKS = {
  // Replace with your personal Instagram profile URL:
  instagram: 'https://www.instagram.com/_.samil._86?vrfl=MTM0a2d6eXZ1bWY2cg%3D%3D',

  // Replace with your personal LinkedIn profile URL:
  linkedin: 'https://www.linkedin.com/in/samil-uka-53049b359?utm_source=share_via&utm_content=profile&utm_medium=member_android',

  // Replace with your personal GitHub profile URL:
  github: 'https://github.com/SamilUka86',

  // Direct Contact Email:
  email: 'mailto:platesync86@gmail.com'
};

// Scalable Vector Icons for Social Platforms
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const Footer = ({ className = "" }) => {
  return (
    <footer className={`w-full py-6 px-4 border-t border-midnight-border bg-midnight-card/40 backdrop-blur-sm text-center ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3">

        {/* Made by attribution */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by</span>
          <span className="font-black text-white tracking-wide bg-gradient-to-r from-neon-cyan via-white to-neon-violet bg-clip-text text-transparent">
            Samil Uka
          </span>
        </div>

        {/* Social media logo links */}
        <div className="flex items-center justify-center gap-3 pt-0.5">
          {/* Instagram */}
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            title="Follow on Instagram"
            className="w-8 h-8 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 transition duration-200 transform hover:scale-110 active:scale-95 shadow-sm"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="Connect on LinkedIn"
            className="w-8 h-8 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-400 hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/10 transition duration-200 transform hover:scale-110 active:scale-95 shadow-sm"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* GitHub */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="View GitHub Repository & Code"
            className="w-8 h-8 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-400 hover:text-white hover:border-white/40 hover:bg-white/10 transition duration-200 transform hover:scale-110 active:scale-95 shadow-sm"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Contact Email */}
          <a
            href={SOCIAL_LINKS.email}
            aria-label="Contact via Email"
            title="Contact Support: platesync86@gmail.com"
            className="w-8 h-8 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/40 hover:bg-neon-cyan/10 transition duration-200 transform hover:scale-110 active:scale-95 shadow-sm"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Contact Email Note & Brand Copyright */}
        <div className="space-y-0.5">
          <p className="text-[11.5px] text-slate-400 font-mono">
            Contact: <a href={SOCIAL_LINKS.email} className="text-neon-cyan hover:underline">platesync86@gmail.com</a>
          </p>
          <p className="text-[10.5px] text-slate-500 font-medium">
            PlateSync &copy; {new Date().getFullYear()} &bull; Smart Mixed-Unit Barbell &amp; Workout Tracking Platform
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
