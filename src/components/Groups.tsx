import React from 'react';

// Allow using the <ion-icon> web component in TSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
        className?: string;
      };
    }
  }
}

interface Group {
  id: number;
  name: string;
  members: number;
  img: string;
  notify: boolean;
}

const groupsData: Group[] = [
  {
    id: 1,
    name: 'Cuisine',
    members: 36,
    img: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.kobejones.com.au%2Fwp-content%2Fuploads%2F2018%2F03%2FKobe-Jones-Cookbooks-for-the-Japanese-Cuisine-Lover.jpg&f=1&nofb=1',
    notify: false,
  },
  {
    id: 2,
    name: 'Art',
    members: 9,
    img: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.AHzmWYN4SG85fUg2t3ePawHaJ4%26pid%3DApi&f=1',
    notify: false,
  },
  {
    id: 3,
    name: 'Workout',
    members: 27,
    img: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.4tx8oThXmJuvRCLMzp56bwHaEc%26pid%3DApi&f=1',
    notify: true,
  },
  {
    id: 4,
    name: 'Gaming',
    members: 105,
    img: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.techsnix.com%2Fwp-content%2Fuploads%2F2017%2F08%2Fjoystick-2346237_1920.jpg&f=1&nofb=1',
    notify: true,
  },
  {
    id: 5,
    name: 'Hiking',
    members: 97,
    img: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.rove.me%2Fw_1920%2Cq_85%2Fucnanrorm2boo7xgpuld%2Fgreenland-hiking.jpg&f=1&nofb=1',
    notify: false,
  },
  {
    id: 6,
    name: 'Yoga',
    members: 65,
    img: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.0qshvrEmqRMFNY_YEN_QQAHaFS%26pid%3DApi&f=1',
    notify: false,
  },
];

export default function Groups() {
  return (
    <div className="bg-[#242b42] w-full max-w-[700px] mx-auto mt-12 rounded-lg p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold flex items-center">
          <ion-icon name="caret-back-outline" className="text-2xl mr-2" />
          Groups
        </h1>
        <div className="flex border-2 border-[#1a2036] rounded overflow-hidden">
          <button className="bg-[#1a2036] p-2">
            <ion-icon name="grid-outline" />
          </button>
          <button className="p-2">
            <ion-icon name="list-outline" />
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Create Group Card */}
        <div className="bg-[#2e3650] rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg">
          <div className="bg-[#242b42] w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <ion-icon name="add-outline" className="text-3xl" />
          </div>
          <p className="text-white">Create Group</p>
        </div>

        {/* Existing Groups */}
        {groupsData.map((g) => (
          <div
            key={g.id}
            className="relative bg-[#1a2036] rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg"
          >
            {g.notify && (
              <div className="absolute top-2 right-2 bg-[#966aff] w-2.5 h-2.5 rounded-full" />
            )}
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
              <img src={g.img} alt={g.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-white text-lg font-medium">{g.name}</h4>
            <p className="text-gray-400 text-sm">{g.members} members</p>
          </div>
        ))}
      </div>
    </div>
  );
}
