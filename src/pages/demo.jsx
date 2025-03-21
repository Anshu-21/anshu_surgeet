import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";

const artists = [
  { name: "Arijit Singh", image: "https://i.imgur.com/9bYHspA.jpg" },
  { name: "Neha Kakkar", image: "https://i.imgur.com/6yZgHvK.jpg" },
  { name: "Shreya Ghoshal", image: "https://i.imgur.com/zL7XdLs.jpg" },
  { name: "Jubin Nautiyal", image: "https://i.imgur.com/Q5W3kzV.jpg" },
  { name: "Badshah", image: "https://i.imgur.com/fSx0KIz.jpg" },
  { name: "Sonu Nigam", image: "https://i.imgur.com/OTMcAyk.jpg" },
  { name: "Darshan Raval", image: "https://i.imgur.com/cKr6jhh.jpg" },
  { name: "Guru Randhawa", image: "https://i.imgur.com/kwOAp8B.jpg" },
  { name: "KK", image: "https://i.imgur.com/bfUt5TQ.jpg" },
];

const ArtistCard = ({ artist }) => {
  return (
    <motion.div
      className="relative group w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden text-center"
    >
      <motion.img
        src={artist.image}
        alt={artist.name}
        className="w-full h-full object-cover rounded-full border-4 border-gray-300"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Play className="text-white bg-blue-500 p-1 rounded-full w-8 h-8 shadow-md" />
      </motion.div>

      <p className="mt-2 text-sm font-semibold">{artist.name}</p>
    </motion.div>
  );
};

export default function ArtistSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleArtists = artists.slice(0, 5);

  return (
    <div className="w-full py-6">
      <div className="flex gap-6 px-6 items-center overflow-x-auto">
        {visibleArtists.map((artist, index) => (
          <ArtistCard key={index} artist={artist} />
        ))}

        <button
          onClick={() => setShowAll(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Show All +
        </button>
      </div>

      {showAll && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-4 right-6 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">All Artists</h2>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {artists.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
