// Mock Dataset for Solved and Deployed Impact Challenges

export const MOCK_IMPACT_PROJECTS = [
  {
    id: "IMP-1024",
    challengeId: "CH-1024",
    title: "Crop Disease Detection System",
    domain: "Agriculture",
    category: "Agriculture",
    district: "Dumka",
    location: "Dumka, Jharkhand",
    problem:
      "Farmers were facing difficulty identifying crop diseases at an early stage, leading to significant yield reduction in paddy and maize crops.",
    fullProblem:
      "In the rural district of Dumka, over 850 smallholder farmers were experiencing up to 40% annual crop loss due to delayed detection of leaf blast and maize stem borer infestations. Traditional diagnostic methods required waiting days for agricultural field extension officers, by which time infections spread across contiguous plots.",
    problemSeverity: "Critical / High Loss",
    peopleAffected: 850,
    peopleBenefited: 720,
    solution: "AI + Computer Vision based crop disease detection system.",
    fullSolution:
      "An offline-first mobile application integrated with edge computer vision AI models trained on over 25,000 regional crop leaf images. Farmers can snap a photo with basic smartphone cameras to receive instant diagnostic feedback and localized organic/chemical treatment protocols within 30 seconds.",
    implementationStatus: "Successfully Implemented",
    statusBadge: "Successfully Deployed",
    growth: "27%",
    problemReduction: "68%",
    solutionAccuracy: "94%",
    villagesCovered: 12,
    adoptionRate: "88%",
    timeSaved: "4.5 Hours / Inspection",
    costReduction: "35% Pesticide Expenditure",
    successfulDetections: "9,400 / 10,000 cases",
    university: "XYZ University",
    industryPartner: "ABC Technologies",
    team: "AgriVision Student & Faculty Team (5 Members)",
    facultyMentor: "Dr. Rajesh Kumar Sharma",
    technologies: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "Data Analytics",
      "Progressive Web App (PWA)",
      "Edge AI",
    ],
    implementationDetails: {
      stage: "Fully Deployed & Scaled",
      period: "Jan 2025 - Aug 2026",
      usersCount: "850+ Active Farmers",
      villages: "12 Panchayats across Dumka Block",
      milestones: [
        {
          title: "Prototype",
          desc: "Developed custom lightweight ResNet model for mobile edge deployment.",
        },
        {
          title: "Testing",
          desc: "Lab validation with 2,500 sample leaves achieving 93.8% validation accuracy.",
        },
        {
          title: "Field Pilot",
          desc: "Deployed in 3 pilot villages with 150 target farmers over 1 crop season.",
        },
        {
          title: "Deployment",
          desc: "Full district rollout across 12 villages in partnership with Krishi Vigyan Kendra.",
        },
      ],
    },
    before: [
      "Manual disease identification taking 3 to 7 days",
      "Delayed detection causing up to 40% crop yield loss",
      "Excessive & ineffective chemical pesticide overuse",
      "Limited technical support and expert access in remote blocks",
    ],
    after: [
      "Instant AI-assisted disease diagnosis under 30 seconds",
      "Early detection reduced overall crop loss by 68%",
      "Targeted micro-pesticide treatment reducing costs by 35%",
      "Direct digital guidance for 720+ empowered smallholder farmers",
    ],
    feedback: [
      {
        id: 1,
        name: "Rameshwar Tudu",
        role: "Smallholder Farmer",
        location: "Dumka, Jharkhand",
        rating: 5,
        quote:
          "अब बीमारी की पहचान जल्दी हो जाती है और समय पर treatment शुरू कर सकते हैं। इससे मेरी फसल खराब होने से बच गई।",
        date: "August 2026",
      },
      {
        id: 2,
        name: "Sunita Devi",
        role: "Women Farmer Collective Lead",
        location: "Jama, Dumka",
        rating: 5,
        quote:
          "पहले कीटनाशक का खर्च बहुत ज्यादा होता था। ऐप के सही सुझाव से खर्च कम हुआ और पैदावार बढ़ी है।",
        date: "July 2026",
      },
      {
        id: 3,
        name: "Manoj Mahato",
        role: "Agricultural Extension Officer",
        location: "Dumka",
        rating: 5,
        quote:
          "The computer vision accuracy is impressive. It allows us to prioritize remote village visits where outbreaks are detected early.",
        date: "June 2026",
      },
    ],
    realWorldResult:
      "The solution helped 720 farmers identify crop diseases earlier, reduced crop losses by 68%, achieved 94% diagnostic accuracy, and cut pesticide expenditure by 35% across 12 villages in Dumka district.",
  },
  {
    id: "IMP-8091",
    challengeId: "CH-8091",
    title: "AI-Powered Traffic Signal Synchronization",
    domain: "Smart Infrastructure",
    category: "Smart Infrastructure",
    district: "Ranchi",
    location: "Ranchi, Jharkhand",
    problem:
      "Severe urban traffic congestion during peak hours along major arterial corridors caused significant transit delays, emergency ambulance blockages, and excess fuel consumption.",
    fullProblem:
      "Ranchi's rapid urban growth led to gridlock across 18 major junctions. Fixed-timer traffic signals could not adapt to dynamic vehicle density, causing average delay times of 42 minutes along the Main Road corridor during peak hours.",
    problemSeverity: "High Urban Impact",
    peopleAffected: 45000,
    peopleBenefited: 38000,
    solution:
      "Adaptive traffic light synchronization using IoT camera sensors and real-time density algorithms.",
    fullSolution:
      "Deployed smart edge-connected cameras at 18 intersections that feed vehicle counts into an adaptive reinforcement learning controller. Traffic signal cycle lengths adjust dynamically in real-time according to queue length and emergency vehicle priority signals.",
    implementationStatus: "Successfully Implemented",
    statusBadge: "Successfully Deployed",
    growth: "34%",
    problemReduction: "52%",
    solutionAccuracy: "96%",
    villagesCovered: 18,
    adoptionRate: "92%",
    timeSaved: "18 Mins / Commute",
    costReduction: "22% Vehicle Idle Fuel Consumption",
    successfulDetections: "142,000 / 148,000 vehicle counts",
    university: "BIT Mesra",
    industryPartner: "UrbanSmart Mobility Solutions",
    team: "TrafficVision Labs Team",
    facultyMentor: "Prof. S. K. Mitra",
    technologies: [
      "IoT Sensors",
      "Computer Vision",
      "Traffic Analytics",
      "Reinforcement Learning",
      "Edge Computing",
    ],
    implementationDetails: {
      stage: "Fully Deployed",
      period: "Mar 2025 - Jul 2026",
      usersCount: "45,000+ Daily Commuters",
      villages: "18 Critical Intersections, Ranchi Municipal Corporation",
      milestones: [
        {
          title: "Prototype",
          desc: "Simulation model designed using SUMO software with Ranchi road network topology.",
        },
        {
          title: "Testing",
          desc: "Benchmarking signal timing algorithms against historical flow data.",
        },
        {
          title: "Field Pilot",
          desc: "Pilot installation at 4 high-density junctions along Main Road.",
        },
        {
          title: "Deployment",
          desc: "Full corridor deployment across all 18 major intersections with Smart City Integration.",
        },
      ],
    },
    before: [
      "Fixed timer signals causing unnecessary green lights on empty lanes",
      "Average transit delay of 42 minutes along key corridors",
      "Ambulances and emergency vehicles stuck in bottleneck queues",
      "High carbon emissions and excessive fuel idle wastage",
    ],
    after: [
      "Dynamic cycle adjustments based on real-time camera vehicle counts",
      "Peak transit delay reduced by 52% to under 20 minutes",
      "Automated green wave corridor for emergency vehicles",
      "Estimated 22% reduction in idle fuel consumption district-wide",
    ],
    feedback: [
      {
        id: 1,
        name: "Vikram Anand",
        role: "Daily Commuter & Resident",
        location: "Ranchi",
        rating: 5,
        quote:
          "Main road traffic used to take 45 minutes every evening. Now traffic moves steadily without long bottleneck delays.",
        date: "August 2026",
      },
      {
        id: 2,
        name: "Dr. Ananya Roy",
        role: "Emergency Care Lead",
        location: "Ranchi Civil Hospital",
        rating: 5,
        quote:
          "The emergency green wave feature has saved critical minutes during ambulance transfers to trauma centers.",
        date: "July 2026",
      },
    ],
    realWorldResult:
      "The adaptive signal system benefited 38,000+ daily commuters, reduced peak transit delays by 52%, saved an average of 18 minutes per trip, and cut idle fuel consumption by 22% in Ranchi.",
  },
  {
    id: "IMP-4012",
    challengeId: "CH-4012",
    title: "IoT Groundwater Quality & Contamination Monitoring",
    domain: "Water & Sanitation",
    category: "Water & Sanitation",
    district: "Dhanbad",
    location: "Dhanbad, Jharkhand",
    problem:
      "High fluoride and heavy metal groundwater contamination in mining-adjacent areas posed severe health hazards to local drinking water consumers.",
    fullProblem:
      "Mining runoff in Dhanbad rural outskirts contaminated local borewell water supplies. Residents lacked real-time awareness of water purity, leading to skeletal fluorosis cases and waterborne illness.",
    problemSeverity: "Critical Health Risk",
    peopleAffected: 14200,
    peopleBenefited: 12800,
    solution:
      "Solar-powered IoT sensor nodes deployed across rural tube wells with automated water quality warning displays.",
    fullSolution:
      "Installed low-cost multi-parameter chemical sensor nodes in 35 public borewells that measure pH, total dissolved solids (TDS), fluoride, and turbidity every 15 minutes. Data is broadcasted to color-coded community digital displays and SMS alerts to village Jal Sahiya committees.",
    implementationStatus: "Successfully Implemented",
    statusBadge: "Successfully Deployed",
    growth: "41%",
    problemReduction: "76%",
    solutionAccuracy: "97%",
    villagesCovered: 24,
    adoptionRate: "95%",
    timeSaved: "Real-time Alerts",
    costReduction: "60% Waterborne Illness Treatments",
    successfulDetections: "48,500 / 50,000 continuous water samples",
    university: "IIT (ISM) Dhanbad",
    industryPartner: "CleanWater Innovators India",
    team: "HydroSense Student Research Team",
    facultyMentor: "Prof. Alok Banerjee",
    technologies: [
      "IoT Electrochemical Sensors",
      "Solar Micro-power",
      "LoRaWAN Mesh Network",
      "Telemetry Dashboard",
      "SMS Alert Gateway",
    ],
    implementationDetails: {
      stage: "Fully Deployed",
      period: "Feb 2025 - Aug 2026",
      usersCount: "12,800+ Rural Residents",
      villages: "24 Panchayats across Dhanbad Coalfield Belt",
      milestones: [
        {
          title: "Prototype",
          desc: "Calibrated multi-parameter electrochemical sensor probes for fluoride & TDS detection.",
        },
        {
          title: "Testing",
          desc: "Water testing comparative accuracy verified against NABL certified chemical laboratory.",
        },
        {
          title: "Field Pilot",
          desc: "5 solar-powered node deployments with local digital LED indicator boards.",
        },
        {
          title: "Deployment",
          desc: "Scaled to 35 borewell nodes covering 24 panchayats with direct Public Health Engineering Dept sync.",
        },
      ],
    },
    before: [
      "Undetected toxic groundwater contamination in public tube wells",
      "High incidence of fluorosis and gastrointestinal illness",
      "Water quality testing conducted only once a year manually",
      "Villagers unaware when borewell water became unsafe",
    ],
    after: [
      "Continuous 24/7 automated water purity monitoring",
      "Instant visual RED/GREEN indicators on public community pumps",
      "76% reduction in contaminated water consumption cases",
      "12,800 residents provided safe, monitored drinking water access",
    ],
    feedback: [
      {
        id: 1,
        name: "Shanti Hembrom",
        role: "Village Jal Sahiya Coordinator",
        location: "Dhanbad",
        rating: 5,
        quote:
          "अब नल पर लगा LED लाइट तुरंत बता देता है कि पानी पीने लायक है या नहीं। गांव के बच्चे बीमार होने से बच गए।",
        date: "August 2026",
      },
    ],
    realWorldResult:
      "Successfully deployed continuous water quality sensors across 24 villages, benefiting 12,800 residents, reducing waterborne illness exposure by 76%, and achieving 97% sensor diagnostic accuracy.",
  },
  {
    id: "IMP-5530",
    challengeId: "CH-5530",
    title: "Smart Cold-Chain Storage for Perishable Produce",
    domain: "Agritech & Logistics",
    category: "Agritech & Logistics",
    district: "Jamshedpur",
    location: "Jamshedpur, East Singhbhum",
    problem:
      "Perishable vegetable farmers faced post-harvest losses of up to 35% due to lack of affordable localized cold storage facilities.",
    fullProblem:
      "Small farmers growing tomatoes and leafy greens in East Singhbhum district had no access to refrigerated cold rooms. Forced distress sales at low prices or spoiled crops drastically reduced seasonal farm incomes.",
    problemSeverity: "Economic Loss",
    peopleAffected: 3200,
    peopleBenefited: 2850,
    solution:
      "Solar-assisted micro-cold storage chambers with IoT humidity and temperature remote optimization.",
    fullSolution:
      "Constructed decentralized 5-metric-ton solar-powered thermal battery cold storage units at local Mandis. Farmers can store produce for up to 21 days for a nominal fee while monitoring inventory and market prices via mobile app.",
    implementationStatus: "Successfully Implemented",
    statusBadge: "Successfully Deployed",
    growth: "29%",
    problemReduction: "71%",
    solutionAccuracy: "95%",
    villagesCovered: 16,
    adoptionRate: "89%",
    timeSaved: "21 Days Storage Shelf Life",
    costReduction: "35% Post-Harvest Produce Spoilage",
    successfulDetections: "1,250 tons stored successfully",
    university: "NIT Jamshedpur",
    industryPartner: "GreenCold AgriTech",
    team: "ThermalInnovate Team",
    facultyMentor: "Dr. R. C. Prasad",
    technologies: [
      "Solar Thermal Energy Storage",
      "IoT Temperature Monitoring",
      "Phase Change Materials (PCM)",
      "Mobile Booking Portal",
    ],
    implementationDetails: {
      stage: "Fully Deployed",
      period: "Jan 2025 - Jun 2026",
      usersCount: "2,850+ Vegetable Farmers",
      villages: "16 Panchayats in East Singhbhum",
      milestones: [
        {
          title: "Prototype",
          desc: "Designed Phase Change Material (PCM) thermal backup chamber requiring zero grid power overnight.",
        },
        {
          title: "Testing",
          desc: "Thermal retention testing maintaining 4°C to 8°C for 36 continuous off-grid hours.",
        },
        {
          title: "Field Pilot",
          desc: "Installed 1 micro cold room at Patamda vegetable hub.",
        },
        {
          title: "Deployment",
          desc: "Expanded to 6 micro cold storage hubs serving 16 regional farming villages.",
        },
      ],
    },
    before: [
      "Post-harvest vegetable spoilage reaching up to 35% within 48 hours",
      "Forced distress sales at under 20% of market value",
      "No electricity grid access for conventional cold storages",
      "Seasonal farmer poverty despite high crop production",
    ],
    after: [
      "Shelf-life of tomato & green produce extended from 2 days to 21 days",
      "71% reduction in post-harvest produce spoilage",
      "Farmers achieved 32% higher market realization prices",
      "2,850 farmers benefiting from 6 solar-powered Mandi units",
    ],
    feedback: [
      {
        id: 1,
        name: "Budhram Soren",
        role: "Tomato Farmer",
        location: "Patamda, Jamshedpur",
        rating: 5,
        quote:
          "पहले शाम तक टमाटर बेचना पड़ता था वर्ना सब सड़ जाता था। अब 15 दिन तक कोल्ड स्टोरेज में रखकर अच्छे दाम मिलने पर बेचते हैं।",
        date: "July 2026",
      },
    ],
    realWorldResult:
      "Constructed 6 solar micro-cold rooms benefiting 2,850 farmers, reducing crop spoilage by 71%, extending produce shelf-life to 21 days, and increasing farmer profit margins by 32%.",
  },
  {
    id: "IMP-9102",
    challengeId: "CH-9102",
    title: "Off-Grid Solar Microgrid Monitoring System",
    domain: "Renewable Energy",
    category: "Renewable Energy",
    district: "Hazaribagh",
    location: "Hazaribagh, Jharkhand",
    problem:
      "Remote tribal hamlets lacked stable electricity grid connectivity, leading to dark villages and disrupted evening education for children.",
    fullProblem:
      "In hilly forested terrain of Hazaribagh, 14 isolated tribal hamlets had no grid power connection. Previous standalone solar streetlights frequently broke down due to battery degradation without maintenance alerts.",
    problemSeverity: "Rural Infrastructure Gap",
    peopleAffected: 6400,
    peopleBenefited: 5900,
    solution:
      "Smart IoT-monitored solar microgrids with automated battery health diagnostic telemetry.",
    fullSolution:
      "Installed community solar microgrids (15 kWp per hamlet) powering household LED lighting, fan points, and digital learning centers. Smart telemetry hardware sends battery health, consumption metrics, and fault alerts directly to local maintenance technicians.",
    implementationStatus: "Successfully Implemented",
    statusBadge: "Successfully Deployed",
    growth: "45%",
    problemReduction: "82%",
    solutionAccuracy: "98%",
    villagesCovered: 14,
    adoptionRate: "97%",
    timeSaved: "24/7 Power Reliability",
    costReduction: "80% Kerosene Usage Replacement",
    successfulDetections: "99.2% Uptime maintained",
    university: "VBU Hazaribagh",
    industryPartner: "SunPower Rural Grids",
    team: "CleanEnergy Student Innovators",
    facultyMentor: "Dr. P. K. Verma",
    technologies: [
      "Solar PV Microgrid",
      "Lithium Iron Phosphate (LiFePO4)",
      "GSM Telemetry Nodes",
      "Automated Maintenance Ticketing",
    ],
    implementationDetails: {
      stage: "Fully Deployed",
      period: "Nov 2024 - May 2026",
      usersCount: "5,900+ Tribal Residents",
      villages: "14 Remote Hamlets",
      milestones: [
        {
          title: "Prototype",
          desc: "Built 5 kW modular microgrid controller with GSM telemetry.",
        },
        {
          title: "Testing",
          desc: "Load testing with village domestic power demands & battery discharge cycles.",
        },
        {
          title: "Field Pilot",
          desc: "First microgrid pilot in Katkamsandi hamlet providing 24/7 electricity.",
        },
        {
          title: "Deployment",
          desc: "Full 14 hamlet deployment with central state energy board dashboard integration.",
        },
      ],
    },
    before: [
      "Total darkness after sunset relying on hazardous kerosene lamps",
      "Children unable to study during evening hours",
      "Frequent battery breakdowns without technician visibility",
      "High household expenditure on kerosene fuel",
    ],
    after: [
      "Continuous 24/7 clean solar power for 1,100 households",
      "80% reduction in dangerous kerosene fuel usage",
      "Remote IoT fault detection maintaining 99.2% system uptime",
      "Evening digital education centers active across 14 hamlets",
    ],
    feedback: [
      {
        id: 1,
        name: "Pooja Kumari",
        role: "Class 10 Student",
        location: "Hazaribagh",
        rating: 5,
        quote:
          "अब रात में पढ़ाई करने में कोई दिक्कत नहीं होती। सोलर लाइट से हमारे गांव की तस्वीर बदल गई है।",
        date: "August 2026",
      },
    ],
    realWorldResult:
      "Electrified 14 remote hamlets benefiting 5,900 tribal residents, replacing 80% of kerosene consumption, and maintaining 99.2% uptime with IoT smart telemetry.",
  },
];

export const getAllImpactProjects = () => MOCK_IMPACT_PROJECTS;

export const getImpactProjectById = (id) =>
  MOCK_IMPACT_PROJECTS.find(
    (p) =>
      String(p.id).toLowerCase() === String(id).toLowerCase() ||
      String(p.challengeId).toLowerCase() === String(id).toLowerCase()
  );

export const searchImpactProjects = (locationQuery = "", domainQuery = "ALL") => {
  const q = locationQuery.trim().toLowerCase();
  return MOCK_IMPACT_PROJECTS.filter((p) => {
    const matchesLocation =
      !q ||
      p.district.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q);

    const matchesDomain =
      domainQuery === "ALL" ||
      p.domain.toLowerCase() === domainQuery.toLowerCase();

    return matchesLocation && matchesDomain;
  });
};
