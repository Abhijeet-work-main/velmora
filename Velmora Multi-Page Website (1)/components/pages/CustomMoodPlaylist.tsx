import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-500' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-500' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-500' },
  { emoji: '😌', label: 'Calm', color: 'bg-green-500' },
  { emoji: '🤗', label: 'Excited', color: 'bg-orange-500' },
  { emoji: '😴', label: 'Sleepy', color: 'bg-indigo-500' },
  { emoji: '💪', label: 'Motivated', color: 'bg-purple-500' },
  { emoji: '💔', label: 'Heartbroken', color: 'bg-pink-500' },
  { emoji: '🧘', label: 'Meditative', color: 'bg-teal-500' },
  { emoji: '🎉', label: 'Celebratory', color: 'bg-yellow-400' },
  { emoji: '😰', label: 'Anxious', color: 'bg-gray-500' },
  { emoji: '🥰', label: 'Romantic', color: 'bg-rose-500' },
];

const playlists = {
  'Happy': [
    { title: 'Good as Hell', artist: 'Lizzo', duration: '3:31' },
    { title: 'Happy', artist: 'Pharrell Williams', duration: '3:53' },
    { title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', duration: '3:56' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:30' },
    { title: 'Walking on Sunshine', artist: 'Katrina and the Waves', duration: '3:58' },
  ],
  'Sad': [
    { title: 'Someone Like You', artist: 'Adele', duration: '4:45' },
    { title: 'Hurt', artist: 'Johnny Cash', duration: '3:38' },
    { title: 'Mad World', artist: 'Gary Jules', duration: '3:07' },
    { title: 'The Sound of Silence', artist: 'Simon & Garfunkel', duration: '3:05' },
    { title: 'Tears in Heaven', artist: 'Eric Clapton', duration: '4:32' },
  ],
  'Angry': [
    { title: 'Break Stuff', artist: 'Limp Bizkit', duration: '2:47' },
    { title: 'Killing in the Name', artist: 'Rage Against the Machine', duration: '5:14' },
    { title: 'Bodies', artist: 'Drowning Pool', duration: '3:22' },
    { title: 'Freak on a Leash', artist: 'Korn', duration: '4:15' },
    { title: 'Chop Suey!', artist: 'System of a Down', duration: '3:30' },
  ],
  'Calm': [
    { title: 'Weightless', artist: 'Marconi Union', duration: '8:10' },
    { title: 'Clair de Lune', artist: 'Claude Debussy', duration: '4:46' },
    { title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', duration: '8:00' },
    { title: 'River', artist: 'Joni Mitchell', duration: '4:00' },
    { title: 'The Blue Notebooks', artist: 'Max Richter', duration: '3:34' },
  ],
  'Excited': [
    { title: 'Pump It', artist: 'The Black Eyed Peas', duration: '3:33' },
    { title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:04' },
    { title: 'Don\'t Stop Me Now', artist: 'Queen', duration: '3:29' },
    { title: 'I Gotta Feeling', artist: 'The Black Eyed Peas', duration: '4:05' },
    { title: 'Celebration', artist: 'Kool & The Gang', duration: '4:58' },
  ],
  'Sleepy': [
    { title: 'Sleepyhead', artist: 'Passion Pit', duration: '3:26' },
    { title: 'Dream a Little Dream', artist: 'Ella Fitzgerald', duration: '3:07' },
    { title: 'Lullaby', artist: 'Brahms', duration: '4:12' },
    { title: 'Moonlight Sonata', artist: 'Beethoven', duration: '5:30' },
    { title: 'Sleepless', artist: 'Peter Walker', duration: '6:45' },
  ],
  'Motivated': [
    { title: 'Stronger', artist: 'Kanye West', duration: '5:11' },
    { title: 'Lose Yourself', artist: 'Eminem', duration: '5:26' },
    { title: 'Work Out', artist: 'J. Cole', duration: '3:54' },
    { title: 'Till I Collapse', artist: 'Eminem', duration: '4:57' },
    { title: 'Remember the Name', artist: 'Fort Minor', duration: '3:29' },
  ],
  'Heartbroken': [
    { title: 'All Too Well', artist: 'Taylor Swift', duration: '5:29' },
    { title: 'Back to Black', artist: 'Amy Winehouse', duration: '4:01' },
    { title: 'Everybody Hurts', artist: 'R.E.M.', duration: '5:17' },
    { title: 'Skinny Love', artist: 'Bon Iver', duration: '3:58' },
    { title: 'Black', artist: 'Pearl Jam', duration: '5:43' },
  ],
  'Meditative': [
    { title: 'Om Gam Ganapataye Namaha', artist: 'Krishna Das', duration: '8:22' },
    { title: 'Tibetan Bowls', artist: 'Meditation Music', duration: '10:00' },
    { title: 'Forest Sounds', artist: 'Nature Sounds', duration: '15:00' },
    { title: 'Gayatri Mantra', artist: 'Deva Premal', duration: '7:30' },
    { title: 'Inner Peace', artist: 'Liquid Mind', duration: '12:45' },
  ],
  'Celebratory': [
    { title: 'Celebration', artist: 'Kool & The Gang', duration: '4:58' },
    { title: 'We Are The Champions', artist: 'Queen', duration: '2:59' },
    { title: 'Good Times', artist: 'Chic', duration: '3:32' },
    { title: 'Dancing Queen', artist: 'ABBA', duration: '3:52' },
    { title: 'I Want It That Way', artist: 'Backstreet Boys', duration: '3:33' },
  ],
  'Anxious': [
    { title: 'Breathe', artist: 'Télépopmusik', duration: '4:41' },
    { title: 'Anxiety', artist: 'Julia Michaels', duration: '3:24' },
    { title: 'Panic Station', artist: 'Muse', duration: '3:02' },
    { title: 'Nervous', artist: 'Gavin James', duration: '3:45' },
    { title: 'Calming Music', artist: 'Relaxation', duration: '6:30' },
  ],
  'Romantic': [
    { title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23' },
    { title: 'All of Me', artist: 'John Legend', duration: '4:29' },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41' },
    { title: 'Make You Feel My Love', artist: 'Adele', duration: '3:32' },
    { title: 'At Last', artist: 'Etta James', duration: '3:01' },
  ],
};

export default function CustomMoodPlaylist() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [currentPlaylist, setCurrentPlaylist] = useState<any[]>([]);

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    setCurrentPlaylist(playlists[mood as keyof typeof playlists] || []);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Custom Mood Playlist
        </h1>
        <p className="text-black">
          Select your current mood and get personalized music recommendations to match your vibe.
        </p>
      </div>

      {/* Mood Selection */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">How are you feeling today?</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelection(mood.label)}
              className={`
                mood-emoji p-4 rounded-lg border-2 transition-all duration-300 text-center
                ${selectedMood === mood.label 
                  ? 'border-[var(--velmora-purple)] bg-[var(--velmora-purple)]/10 selected' 
                  : 'border-gray-200 hover:border-[var(--velmora-purple)]/50 hover:bg-gray-50'
                }
              `}
            >
              <div className="mood-emoji mb-2">{mood.emoji}</div>
              <div className="text-sm text-black">{mood.label}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Your Perfect Playlist */}
      {selectedMood && (
        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-black">Your Perfect Playlist</h3>
            <Badge className="bg-[var(--velmora-purple)]/20 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">
              {selectedMood} Vibes
            </Badge>
          </div>
          
          <div className="space-y-3">
            {currentPlaylist.map((song, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--velmora-purple)] to-[var(--velmora-magenta)] rounded-full flex items-center justify-center text-white">
                    <span className="text-lg">🎵</span>
                  </div>
                  <div>
                    <div className="text-black font-medium">{song.title}</div>
                    <div className="text-gray-600 text-sm">{song.artist}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 text-sm">{song.duration}</span>
                  <Button size="sm" className="bg-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/80 text-white">
                    ▶️
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button className="bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] hover:from-[var(--velmora-purple)]/80 hover:to-[var(--velmora-magenta)]/80 text-white px-8 py-3 mr-4">
              Play All
            </Button>
            <Button variant="outline" className="border-[var(--velmora-purple)] text-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/10">
              Save Playlist
            </Button>
          </div>
        </Card>
      )}

      {/* Mood Insights */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Mood Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-xl text-black mb-1">73%</div>
            <div className="text-gray-600 text-sm">Happy Mood This Week</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">🎵</div>
            <div className="text-xl text-black mb-1">127</div>
            <div className="text-gray-600 text-sm">Songs Played</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-xl text-black mb-1">Pop</div>
            <div className="text-gray-600 text-sm">Favorite Genre</div>
          </div>
        </div>
      </Card>

      {/* Mood History */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Recent Mood History</h3>
        <div className="space-y-3">
          {[
            { date: 'Today', mood: '😊', label: 'Happy', songs: 12 },
            { date: 'Yesterday', mood: '😌', label: 'Calm', songs: 8 },
            { date: 'Jan 15', mood: '🤗', label: 'Excited', songs: 15 },
            { date: 'Jan 14', mood: '😢', label: 'Sad', songs: 6 },
            { date: 'Jan 13', mood: '💪', label: 'Motivated', songs: 10 },
          ].map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{entry.mood}</span>
                <div>
                  <div className="text-black">{entry.label}</div>
                  <div className="text-gray-600 text-sm">{entry.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-black">{entry.songs} songs</div>
                <div className="text-gray-600 text-sm">played</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}