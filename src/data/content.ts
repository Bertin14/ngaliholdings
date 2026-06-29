import hero1 from '../assets/hero-1.jpeg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import energyBanner from '../assets/energy-banner.png'
import ngaliMiningImg from '../assets/ngali mining.png'
import mediheal from '../assets/mediheal.png'
import locusDynamics from '../assets/Locus Dynamics.png'
import lunaSmelter from '../assets/LuNa Smelter.png'
import trinity from '../assets/trinity.png'
import aboutHero1 from '../assets/About us_1.jpg'
import aboutHero2 from '../assets/About us_2.jpg'
import sector1 from '../assets/sector1.jpg'
import sector2 from '../assets/sector2.jpg'
import sector3 from '../assets/sector3.jpg'
import agricultureImg from '../assets/agriculture.png'
import miningImg from '../assets/mining.png'
import transportImg from '../assets/transport.png'
import healthImg from '../assets/health.png'
import blogImg from '../assets/blog.png'
import genocideMemorial from '../assets/genocide_memorial.png'


export const sectorsHeroImages = [sector1, sector2, sector3];
export const aboutHeroImages = [aboutHero1, aboutHero2];
export const blogsHeroImages = [blogImg, hero3, sector2, agricultureImg];


export interface Subsidiary {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const subsidiaries: Subsidiary[] = [
  {
    id: "ngali-energy",
    name: "Ngali Energy",
    description: "Ngali Energy specializes in renewable energy, focusing on the operation and development of power plants. The company is active in East Africa and beyond.",
    image: energyBanner,
  },
  {
    id: "ngali-mining",
    name: "Ngali Mining",
    description: "The Ngali Mining Company is interested in exploration, mining, processing and trading of minerals to benefit the Rwandan people, aiming to be a leader in production and transformation of natural resources through advanced technology.",
    image: ngaliMiningImg,
  },
  {
    id: "mediheal",
    name: "MEDIHEAL",
    description: "Mediheal Diagnostic and Fertility Center, based in Kigali, is a partnership between Ngali Holdings and the Mediheal Group of Hospitals in Kenya, providing world-class health care services in Rwanda.",
    image: mediheal,
  },
  {
    id: "locus-dynamics",
    name: "Locus Dynamics",
    description: "Locus Dynamics is a systems engineering and integration company with a focus on Aerospace & Robotics, Information Technology, and Homeland Security.",
    image: locusDynamics,
  },
  {
    id: "luna-smelter",
    name: "LuNa Smelter",
    description: "LuNa Smelter introduces eco-friendly business practices, combining cutting-edge ideas with abundant resource potential while minimizing harm to society and nature.",
    image: lunaSmelter,
  },
  {
    id: "trinity-metals",
    name: "Trinity Metals",
    description: "Trinity Metals is a responsible producer of tin, tungsten and tantalum, employing eco-conscious and ethical practices across every area of its operations.",
    image: trinity,
  },
];
export const homeContent = {
  heroTitle: "Building Together Sustainably",
  heroText: "Ngali Holdings is a Rwandan company investing in a wide range of industries across the continent of Africa. We are driven by the desire to see African markets grow and specialize in long-term, wide-scale infrastructure projects with a holistic focus.",
  slides: [
    { title: "Fostering Innovation", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero1 },
    { title: "Strategic Partnerships", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero2 },
    { title: "Local Empowerment", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero3 },
  ],
};
export interface TeamMember {
  name: string;
  role: string;
}

export const teamMembers: TeamMember[] = [
  { name: "Benjamin MUSHABE", role: "Chief Executive Officer" },
  { name: "Emmanuel MUVARA", role: "Chief Operation Officer" },
  { name: "Dr. William NTAMBARA", role: "Chief Legal Officer and Company Secretary" },
  { name: "Nadine UWERA", role: "Group Head of Internal Audit & Risk Management" },
  { name: "John NDUNGUTSE", role: "Group Head, Corporate Services" },
];

export const aboutContent = {
  vision: "Contribute to the solution of enhancing economic growth in Africa",
  mission: "With a special focus on Rwanda, invest in businesses that unlock economic potential and eliminate growth barriers in Africa",
  background: "In 2000, the Government of Rwanda developed Vision 2020, aiming to transform Rwanda into a middle-income country. To help realize this goal, a development company called Digitech Solutions was registered in 2010 to execute projects in the energy, IT, and healthcare sectors. In 2012, Digitech Solutions was rebranded and restructured into the investment holding company Ngali Holdings.",
  values: [
    { title: "Cohesion", text: "Commitment to a stronger, integrated, valuable, efficient economy." },
    { title: "Diversity", text: "Team diversity provides valuable insight and understanding of the challenges faced by citizens and the industry." },
    { title: "Talent", text: "Focus on development of people and knowledge to drive business growth." },
  ],
};
export const sectorsContent = {
  intro: "Ngali Holdings targets strategic sectors for development across Africa, with a focus on improving lives through diversified investment.",
  sectors: [
    { title: "Agriculture", text: "Improving commodity exchange and creating a financial platform to achieve food security and maximize farmer earnings through processing and mechanization.", image: agricultureImg },
    { title: "Mining", text: "Exploring and trading Rwanda's volcanic mineral deposits through mining, processing, and exporting initiatives.", image: miningImg },
    { title: "Transport", text: "Investing in aerospace, railways, canals, ports, and harbors to expand transportation infrastructure.", image: transportImg },
    { title: "Health", text: "Investing in healthcare and pharmaceuticals to improve health outcomes and access to medicine.", image: healthImg },
  ],
};


export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "kwibuka-31",
    title: "Ngali Holdings Staff Visit Gisozi Genocide Memorial in Honor of the 31st Commemoration",
    date: "June 12, 2025",
    category: "Community",
    excerpt: "As part of its annual remembrance activities, Ngali Holdings staff visited the Kigali Genocide Memorial in Gisozi to honor the 31st commemoration of the 1994 Genocide against the Tutsi.",
    content: "As part of its annual remembrance activities, Ngali Holdings staff visited the Kigali Genocide Memorial in Gisozi, where more than 250,000 victims of the 1994 Genocide against the Tutsi are laid to rest. This visit was held in line with the 31st commemoration, a time to honor the victims, reflect on the past, and renew our collective commitment to 'Never Again.' During this occasion, the CEO of Ngali Holdings delivered a heartfelt message to the team, emphasizing the importance of unity, reconciliation, and nation-building.",
    image: genocideMemorial,
  },
  {
    id: "vision-2020-partnership",
    title: "Supporting Rwanda's Vision 2020 Through Strategic Investment",
    date: "March 4, 2025",
    category: "Company news",
    excerpt: "Ngali Holdings continues to align its investment strategy with the Government of Rwanda's long-term development goals.",
    content: "Ngali Holdings continues to align its investment strategy with the Government of Rwanda's long-term development goals, with a particular focus on the ICT, transport, energy, health, and agricultural sectors. Through this alignment, the company aims to support job creation and economic growth in line with national priorities.",
    image: healthImg,
  },
  {
    id: "subsidiary-spotlight-mining",
    title: "Subsidiary Spotlight: Advancing Mineral Exploration with Ngali Mining",
    date: "January 18, 2025",
    category: "Subsidiaries",
    excerpt: "A closer look at how Ngali Mining is positioning itself as a leader in responsible mineral exploration and processing.",
    content: "Ngali Mining is interested in exploration, mining, processing and trading of Rwanda's volcanic mineral deposits to tap into the market for the benefit of the Rwandan people. The subsidiary seeks to be a regional leader in exploration, production, and the transformation of natural resources by providing high-quality service through the use of advanced technology.",
    image: miningImg,
  },
];