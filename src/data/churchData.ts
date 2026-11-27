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

export interface VideoTestimony {
  id: string;
  title: string;
  youtubeId: string;
}

export const CAMPUSES: Campus[] = [
  {
    id: 'paarl',
    name: 'Paarl Campus',
    city: 'Paarl, Western Cape',
    country: 'South Africa',
    tagline: 'Revival in the Cape Winelands',
    address: 'Paarl, Western Cape, South Africa',
    coordinates: '-33.7375, 18.9575',
    serviceTimes: [
      { day: 'Sundays', time: '09:00 AM', label: 'Morning Encounter Service & Revival Kidz' },
      { day: 'Sundays', time: '17:00 PM', label: 'Evening Revival & Prophetic Impartation' },
      { day: 'Wednesdays', time: '19:00 PM', label: 'Midweek Miracle & Prayer Gathering' },
    ],
    leadPastors: 'Prophet Herbert & Pastor Shelma Mulondo',
    phone: '+27 (0) 11 884 9200',
    email: 'paarl@revivalchurchintl.org',
    features: ['Free Secure Parking', 'Full Revival Kidz Ministry (Ages 1-12)', 'Wheelchair Accessible', 'VIP First-Timer Lounge'],
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

export const UPCOMING_EVENTS: EventItem[] = [];

export const VIDEO_TESTIMONIES: VideoTestimony[] = [
  {
    id: 'video-new-job-24-hours',
    title: 'A New Job Within 24 Hours',
    youtubeId: 'sBoMSnuaFWg',
  },
  {
    id: 'video-stage-2-cancer-healing',
    title: 'Stage 2 Cancer Healing',
    youtubeId: 'wIa5cHq6FAY',
  },
  {
    id: 'video-herbert-mulondo-ministration',
    title: 'Herbert Mulondo Ministration',
    youtubeId: 'EiZhcj83n0w',
  },
  {
    id: 'video-instant-miracle-no-crutches',
    title: 'Instant Miracle: No More Crutches',
    youtubeId: '6fJo_OXZazg',
  },
  {
    id: 'video-instant-healing-25-years-crutch',
    title: 'Instant Healing After 25 Years with a Crutch',
    youtubeId: 'hUUjYDpRBGc',
  },
];

export const TESTIMONIES: Testimony[] = [];

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
  accountNumber: '62834805098',
  branchCode: '250655',
  physicalAddress: '2nd Floor, 78 Market Street, Johannesburg, 2000',
  accountType: 'Cheque / Current Account',
  swiftCode: 'FIRNZAJJXXX',
  referenceGuide: 'Initials + Surname + Designation (e.g. "Tithe", "VisionFund", "HopeMissions")',
};

export interface LiveStreamConfig {
  /** YouTube live video id to embed. Leave empty until a broadcast is scheduled. */
  youtubeId: string;
  /** RTMP ingest endpoint used by OBS / hardware encoders. */
  rtmpIngestUrl: string;
  /** Where the stream key lives — never committed to source. */
  streamKeyEnv: string;
  /** Human readable broadcast schedule shown in the offline state. */
  schedule: string;
  /** Channel viewers are sent to for reminders and replays. */
  channelUrl: string;
}

export const LIVE_STREAM: LiveStreamConfig = {
  youtubeId: '',
  rtmpIngestUrl: 'rtmp://a.rtmp.youtube.com/live2',
  streamKeyEnv: 'YOUTUBE_STREAM_KEY (repo secret)',
  schedule: 'Sun 09:30 & 19:00 SAST · Midweek 19:00 SAST',
  channelUrl: 'https://www.youtube.com/@HerbertMulondo',
};
