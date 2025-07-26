import React from 'react';
import { Card } from '../ui/card';

export default function AboutUs() {
  const teamMembers = [
    { name: 'Alex Johnson', role: 'CEO & Founder', emoji: '👨‍💼', description: 'Visionary leader with 15+ years in fintech' },
    { name: 'Sarah Chen', role: 'CTO', emoji: '👩‍💻', description: 'Tech genius driving our innovative platform' },
    { name: 'Mike Rodriguez', role: 'Head of Analytics', emoji: '📊', description: 'Data scientist creating market insights' },
    { name: 'Emily Davis', role: 'Product Manager', emoji: '🎯', description: 'Crafting exceptional user experiences' },
  ];

  const features = [
    { title: 'Real-time Data', description: 'Live market data and instant updates', icon: '⚡' },
    { title: 'Advanced Analytics', description: 'Powerful tools for market analysis', icon: '📈' },
    { title: 'Secure Platform', description: 'Bank-level security for your data', icon: '🔒' },
    { title: 'Global Markets', description: 'Access to worldwide financial markets', icon: '🌍' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          About Us
        </h1>
        <p className="text-[var(--velmora-light-purple)]">
          Discover the story behind Velmora and our mission to democratize financial insights.
        </p>
      </div>

      {/* Company Mission */}
      <Card className="p-8 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <div className="text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-lg text-[var(--velmora-light-purple)] max-w-3xl mx-auto leading-relaxed">
            At Velmora, we believe that everyone deserves access to powerful financial tools and insights. 
            Our platform combines cutting-edge technology with intuitive design to make market analysis 
            accessible to both beginners and professionals.
          </p>
        </div>
      </Card>

      {/* Company Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
          <h3 className="text-2xl mb-4 text-[var(--velmora-light-purple)]">Our Story</h3>
          <div className="space-y-4 text-[var(--velmora-violet)]">
            <p>
              Founded in 2023, Velmora emerged from a simple observation: financial markets were becoming 
              increasingly complex, but the tools to understand them remained outdated and inaccessible.
            </p>
            <p>
              Our founders, coming from backgrounds in finance, technology, and data science, set out to 
              create a platform that would level the playing field. We wanted to build something that 
              would give individual investors the same quality of insights that were previously only 
              available to institutional traders.
            </p>
            <p>
              Today, Velmora serves thousands of users worldwide, providing real-time market data, 
              advanced analytics, and personalized insights that help people make better financial decisions.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
          <h3 className="text-2xl mb-4 text-[var(--velmora-light-purple)]">Our Values</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="text-white mb-1">Innovation</h4>
                <p className="text-[var(--velmora-violet)] text-sm">
                  We constantly push the boundaries of what's possible in financial technology.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤝</div>
              <div>
                <h4 className="text-white mb-1">Transparency</h4>
                <p className="text-[var(--velmora-violet)] text-sm">
                  We believe in clear, honest communication with our users about data and insights.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🌟</div>
              <div>
                <h4 className="text-white mb-1">Excellence</h4>
                <p className="text-[var(--velmora-violet)] text-sm">
                  We strive for the highest quality in everything we build and deliver.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🌍</div>
              <div>
                <h4 className="text-white mb-1">Accessibility</h4>
                <p className="text-[var(--velmora-violet)] text-sm">
                  Financial tools should be available to everyone, regardless of background.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-2xl mb-6 text-center text-[var(--velmora-light-purple)]">What Makes Us Different</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="text-white mb-2">{feature.title}</h4>
              <p className="text-[var(--velmora-violet)] text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Team */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-2xl mb-6 text-center text-[var(--velmora-light-purple)]">Meet Our Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center p-4 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
              <div className="text-6xl mb-3">{member.emoji}</div>
              <h4 className="text-white mb-1">{member.name}</h4>
              <p className="text-[var(--velmora-magenta)] text-sm mb-2">{member.role}</p>
              <p className="text-[var(--velmora-violet)] text-xs">{member.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-8 bg-gradient-to-r from-[var(--velmora-purple)]/10 to-[var(--velmora-magenta)]/10 border-[var(--velmora-purple)]/30">
        <div className="text-center">
          <h3 className="text-2xl mb-4 text-[var(--velmora-light-purple)]">Get In Touch</h3>
          <p className="text-[var(--velmora-violet)] mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl mb-1">📧</div>
              <p className="text-[var(--velmora-light-purple)] text-sm">hello@velmora.com</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💬</div>
              <p className="text-[var(--velmora-light-purple)] text-sm">Live Chat</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🐦</div>
              <p className="text-[var(--velmora-light-purple)] text-sm">@Velmora</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}