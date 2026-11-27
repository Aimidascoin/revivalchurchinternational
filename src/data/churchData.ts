export interface Campus {
  id: string;
  name: string;
  city: string;
  country: string;
  tagline: string;
  address: string;
  coordinates: string;
  serviceTimes: { day: string; time: string; label: string }[];
  leadPastors: string;
  phone: string;
  email: string;
  features: string[];
}

export interface Ministry {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  meetingTime: string;
  leader: string;
  image?: string;
  badges: string[];
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string;
  date: string;
  duration: string;
  scripture: string;
  description: string;
  category: 'Prophetic' | 'Grace & Faith' | 'Holy Spirit' | 'Leadership' | 'Family';
  youtubeId: string;
  audioLength: string;
  keyPoints: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  featured: boolean;
  registrationOpen: boolean;
}

export interface Testimony {
  id: string;
  name: string;
  city: string;
  title: string;
  story: string;
  date: string;
  category: 'Healing' | 'Breakthrough' | 'Salvation' | 'Family';
}

export const CAMPUSES: Campus[] = [
  {
    id: 'sandton-hq',
    name: 'Johannesburg (HQ Campus)',
    city: 'Sandton, Johannesburg',
    country: 'South Africa',
    tagline: 'Main Apostolic Hub & Global Broadcasting Center',
    address: '104 Rivonia Road, Sandhurst, Sandton, 2196',
    coordinates: '-26.1076, 28.0567',
    serviceTimes: [
      { day: 'Sundays', time: '09:00 AM', label: 'Morning Encounter Service & Revival Kidz' },
      { day: 'Sundays', time: '17:00 PM', label: 'Evening Revival & Prophetic Impartation' },
      { day: 'Wednesdays', time: '19:00 PM', label: 'Midweek Miracle & Prayer Gathering' },
    ],
    leadPastors: 'Prophet Herbert & Pastor Shelma Mulondo',
    phone: '+27 (0) 11 884 9200',
    email: 'jhb@revivalchurchintl.org',
    features: ['Free Secure Parking', 'Full Revival Kidz Ministry (Ages 1-12)', 'Translations in French & Portuguese', 'Wheelchair Accessible', 'VIP First-Timer Lounge'],
  },
  {
    id: 'capetown',
    name: 'Cape Town Campus',
    city: 'Century City, Cape Town',
    country: 'South Africa',
    tagline: 'Revival by the Ocean',
    address: 'Victorian Towers, 1st Floor, Cnr Palm St & Durban Rd, Tygervalley / Century City',
    coordinates: '-33.8688, 18.6366',
    serviceTimes: [
      { day: 'Sundays', time: '09:30 AM', label: 'Celebration Service & Children’s Church' },
      { day: 'Sundays', time: '17:30 PM', label: 'Night of Worship & Word' },
      { day: 'Wednesdays', time: '18:30 PM', label: 'Midweek School of the Spirit' },
    ],
    leadPastors: 'Pastor Emmanuel & Grace Khumalo',
    phone: '+27 (0) 21 914 4300',
    email: 'capetown@revivalchurchintl.org',
    features: ['Underground Secure Parking', 'Revival Kidz Wing', 'Mother’s Cry Room with Audio Feed', 'Coffee Fellowship Hub'],
  },
  {
    id: 'ballito',
    name: 'Dolphin Coast Campus',
    city: 'Ballito, KwaZulu-Natal',
    country: 'South Africa',
    tagline: 'Awakening the East Coast',
    address: '15 Moffat Drive, Ballito Business Park, Dolphin Coast, 4420',
    coordinates: '-29.5312, 31.2144',
    serviceTimes: [
      { day: 'Sundays', time: '09:00 AM', label: 'Sunday Morning Encounter' },
      { day: 'Sundays', time: '17:00 PM', label: 'Prophetic Night Service' },
    ],
    leadPastors: 'Pastor Michael & Deborah Naidoo',
    phone: '+27 (0) 32 586 1120',
    email: 'ballito@revivalchurchintl.org',
    features: ['Easy Highway Access', 'Outdoor Fellowship Deck', 'Kids Check-in Security System'],
  },
  {
    id: 'london-uk',
    name: 'London Campus (UK)',
    city: 'Westminster, London',
    country: 'United Kingdom',
    tagline: 'Igniting Europe with Apostolic Fire',
    address: 'Storey’s Gate, Westminster, London SW1P 9NH',
    coordinates: '51.5002, -0.1306',
    serviceTimes: [
      { day: 'Sundays', time: '10:30 AM GMT', label: 'Sunday Divine Worship Service' },
      { day: 'Sundays', time: '16:00 PM GMT', label: 'European Prophetic Assembly' },
      { day: 'Thursdays', time: '19:30 PM GMT', label: 'Online UK Revival Groups' },
    ],
    leadPastors: 'Pastor Andrew & Olivia Sterling',
    phone: '+44 20 7930 4567',
    email: 'london@revivalchurchintl.org',
    features: ['Near Westminster Tube Station', 'Children’s Ministry', 'Translation Services Available'],
  },
  {
    id: 'atlanta-usa',
    name: 'Atlanta Campus (North America)',
    city: 'Buckhead, Atlanta, GA',
    country: 'United States',
    tagline: 'North American Revival Center',
    address: '3344 Peachtree Rd NE, Suite 800, Atlanta, GA 30326',
    coordinates: '33.8471, -84.3662',
    serviceTimes: [
      { day: 'Sundays', time: '10:00 AM EST', label: 'Sunday Morning Glory Encounter' },
      { day: 'Wednesdays', time: '19:00 PM EST', label: 'Believers Midweek Empowerment' },
    ],
    leadPastors: 'Pastor Marcus & Chloe Bennett',
    phone: '+1 (404) 555-0199',
    email: 'atlanta@revivalchurchintl.org',
    features: ['Complimentary Garage Parking', 'Unstoppablegenr Youth Hall', 'Broadcasting Lounge'],
  },
  {
    id: 'online-global',
    name: 'RCI Global Online Campus',
    city: 'Worldwide Streaming',
    country: 'Global',
    tagline: 'No Distance in the Spirit — Reaching Millions Worldwide',
    address: 'Streaming 24/7 on RCI App, YouTube, and RCI Web Player',
    coordinates: '0, 0',
    serviceTimes: [
      { day: 'Sundays', time: '09:00 AM CAT / GMT+2', label: 'Live Global Broadcast & Interactive Chat' },
      { day: 'Sundays', time: '17:00 PM CAT / GMT+2', label: 'Live Evening Encounter' },
      { day: 'Daily', time: '06:00 AM CAT', label: 'Global Morning Fire Prayer Altar' },
    ],
    leadPastors: 'Digital Campus Team & Virtual eGroup Shepherds',
    phone: '+27 (0) 11 884 9250',
    email: 'online@revivalchurchintl.org',
    features: ['Live Interactive Prayer Hosts', 'Over 120 Virtual eGroups in 32 Countries', 'Multilingual Subtitles', 'Digital Giving & Notes'],
  },
];

export const MINISTRIES: Ministry[] = [
  {
    id: 'youth-young-adults',
    title: 'Unstoppablegenr',
    category: 'Youth & Students',
    tagline: 'A Firebrand Generation Carrying Supernatural Power',
    description: 'Igniting teenagers, university students, and young professionals with uncompromised faith, passionate worship, and divine kingdom purpose.',
    meetingTime: 'Friday Nights 18:30 PM & Campus Rallies',
    leader: 'Pastor Joshua Ndlovu',
    badges: ['Campus Rallies', 'Creative Arts', 'Fire Gatherings'],
  },
  {
    id: 'usher-ministry',
    title: 'Usher Ministry',
    category: 'Hospitality & Protocols',
    tagline: 'Gatekeepers of the Lord’s Sanctuary & Divine Order',
    description: 'Welcoming worshippers with heavenly warmth, maintaining sanctuary reverence and order, assisting guests, and facilitating seamless services.',
    meetingTime: 'Sundays & Special Conferences',
    leader: 'Head Deacon Mark Sithole',
    badges: ['Sanctuary Protocols', 'VIP Greeting', 'Safety & Order'],
  },
  {
    id: 'revival-worship',
    title: 'Revival Worship Ministry',
    category: 'Music & Adoration',
    tagline: 'Prophetic Psalmists Ushering in Heavenly Glory',
    description: 'A dynamic company of vocalists, musicians, and songwriters ministering in spontaneous prophetic worship, breakthrough praise, and intimate adoration.',
    meetingTime: 'Thursday Rehearsals & Weekend Services',
    leader: 'Minister Caleb Meyer',
    badges: ['Prophetic Sound', 'Choir & Band', 'Worship Academy'],
  },
  {
    id: 'queen-reigning-women',
    title: 'Queen Reigning Women’s Ministry',
    category: 'Women',
    tagline: 'Daughters of the King Crowned in Grace & Power',
    description: 'A royal sisterhood of kingdom women walking in virtuous identity, prophetic intercession, family restoration, and entrepreneurial excellence.',
    meetingTime: 'Monthly Queen Summits & Weekly Sisterhood Circles',
    leader: 'Pastor Shelma Mulondo',
    badges: ['Royal Sisterhood', 'Annual Grace Conference', 'Mentorship'],
  },
  {
    id: 'children-church',
    title: 'Children Church Ministry',
    category: 'Children (Ages 1-12)',
    tagline: 'Raising Tomorrow’s Champions in Kingdom Truth',
    description: 'Safe, age-tailored environments where toddlers to pre-teens experience God’s love through illustrated Bible lessons, worship, and scripture memory.',
    meetingTime: 'Every Sunday during Morning Services',
    leader: 'Sister Rachel Adams & Certified Teachers',
    badges: ['Secure Check-in', 'Illustrated Bible', 'Kidz Praise'],
  },
  {
    id: 'supernatural-bible-school',
    title: 'Supernatural Bible School',
    category: 'Theological & Apostolic Training',
    tagline: 'Equipping Saints for Signs, Wonders & Ministry',
    description: 'Deep immersion in new-creation theology, the finished work of Christ, hearing God’s voice, healing miracles, and marketplace dominion.',
    meetingTime: 'Trimester Cohorts (In-Person & Online Certification)',
    leader: 'Prophet Herbert Mulondo & Faculty Deans',
    badges: ['Biblical Diploma', 'Miracle Impartation', 'Online Campus'],
  },
  {
    id: 'herbert-mulondo-compassion',
    title: 'Herbert Mulondo Compassion Foundation',
    category: 'Humanitarian & Benevolence',
    tagline: 'Demonstrating the Tangible Compassion of Jesus',
    description: 'Our dedicated humanitarian foundation reaching underprivileged families with monthly food hampers, educational bursaries, emergency shelters, and medical aid.',
    meetingTime: 'Weekly Food Distribution & Community Outreaches',
    leader: 'Foundation Directorate & Compassion Deacons',
    badges: ['Food Banking', 'Educational Bursaries', 'Community Haven'],
  },
  {
    id: 'dorcas-ministry',
    title: 'Dorcas Ministry',
    category: 'Welfare & Practical Charity',
    tagline: 'Full of Good Works and Charitable Deeds (Acts 9:36)',
    description: 'Providing clothing, blankets, baby care bundles, and vocational tailoring/sewing training to widows, single mothers, and vulnerable community members.',
    meetingTime: 'Wednesdays & First Saturdays of the Month',
    leader: 'Sister Tabitha Dlamini & Welfare Team',
    badges: ['Clothing Care', 'Widows Support', 'Vocational Training'],
  },
  {
    id: 'revival-groups',
    title: 'Revival Groups',
    category: 'Community Life & eGroups',
    tagline: 'Life-Giving Fellowships in Living Rooms & Zoom',
    description: 'Mid-week small group hubs meeting across suburbs and online to study the Word, pray, break bread, and build enduring covenant brotherhood.',
    meetingTime: 'Tuesdays & Wednesdays @ 19:00 PM',
    leader: 'Pastoral Oversight & Cell Leaders',
    badges: ['Suburban Hubs', 'Virtual eGroups', 'Pastoral Care'],
  },
  {
    id: 'media-video-ministry',
    title: 'Media & Video Ministry',
    category: 'Broadcast & Digital Technology',
    tagline: 'Broadcasting the Gospel to the Ends of the Earth',
    description: 'Operating 4K camera robotics, multi-track audio consoles, live satellite streaming, video editing, social media distribution, and lighting design.',
    meetingTime: 'Production Rotas for Live Services & Broadcasts',
    leader: 'Director Daniel Sterling',
    badges: ['4K Broadcast', 'Livestream Engineering', 'Creative Design'],
  },
  {
    id: 'knight-men-ministry',
    title: 'Knight Men Ministry',
    category: 'Men',
    tagline: 'Courageous Men of Valor Standing in Authority',
    description: 'Forging godly brotherhood, priestly fathers, and visionary business leaders through men’s fire camps, accountability roundtables, and prayer vigils.',
    meetingTime: 'Monthly Men’s Breakfasts & Saturday Huddles',
    leader: 'Elder Kevin Ndlovu & Men’s Council',
    badges: ['Spiritual Chivalry', 'Kingdom Fathers', 'Marketplace Kings'],
  },
];

export const PATHWAY_STEPS = [
  {
    step: 1,
    title: 'Connect & Welcome',
    duration: 'Week 1',
    headline: 'Your First Step into Family',
    description: 'Stop by the VIP Welcome Lounge after any Sunday service. Enjoy great coffee, meet friendly hosts, and receive your Welcome Gift Pack.',
    actionText: 'Plan a Sunday Visit',
  },
  {
    step: 2,
    title: 'Meet RCI & Senior Leaders',
    duration: 'Week 2',
    headline: 'Discover the Heart & Vision',
    description: 'An informal dessert reception with our campus pastors. Learn our history, core apostolic values, and what God has called this house to do.',
    actionText: 'Register for Next Reception',
  },
  {
    step: 3,
    title: 'Foundations 101',
    duration: 'Week 3',
    headline: 'Anchored in Grace & Word',
    description: 'A 2-session interactive module uncovering new-creation realities, righteousness by faith, water baptism, and spiritual authority in Christ.',
    actionText: 'Enroll in Foundations',
  },
  {
    step: 4,
    title: 'Join the V-Team (Serving)',
    duration: 'Week 4',
    headline: 'Uncovering Your Divine Design',
    description: 'Discover your unique spiritual gifts and passions. Shadow an active ministry team (worship, media, hospitality, kids, prayer) and find your fit.',
    actionText: 'View Serving Teams',
  },
  {
    step: 5,
    title: 'Empowerment 201',
    duration: 'Week 5',
    headline: 'Activated in the Holy Spirit',
    description: 'Deep dive into spiritual gifts, hearing the voice of God, praying in the Spirit, and practical demonstrations of love and divine power.',
    actionText: 'Join Next Cohort',
  },
  {
    step: 6,
    title: 'Full Commissioning',
    duration: 'Week 6',
    headline: 'Impacting Your Sphere of Influence',
    description: 'Celebration of completion! You are formally welcomed into the RCI covenant family, ready to lead an eGroup or minister in your career.',
    actionText: 'Celebrate Graduation',
  },
];

export const SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'Unstoppable Glory: Walking in Kingdom Dominion',
    speaker: 'Prophet Herbert Mulondo',
    series: 'Kingdom Dominion 2026',
    date: 'November 22, 2026',
    duration: '52 mins',
    scripture: 'Romans 8:31-39; Ephesians 1:17-23',
    description: 'A prophetic declaration on understanding the resurrection power at work within believers. You are not fighting for victory; you are enforcing victory from the heavenly places.',
    category: 'Prophetic',
    youtubeId: '',
    audioLength: '48.2 MB',
    keyPoints: [
      'The law of the Spirit of Life overrides every ancestral delay',
      'Operating as kings and priests in the marketplace',
      'The authority of the spoken Word aligned with heaven',
    ],
  },
  {
    id: 'sermon-2',
    title: 'The Grace Equation: Free from Striving',
    speaker: 'Pastor Shelma Mulondo',
    series: 'Pure Grace',
    date: 'November 15, 2026',
    duration: '46 mins',
    scripture: 'Galatians 2:20; 2 Corinthians 12:9',
    description: 'Discover how the unconditional love of Jesus frees the believer from performance anxiety, condemnation, and religious exhaustion into restful fruitfulness.',
    category: 'Grace & Faith',
    youtubeId: '',
    audioLength: '42.1 MB',
    keyPoints: [
      'Righteousness is a gift received, not a wage earned',
      'Resting in Christ’s finished work produces effortless holiness',
      'Breaking the spirit of condemnation over your mind',
    ],
  },
  {
    id: 'sermon-3',
    title: 'The Upper Room Flame: Cultivating Intimacy with the Spirit',
    speaker: 'Pastor Emmanuel Khumalo',
    series: 'Fire on the Altar',
    date: 'November 08, 2026',
    duration: '58 mins',
    scripture: 'Acts 2:1-4; 1 Corinthians 14:2-4',
    description: 'How to maintain personal revival through praying in the Holy Ghost, sensitivity to His promptings, and building a spiritual altar in your everyday home.',
    category: 'Holy Spirit',
    youtubeId: '',
    audioLength: '54.0 MB',
    keyPoints: [
      'The secret place is the birthplace of public power',
      'Building spiritual muscle through consistent praying in tongues',
      'Discerning the whisper of God in a noisy culture',
    ],
  },
  {
    id: 'sermon-4',
    title: 'Prophetic Strategy for Economic Shaking',
    speaker: 'Prophet Herbert Mulondo',
    series: 'Kingdom Dominion 2026',
    date: 'November 01, 2026',
    duration: '61 mins',
    scripture: 'Genesis 26:1-14; Isaiah 60:1-5',
    description: 'Isaac sowed in a famine year and reaped a hundredfold. Learn how kingdom covenant principles govern supernatural supply regardless of earthly trends.',
    category: 'Leadership',
    youtubeId: '',
    audioLength: '57.8 MB',
    keyPoints: [
      'Kingdom economics operate on the seed principle, not market inflation',
      'Heavenly downloads for innovation and problem solving',
      'The blessing that enriches and adds no sorrow',
    ],
  },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'event-grc2027',
    title: 'Global Revival Conference (GRC 2027)',
    date: 'March 17 - 20, 2027',
    time: '18:30 PM Daily & 09:00 AM Masterclasses',
    location: 'Sandton Convention Centre & RCI HQ, Johannesburg',
    category: 'Conference',
    description: 'Four life-defining days of high-voltage worship, apostolic impartation, healing, and prophetic ministry with international keynote speakers.',
    featured: true,
    registrationOpen: true,
  },
  {
    id: 'event-night-miracles',
    title: 'Night of Miracles & Prophetic Encounter',
    date: 'January 15, 2027',
    time: '19:00 PM - 23:00 PM',
    location: 'All Campuses (Simulcast Broadcast)',
    category: 'Miracle Service',
    description: 'An extended evening devoted to mass deliverance, physical healing, and accurate prophetic ministry for families and careers.',
    featured: true,
    registrationOpen: true,
  },
  {
    id: 'event-unstoppablegenr-fire',
    title: 'Unstoppablegenr Youth Fire Summit',
    date: 'February 06, 2027',
    time: '14:00 PM - 21:00 PM',
    location: 'Cape Town & Sandton Campuses',
    category: 'Youth',
    description: 'A catalytic one-day gathering for teenagers and university students featuring urban worship, breakout labs, and baptism rally.',
    featured: false,
    registrationOpen: true,
  },
  {
    id: 'event-vanguard-summit',
    title: 'Vanguard Men’s Leadership Breakfast',
    date: 'January 30, 2027',
    time: '08:00 AM - 11:30 AM',
    location: 'Dolphin Coast / Ballito Hub',
    category: 'Men',
    description: 'Keynote conversations on kingdom wealth creation, integrity in marriage, and raising godly sons in a broken world.',
    featured: false,
    registrationOpen: true,
  },
];

export const TESTIMONIES: Testimony[] = [
  {
    id: 'test-1',
    name: 'Sipho & Lindiwe M.',
    city: 'Johannesburg, South Africa',
    title: 'Stage 4 Cancer Vanished After Prophetic Prayer',
    story: 'During the July Miracle Encounter, Prophet Herbert spoke a specific word of knowledge regarding a lung affliction. When we returned for scans the following Tuesday, the medical specialist confirmed zero traces of malignancy. Jesus healed what doctors said was impossible!',
    date: 'August 2026',
    category: 'Healing',
  },
  {
    id: 'test-2',
    name: 'Tariro N.',
    city: 'London, United Kingdom',
    title: 'From Near-Bankruptcy to Multi-National Contract',
    story: 'Our logistics enterprise was facing liquidation. We sowed our last corporate seed into the RCI Vision Fund and committed to weekly Virtual eGroups. Within 45 days, God opened doors for an international supply contract exceeding £1.8M. Glory to God!',
    date: 'September 2026',
    category: 'Breakthrough',
  },
  {
    id: 'test-3',
    name: 'Kobus & Anri P.',
    city: 'Cape Town, South Africa',
    title: 'Broken Marriage Restored in Foundations 101',
    story: 'We were living in separate homes and had signed divorce papers. A colleague invited us to RCI Cape Town. The teaching on pure grace broke the bitter walls between us. Today we serve happily together on the V-Team, and our home is full of joy.',
    date: 'September 2026',
    category: 'Family',
  },
];

export const STATEMENT_OF_FAITH = [
  {
    title: 'The Holy Scriptures',
    summary: 'The Bible is the inspired, infallible, and authoritative Word of God, serving as the supreme rule of faith and conduct for all believers.',
  },
  {
    title: 'The Eternal Trinity',
    summary: 'One God, eternally existent in three co-equal persons: Father, Son, and Holy Spirit — the Creator and Sustainer of the entire universe.',
  },
  {
    title: 'Salvation by Pure Grace Through Faith',
    summary: 'Jesus Christ gave His life as a complete substitutionary sacrifice. Justification, forgiveness, and eternal life are received purely by grace through faith in Christ alone, not by works.',
  },
  {
    title: 'The Baptism & Gifts of the Holy Spirit',
    summary: 'The Holy Spirit indwells every believer and empowers them with supernatural gifts (prophecy, tongues, healing, miracles, wisdom) to be effective witnesses in this generation.',
  },
  {
    title: 'Divine Healing & Deliverance',
    summary: 'Deliverance and physical healing are provided for in the Atonement of Jesus Christ and are the privilege of every believer today.',
  },
  {
    title: 'The Church & The Great Commission',
    summary: 'The universal Church is the living body of Christ on earth. Every disciple is called to share the Gospel, heal the sick, establish godly families, and advance the Kingdom in society.',
  },
];

export const BANKING_DETAILS = {
  accountName: 'Revival Church International Non-Profit',
  bankName: 'First National Bank (FNB)',
  accountNumber: '62849921043',
  branchCode: '250655 (Sandton City)',
  accountType: 'Cheque / Current Account',
  swiftCode: 'FIRNZAJJXXX',
  referenceGuide: 'Initials + Surname + Designation (e.g. "Tithe", "VisionFund", "HopeMissions")',
};
