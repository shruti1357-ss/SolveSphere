// Citizen-facing UI copy. Keep this catalog separate from Government / University / Industry portals.
// Every supported citizen language has its own report-form copy so changing the language
// switcher updates the complete 5-step reporting flow.

const ui = {
  en: {
    reportProblem:'Report a Problem',problem:'Problem',location:'Location',evidence:'Evidence',impact:'Impact',review:'Review',whatIsIt:'What is it?',whereIsIt:'Where is it?',photosVideos:'Photos / Videos',affectedPeople:'Affected People',confirmSubmit:'Confirm & Submit',stepDetails:'Step {{step}} of 5',details:'Details',next:'Next',previous:'Previous',edit:'Edit',problemTitle:'Problem Title',problemDescription:'Problem Description',describeVoice:'Describe by Voice',improveAi:'Improve with AI',improving:'Improving...',reportAnonymously:'Report Anonymously',hideProfile:'Hide your name from public view',institutionName:'Institution Name',department:'Department',campus:'Campus Name / Branch',governmentDepartment:'Government Department',districtMunicipality:'District / Municipality',address:'Address',cityState:'City / State',coordinates:'Coordinates',privacyMode:'Privacy Mode',deviceGps:'Device GPS Location',selectMap:'Select on Map',enterManually:'Enter Manually',clickDragPin:'Click or drag the pin',typeAddress:'Type address and landmark',locationPicker:'Location Picker',mapHint:'Click anywhere on the map to place the pin',privacyRadius:'500m Privacy Radius',selectedPoint:'Selected Point',state:'State',district:'District',selectDistrict:'Select District',blockArea:'Block / Area',latitude:'Latitude',longitude:'Longitude',approximateLocation:'Approximate Location / Privacy Protection',uploadedEvidence:'Uploaded Evidence',photoEvidence:'Photo Evidence',takePhoto:'Take Photo',uploadPhotos:'Upload Photos',noPhotos:'No photos attached yet',videoEvidence:'Video Evidence',recordVideo:'Record Video',uploadVideo:'Upload Video',noVideos:'No videos attached yet',delete:'Delete',cancel:'Cancel',snapPhoto:'Snap Photo',affectedPeopleDesc:'Enter an estimate of how many people are affected by this issue.',aiReport:'AI Problem Summary & Matching Report',confidence:'Confidence Score',classifiedCategory:'Classified Category',priority:'Priority Level',estimatedImpact:'Estimated Impact Level',recommendedCollaborators:'Recommended Collaborators',potentialSolutions:'Potential Solution Areas',formReview:'Form Review Summary',reviewDetails:'Review all details before final confirmation',whatProblem:'What is the Problem?',whereProblem:'Where is the Problem?',evidenceAttached:'Evidence Attached',estimatedImpactStep:'Estimated Impact',anonymousSubmission:'Anonymous Submission Requested',exactAddress:'Exact Address',enabledRadius:'Enabled (500m area radius)',notSpecified:'Not specified',editDetails:'Edit Details',uploading:'Uploading & Saving Report...',close:'Close',view:'View',viewDetails:'View Details',status:'Status',action:'Action',reportSubmitted:'Report Submitted',underAi:'Under AI Analysis',govValidation:'Government Validation',universityAssigned:'University Assigned',projectStarted:'Project Started',research:'Research / Development',deployed:'Solution Deployed',solved:'Problem Solved',completed:'Completed',current:'Current',upcoming:'Upcoming',reportedDetails:'Reported Problem Details',problemId:'Problem ID',category:'Category',submittedDate:'Submitted Date',description:'Description',noDescription:'No additional description provided.',emptyProblems:'You have not submitted any problems yet.',total:'Total',id:'ID',people:'People',language:'Language',selectWho:'Select Who Is Reporting',roleReporting:'Select who is reporting',citizen:'Citizen',university:'University',government:'Government',publicReporting:'Public Reporting',campusResearch:'Campus & R&D',officialCivic:'Official Civic',similarProblem:'Similar Problem Found Nearby!',duplicateWarning:'AI Duplicate Detection Warning',newProblemAnyway:'Report New Problem Anyway',supportExisting:'Support Existing Problem',uniqueProblemId:'Unique Problem ID',currentStatus:'Current Status',pendingSync:'Pending Sync',underReview:'Under Review',thankYou:'Thank You for Creating Impact!',reportSuccessMessage:'Your problem has been successfully reported and will now be reviewed and matched with relevant collaborators across SolveSphere.',ticketSummary:'Ticket Receipt Summary',problemTitleLabel:'Problem Title:',reportedLocationRole:'Reported Location & Role:',categoryPriority:'Category & Priority:',matchedCollaborators:'Matched Collaborators:',copyLink:'Copy Share Link',copied:'Ticket Link Copied!',reportAnother:'Report Another Problem',backToDashboard:'Back to Dashboard',universityPortal:'University Reporting Portal',universityPortalDesc:'Reporting on behalf of a college or educational institution. Specify campus & department details below.',governmentPortal:'Government Civic Authority Portal',governmentPortalDesc:'Official government issue registration. Provide district & department details below.',beConcise:'Be concise and specific so collaborators can instantly understand the core problem.',stopRecording:'Stop Recording',previousStep:'Previous',nextStep:'Next',enterAffected:'Enter estimated number of affected people (e.g. 500)',institutionPlaceholder:'e.g. RVS College of Engineering & Technology',departmentPlaceholder:'e.g. Computer Science & Engineering',campusPlaceholder:'e.g. Main Campus',govDeptPlaceholder:'e.g. Urban Development / Rural Development',districtPlaceholder:'e.g. Ranchi / Jamshedpur',problemPlaceholder:'Example: "Garbage is not being collected near our college"',descriptionPlaceholder:'Explain in detail: what happened, where it happened, who is affected, and what you think should be done.',addressPlaceholder:'e.g. Near University Gate No. 2, Main Road',cityPlaceholder:'e.g. Ranchi',blockPlaceholder:'e.g. Sadar / Mango / Jamshedpur',gpsPlaceholder:'GPS / Map selected',categoryPlaceholder:'e.g. Garbage Collection & Waste Dumping',tagPlaceholder:'Add custom tag (e.g. #sanitation) and press Enter',capturedPhoto:'Captured Photo Evidence',capturedPhotoNo:'Captured Evidence Photo #{{count}}',supportRedirect:'Redirecting to existing reported issue to add your support vote.',subcategory:'Subcategory (Optional)',problemTags:'Problem Tags'
  },
  hi: {
    reportProblem:'समस्या दर्ज करें',problem:'समस्या',location:'स्थान',evidence:'सबूत',impact:'प्रभाव',review:'जाँच',whatIsIt:'क्या समस्या है?',whereIsIt:'समस्या कहाँ है?',photosVideos:'फोटो / वीडियो',affectedPeople:'प्रभावित लोग',confirmSubmit:'पुष्टि करें और जमा करें',stepDetails:'चरण {{step}} / 5',details:'विवरण',next:'आगे',previous:'वापस',edit:'बदलें',problemTitle:'समस्या का नाम',problemDescription:'समस्या का विवरण',describeVoice:'आवाज़ से बताएं',improveAi:'AI से सुधारें',improving:'सुधार हो रहा है...',reportAnonymously:'गुमनाम रूप से दर्ज करें',hideProfile:'अपना नाम सार्वजनिक रूप से छिपाएं',institutionName:'संस्था का नाम',department:'विभाग',campus:'कैंपस / शाखा',governmentDepartment:'सरकारी विभाग',districtMunicipality:'जिला / नगर निकाय',address:'पता',cityState:'शहर / राज्य',coordinates:'निर्देशांक',privacyMode:'गोपनीयता मोड',deviceGps:'फोन की GPS लोकेशन',selectMap:'मानचित्र पर चुनें',enterManually:'खुद भरें',clickDragPin:'पिन को खींचें या क्लिक करें',typeAddress:'पता और पहचान की जगह लिखें',locationPicker:'स्थान चुनें',mapHint:'मानचित्र पर जगह चुनने के लिए क्लिक करें',privacyRadius:'500 मीटर गोपनीयता क्षेत्र',selectedPoint:'चुना हुआ स्थान',state:'राज्य',district:'जिला',selectDistrict:'जिला चुनें',blockArea:'ब्लॉक / क्षेत्र',latitude:'अक्षांश',longitude:'देशांतर',approximateLocation:'अनुमानित स्थान / गोपनीयता सुरक्षा',uploadedEvidence:'जमा किए गए सबूत',photoEvidence:'फोटो सबूत',takePhoto:'फोटो लें',uploadPhotos:'फोटो अपलोड करें',noPhotos:'अभी कोई फोटो नहीं',videoEvidence:'वीडियो सबूत',recordVideo:'वीडियो रिकॉर्ड करें',uploadVideo:'वीडियो अपलोड करें',noVideos:'अभी कोई वीडियो नहीं',delete:'हटाएं',cancel:'रद्द करें',snapPhoto:'फोटो लें',affectedPeopleDesc:'बताएं कि इस समस्या से लगभग कितने लोग प्रभावित हैं।',aiReport:'AI समस्या सारांश और मिलान रिपोर्ट',confidence:'विश्वास स्तर',classifiedCategory:'समस्या की श्रेणी',priority:'प्राथमिकता',estimatedImpact:'अनुमानित प्रभाव',recommendedCollaborators:'सुझाए गए सहयोगी',potentialSolutions:'संभावित समाधान क्षेत्र',formReview:'फॉर्म की जाँच',reviewDetails:'जमा करने से पहले सभी जानकारी जाँच लें',whatProblem:'समस्या क्या है?',whereProblem:'समस्या कहाँ है?',evidenceAttached:'जमा किए गए सबूत',estimatedImpactStep:'अनुमानित प्रभाव',anonymousSubmission:'गुमनाम रिपोर्ट',exactAddress:'सटीक पता',enabledRadius:'चालू (500 मीटर क्षेत्र)',notSpecified:'नहीं बताया गया',editDetails:'विवरण बदलें',uploading:'रिपोर्ट जमा हो रही है...',close:'बंद करें',view:'देखें',viewDetails:'विवरण देखें',status:'स्थिति',action:'कार्रवाई',reportSubmitted:'रिपोर्ट जमा हुई',underAi:'AI जाँच में',govValidation:'सरकारी जाँच',universityAssigned:'विश्वविद्यालय को भेजा गया',projectStarted:'काम शुरू हुआ',research:'अनुसंधान / विकास',deployed:'समाधान लागू हुआ',solved:'समस्या हल हुई',completed:'पूरा हुआ',current:'वर्तमान',upcoming:'आगे',reportedDetails:'रिपोर्ट की जानकारी',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा करने की तारीख',description:'विवरण',noDescription:'कोई अतिरिक्त विवरण नहीं दिया गया।',emptyProblems:'आपने अभी तक कोई समस्या दर्ज नहीं की है।',total:'कुल',id:'ID',people:'लोग',language:'भाषा',selectWho:'कौन रिपोर्ट कर रहा है चुनें',roleReporting:'रिपोर्ट करने वाला चुनें',citizen:'नागरिक',university:'विश्वविद्यालय',government:'सरकार',publicReporting:'सार्वजनिक रिपोर्ट',campusResearch:'कैंपस और शोध',officialCivic:'सरकारी रिपोर्ट',similarProblem:'पास में मिलती-जुलती समस्या मिली!',duplicateWarning:'AI डुप्लिकेट जाँच चेतावनी',newProblemAnyway:'फिर भी नई समस्या दर्ज करें',supportExisting:'मौजूदा समस्या का समर्थन करें',uniqueProblemId:'समस्या ID',currentStatus:'वर्तमान स्थिति',pendingSync:'सिंक बाकी है',underReview:'जाँच में',thankYou:'समस्या दर्ज करने के लिए धन्यवाद!',reportSuccessMessage:'आपकी समस्या सफलतापूर्वक दर्ज हो गई है। अब इसकी जाँच होगी और सही सहयोगियों से मिलाया जाएगा।',ticketSummary:'रिपोर्ट सारांश',problemTitleLabel:'समस्या का नाम:',reportedLocationRole:'रिपोर्ट की जगह और भूमिका:',categoryPriority:'श्रेणी और प्राथमिकता:',matchedCollaborators:'मिले हुए सहयोगी:',copyLink:'लिंक कॉपी करें',copied:'लिंक कॉपी हो गया!',reportAnother:'एक और समस्या दर्ज करें',backToDashboard:'डैशबोर्ड पर वापस जाएँ',universityPortal:'विश्वविद्यालय रिपोर्ट पोर्टल',universityPortalDesc:'कॉलेज या शैक्षणिक संस्था की ओर से रिपोर्ट करें। नीचे कैंपस और विभाग की जानकारी दें।',governmentPortal:'सरकारी नागरिक पोर्टल',governmentPortalDesc:'सरकारी समस्या दर्ज करें। नीचे जिला और विभाग की जानकारी दें।',beConcise:'समस्या को साफ और छोटा लिखें ताकि सहयोगी इसे तुरंत समझ सकें।',stopRecording:'रिकॉर्डिंग रोकें',previousStep:'पिछला',nextStep:'आगे',enterAffected:'प्रभावित लोगों की अनुमानित संख्या लिखें (जैसे 500)',institutionPlaceholder:'जैसे RVS College of Engineering & Technology',departmentPlaceholder:'जैसे Computer Science & Engineering',campusPlaceholder:'जैसे मुख्य कैंपस',govDeptPlaceholder:'जैसे शहरी विकास / ग्रामीण विकास',districtPlaceholder:'जैसे रांची / जमशेदपुर',problemPlaceholder:'उदाहरण: हमारे कॉलेज के पास कचरा नहीं उठाया जा रहा है',descriptionPlaceholder:'विस्तार से बताएं: क्या हुआ, कहाँ हुआ, कौन प्रभावित है और क्या किया जाना चाहिए।',addressPlaceholder:'जैसे यूनिवर्सिटी गेट नंबर 2 के पास, मेन रोड',cityPlaceholder:'जैसे रांची',blockPlaceholder:'जैसे सदर / मानगो / जमशेदपुर',gpsPlaceholder:'GPS / मानचित्र चुना गया',categoryPlaceholder:'जैसे कचरा संग्रह और कचरा फेंकना',tagPlaceholder:'कस्टम टैग लिखें (जैसे #sanitation) और Enter दबाएं',capturedPhoto:'फोटो सबूत',capturedPhotoNo:'सबूत फोटो #{{count}}',supportRedirect:'मौजूदा रिपोर्ट में आपका समर्थन जोड़ा जा रहा है।',subcategory:'उप-श्रेणी (वैकल्पिक)',problemTags:'समस्या के टैग', universityPortal:'विश्वविद्यालय रिपोर्ट पोर्टल', universityPortalDesc:'कॉलेज या शैक्षणिक संस्था की ओर से रिपोर्ट करें। नीचे कैंपस और विभाग की जानकारी दें।', governmentPortal:'सरकारी नागरिक पोर्टल', governmentPortalDesc:'सरकारी समस्या दर्ज करें। नीचे जिला और विभाग की जानकारी दें।'
  },
  bn: { language:'ভাষা', reportProblem:'সমস্যা জানান', problem:'সমস্যা', location:'অবস্থান', evidence:'প্রমাণ', impact:'প্রভাব', review:'পর্যালোচনা', whatIsIt:'সমস্যাটি কী?', whereIsIt:'সমস্যাটি কোথায়?', photosVideos:'ছবি / ভিডিও', affectedPeople:'প্রভাবিত মানুষ', confirmSubmit:'নিশ্চিত করে জমা দিন', stepDetails:'ধাপ {{step}} / ৫', details:'বিবরণ', next:'পরবর্তী', previous:'পিছনে', edit:'পরিবর্তন', problemTitle:'সমস্যার নাম', problemDescription:'সমস্যার বিবরণ', describeVoice:'কণ্ঠে বলুন', improveAi:'AI দিয়ে ঠিক করুন', improving:'উন্নত করা হচ্ছে...', reportAnonymously:'গোপনে জানান', hideProfile:'সবার কাছ থেকে আপনার নাম লুকান', institutionName:'প্রতিষ্ঠানের নাম', department:'বিভাগ', campus:'ক্যাম্পাস / শাখা', governmentDepartment:'সরকারি বিভাগ', districtMunicipality:'জেলা / পৌরসভা', address:'ঠিকানা', cityState:'শহর / রাজ্য', coordinates:'স্থানাঙ্ক', privacyMode:'গোপনীয়তা মোড', deviceGps:'ফোনের GPS অবস্থান', selectMap:'মানচিত্রে বাছুন', enterManually:'নিজে লিখুন', clickDragPin:'পিন ক্লিক বা টেনে নিন', typeAddress:'ঠিকানা ও পরিচিত স্থান লিখুন', locationPicker:'অবস্থান বাছাই', mapHint:'মানচিত্রে ক্লিক করে স্থান দিন', privacyRadius:'৫০০ মিটার গোপনীয়তা এলাকা', selectedPoint:'নির্বাচিত স্থান', state:'রাজ্য', district:'জেলা', selectDistrict:'জেলা বাছুন', blockArea:'ব্লক / এলাকা', latitude:'অক্ষাংশ', longitude:'দ্রাঘিমাংশ', approximateLocation:'আনুমানিক অবস্থান / গোপনীয়তা', uploadedEvidence:'জমা দেওয়া প্রমাণ', photoEvidence:'ছবির প্রমাণ', takePhoto:'ছবি তুলুন', uploadPhotos:'ছবি আপলোড করুন', noPhotos:'এখনও কোনো ছবি নেই', videoEvidence:'ভিডিও প্রমাণ', recordVideo:'ভিডিও রেকর্ড করুন', uploadVideo:'ভিডিও আপলোড করুন', noVideos:'এখনও কোনো ভিডিও নেই', delete:'মুছুন', cancel:'বাতিল', snapPhoto:'ছবি তুলুন', affectedPeopleDesc:'এই সমস্যায় আনুমানিক কতজন মানুষ প্রভাবিত তা লিখুন।', aiReport:'AI সমস্যা সারাংশ ও মিল রিপোর্ট', confidence:'বিশ্বাসের মাত্রা', classifiedCategory:'সমস্যার শ্রেণি', priority:'অগ্রাধিকার', estimatedImpact:'আনুমানিক প্রভাব', recommendedCollaborators:'প্রস্তাবিত সহযোগী', potentialSolutions:'সম্ভাব্য সমাধান', formReview:'ফর্ম পর্যালোচনা', reviewDetails:'জমা দেওয়ার আগে সব তথ্য দেখুন', whatProblem:'সমস্যাটি কী?', whereProblem:'সমস্যাটি কোথায়?', evidenceAttached:'প্রমাণ সংযুক্ত', estimatedImpactStep:'আনুমানিক প্রভাব', anonymousSubmission:'গোপন রিপোর্ট', exactAddress:'সঠিক ঠিকানা', enabledRadius:'চালু (৫০০ মিটার এলাকা)', notSpecified:'দেওয়া হয়নি', editDetails:'বিবরণ বদলান', uploading:'রিপোর্ট জমা ও সংরক্ষণ হচ্ছে...', close:'বন্ধ', view:'দেখুন', viewDetails:'বিবরণ দেখুন', status:'অবস্থা', action:'কাজ', reportSubmitted:'রিপোর্ট জমা হয়েছে', underAi:'AI যাচাই চলছে', govValidation:'সরকারি যাচাই', universityAssigned:'বিশ্ববিদ্যালয়ে পাঠানো হয়েছে', projectStarted:'কাজ শুরু হয়েছে', research:'গবেষণা / উন্নয়ন', deployed:'সমাধান চালু হয়েছে', solved:'সমস্যা সমাধান হয়েছে', completed:'সম্পূর্ণ', current:'বর্তমান', upcoming:'পরবর্তী', reportedDetails:'রিপোর্টের বিবরণ', problemId:'সমস্যা ID', category:'শ্রেণি', submittedDate:'জমার তারিখ', description:'বিবরণ', noDescription:'অতিরিক্ত বিবরণ দেওয়া হয়নি।', emptyProblems:'আপনি এখনও কোনো সমস্যা জানাননি।', total:'মোট', id:'ID', people:'জন', selectWho:'কে রিপোর্ট করছেন বাছুন', roleReporting:'রিপোর্টকারী বাছুন', citizen:'নাগরিক', university:'বিশ্ববিদ্যালয়', government:'সরকার', publicReporting:'সাধারণ রিপোর্ট', campusResearch:'ক্যাম্পাস ও গবেষণা', officialCivic:'সরকারি রিপোর্ট', similarProblem:'কাছাকাছি একই ধরনের সমস্যা পাওয়া গেছে!', duplicateWarning:'AI ডুপ্লিকেট সতর্কতা', newProblemAnyway:'তবুও নতুন সমস্যা জানান', supportExisting:'পুরনো সমস্যাকে সমর্থন করুন', uniqueProblemId:'সমস্যা ID', currentStatus:'বর্তমান অবস্থা', pendingSync:'সিঙ্ক বাকি', underReview:'পর্যালোচনাধীন', thankYou:'সমস্যা জানানোর জন্য ধন্যবাদ!', reportSuccessMessage:'আপনার সমস্যা সফলভাবে জানানো হয়েছে। এখন এটি যাচাই করে উপযুক্ত সহযোগীর সঙ্গে মিলানো হবে।', ticketSummary:'রিপোর্টের সারাংশ', problemTitleLabel:'সমস্যার নাম:', reportedLocationRole:'রিপোর্টের স্থান ও ভূমিকা:', categoryPriority:'শ্রেণি ও অগ্রাধিকার:', matchedCollaborators:'মিল পাওয়া সহযোগী:', copyLink:'লিংক কপি করুন', copied:'লিংক কপি হয়েছে!', reportAnother:'আরেকটি সমস্যা জানান', universityPortal:'বিশ্ববিদ্যালয় রিপোর্ট পোর্টাল', universityPortalDesc:'কলেজ বা শিক্ষা প্রতিষ্ঠানের পক্ষ থেকে রিপোর্ট করুন। নিচে ক্যাম্পাস ও বিভাগের তথ্য দিন।', governmentPortal:'সরকারি নাগরিক পোর্টাল', governmentPortalDesc:'সরকারি সমস্যা জানান। নিচে জেলা ও বিভাগের তথ্য দিন।', beConcise:'সমস্যাটি পরিষ্কার ও সংক্ষিপ্তভাবে লিখুন যাতে সহযোগীরা সহজে বুঝতে পারে।', stopRecording:'রেকর্ডিং বন্ধ করুন', previousStep:'আগের', nextStep:'পরবর্তী', enterAffected:'প্রভাবিত মানুষের আনুমানিক সংখ্যা লিখুন (যেমন ৫০০)', institutionPlaceholder:'যেমন RVS College of Engineering & Technology', departmentPlaceholder:'যেমন Computer Science & Engineering', campusPlaceholder:'যেমন মূল ক্যাম্পাস', govDeptPlaceholder:'যেমন নগর উন্নয়ন / গ্রামীণ উন্নয়ন', districtPlaceholder:'যেমন রাঁচি / জামশেদপুর', problemPlaceholder:'উদাহরণ: আমাদের কলেজের কাছে আবর্জনা সংগ্রহ করা হয় না', descriptionPlaceholder:'বিস্তারিত বলুন: কী হয়েছে, কোথায় হয়েছে, কে প্রভাবিত এবং কী করা উচিত।', addressPlaceholder:'যেমন ইউনিভার্সিটি গেট ২-এর কাছে, মেইন রোড', cityPlaceholder:'যেমন রাঁচি', blockPlaceholder:'যেমন সদর / ম্যাঙ্গো / জামশেদপুর', gpsPlaceholder:'GPS / মানচিত্র নির্বাচিত', categoryPlaceholder:'যেমন আবর্জনা সংগ্রহ ও ফেলা', tagPlaceholder:'কাস্টম ট্যাগ লিখুন (যেমন #sanitation) এবং Enter চাপুন', capturedPhoto:'ছবির প্রমাণ', capturedPhotoNo:'প্রমাণ ছবি #{{count}}', supportRedirect:'বিদ্যমান রিপোর্টে আপনার সমর্থন যোগ করা হচ্ছে।' },
  or: { language:'ଭାଷା', reportProblem:'ସମସ୍ୟା ଜଣାନ୍ତୁ', problem:'ସମସ୍ୟା', location:'ସ୍ଥାନ', evidence:'ପ୍ରମାଣ', impact:'ପ୍ରଭାବ', review:'ଯାଞ୍ଚ', whatIsIt:'ସମସ୍ୟାଟି କଣ?', whereIsIt:'ସମସ୍ୟାଟି କେଉଁଠି?', photosVideos:'ଫଟୋ / ଭିଡିଓ', affectedPeople:'ପ୍ରଭାବିତ ଲୋକ', confirmSubmit:'ନିଶ୍ଚିତ କରି ଦାଖଲ କରନ୍ତୁ', stepDetails:'ପଦକ୍ଷେପ {{step}} / ୫', details:'ବିବରଣୀ', next:'ପରବର୍ତ୍ତୀ', previous:'ପଛକୁ', edit:'ବଦଳାନ୍ତୁ', problemTitle:'ସମସ୍ୟାର ନାମ', problemDescription:'ସମସ୍ୟାର ବିବରଣୀ', describeVoice:'କଥାରେ କହନ୍ତୁ', improveAi:'AI ଦ୍ୱାରା ସୁଧାରନ୍ତୁ', improving:'ସୁଧାରୁଛି...', reportAnonymously:'ଗୋପନୀୟ ଭାବେ ଜଣାନ୍ତୁ', hideProfile:'ସାର୍ବଜନୀନ ଦୃଶ୍ୟରୁ ଆପଣଙ୍କ ନାମ ଲୁଚାନ୍ତୁ', institutionName:'ସଂସ୍ଥାର ନାମ', department:'ବିଭାଗ', campus:'କ୍ୟାମ୍ପସ / ଶାଖା', governmentDepartment:'ସରକାରୀ ବିଭାଗ', districtMunicipality:'ଜିଲ୍ଲା / ପୌରସଂସ୍ଥା', address:'ଠିକଣା', cityState:'ସହର / ରାଜ୍ୟ', coordinates:'ସ୍ଥାନାଙ୍କ', privacyMode:'ଗୋପନୀୟତା ମୋଡ୍', deviceGps:'ଫୋନ୍ GPS ସ୍ଥାନ', selectMap:'ମାନଚିତ୍ରରେ ବାଛନ୍ତୁ', enterManually:'ନିଜେ ଲେଖନ୍ତୁ', clickDragPin:'ପିନ୍ କ୍ଲିକ୍ କିମ୍ବା ଟାଣନ୍ତୁ', typeAddress:'ଠିକଣା ଓ ପରିଚିତ ସ୍ଥାନ ଲେଖନ୍ତୁ', locationPicker:'ସ୍ଥାନ ବାଛନ୍ତୁ', mapHint:'ମାନଚିତ୍ରରେ କ୍ଲିକ୍ କରି ସ୍ଥାନ ଦିଅନ୍ତୁ', privacyRadius:'୫୦୦ ମିଟର ଗୋପନୀୟତା ଅଞ୍ଚଳ', selectedPoint:'ବଛା ସ୍ଥାନ', state:'ରାଜ୍ୟ', district:'ଜିଲ୍ଲା', selectDistrict:'ଜିଲ୍ଲା ବାଛନ୍ତୁ', blockArea:'ବ୍ଲକ୍ / ଅଞ୍ଚଳ', latitude:'ଅକ୍ଷାଂଶ', longitude:'ଦ୍ରାଘିମାଂଶ', approximateLocation:'ଆନୁମାନିକ ସ୍ଥାନ / ଗୋପନୀୟତା', uploadedEvidence:'ଦିଆଯାଇଥିବା ପ୍ରମାଣ', photoEvidence:'ଫଟୋ ପ୍ରମାଣ', takePhoto:'ଫଟୋ ନିଅନ୍ତୁ', uploadPhotos:'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ', noPhotos:'ଏପର୍ଯ୍ୟନ୍ତ ଫଟୋ ନାହିଁ', videoEvidence:'ଭିଡିଓ ପ୍ରମାଣ', recordVideo:'ଭିଡିଓ ରେକର୍ଡ କରନ୍ତୁ', uploadVideo:'ଭିଡିଓ ଅପଲୋଡ୍ କରନ୍ତୁ', noVideos:'ଏପର୍ଯ୍ୟନ୍ତ ଭିଡିଓ ନାହିଁ', delete:'ଡିଲିଟ୍', cancel:'ବାତିଲ୍', snapPhoto:'ଫଟୋ ନିଅନ୍ତୁ', affectedPeopleDesc:'ଏହି ସମସ୍ୟାରେ ପ୍ରାୟ କେତେ ଲୋକ ପ୍ରଭାବିତ ହେଉଛନ୍ତି ଲେଖନ୍ତୁ।', aiReport:'AI ସମସ୍ୟା ସାରାଂଶ ଓ ମେଳ ରିପୋର୍ଟ', confidence:'ବିଶ୍ୱାସ ସ୍ତର', classifiedCategory:'ସମସ୍ୟା ଶ୍ରେଣୀ', priority:'ପ୍ରାଥମିକତା', estimatedImpact:'ଆନୁମାନିକ ପ୍ରଭାବ', recommendedCollaborators:'ପ୍ରସ୍ତାବିତ ସହଯୋଗୀ', potentialSolutions:'ସମ୍ଭାବ୍ୟ ସମାଧାନ', formReview:'ଫର୍ମ ଯାଞ୍ଚ', reviewDetails:'ଶେଷରେ ଦାଖଲ ପୂର୍ବରୁ ସମସ୍ତ ବିବରଣୀ ଦେଖନ୍ତୁ', whatProblem:'ସମସ୍ୟା କଣ?', whereProblem:'ସମସ୍ୟା କେଉଁଠି?', evidenceAttached:'ପ୍ରମାଣ ଯୋଡାଯାଇଛି', estimatedImpactStep:'ଆନୁମାନିକ ପ୍ରଭାବ', anonymousSubmission:'ଗୋପନୀୟ ରିପୋର୍ଟ', exactAddress:'ସଠିକ୍ ଠିକଣା', enabledRadius:'ଚାଲୁ (୫୦୦ ମିଟର ଅଞ୍ଚଳ)', notSpecified:'ଦିଆଯାଇନାହିଁ', editDetails:'ବିବରଣୀ ବଦଳାନ୍ତୁ', uploading:'ରିପୋର୍ଟ ଦାଖଲ ଓ ସଂରକ୍ଷଣ ହେଉଛି...', close:'ବନ୍ଦ', view:'ଦେଖନ୍ତୁ', viewDetails:'ବିବରଣୀ ଦେଖନ୍ତୁ', status:'ସ୍ଥିତି', action:'କାର୍ଯ୍ୟ', reportSubmitted:'ରିପୋର୍ଟ ଦାଖଲ ହୋଇଛି', underAi:'AI ଯାଞ୍ଚରେ', govValidation:'ସରକାରୀ ଯାଞ୍ଚ', universityAssigned:'ବିଶ୍ୱବିଦ୍ୟାଳୟକୁ ପଠାଯାଇଛି', projectStarted:'କାମ ଆରମ୍ଭ', research:'ଗବେଷଣା / ବିକାଶ', deployed:'ସମାଧାନ ଲାଗୁ ହୋଇଛି', solved:'ସମସ୍ୟା ସମାଧାନ', completed:'ସମ୍ପୂର୍ଣ୍ଣ', current:'ବର୍ତ୍ତମାନ', upcoming:'ପରବର୍ତ୍ତୀ', reportedDetails:'ରିପୋର୍ଟ ବିବରଣୀ', problemId:'ସମସ୍ୟା ID', category:'ଶ୍ରେଣୀ', submittedDate:'ଦାଖଲ ତାରିଖ', description:'ବିବରଣୀ', noDescription:'ଅତିରିକ୍ତ ବିବରଣୀ ନାହିଁ।', emptyProblems:'ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସମସ୍ୟା ଜଣାଇନାହାନ୍ତି।', total:'ମୋଟ', id:'ID', people:'ଲୋକ', selectWho:'କିଏ ରିପୋର୍ଟ କରୁଛନ୍ତି ବାଛନ୍ତୁ', roleReporting:'ରିପୋର୍ଟକାରୀ ବାଛନ୍ତୁ', citizen:'ନାଗରିକ', university:'ବିଶ୍ୱବିଦ୍ୟାଳୟ', government:'ସରକାର', publicReporting:'ସାଧାରଣ ରିପୋର୍ଟ', campusResearch:'କ୍ୟାମ୍ପସ ଓ ଗବେଷଣା', officialCivic:'ସରକାରୀ ରିପୋର୍ଟ', similarProblem:'ନିକଟରେ ସମାନ ସମସ୍ୟା ମିଳିଛି!', duplicateWarning:'AI ଡୁପ୍ଲିକେଟ୍ ସତର୍କତା', newProblemAnyway:'ତଥାପି ନୂଆ ସମସ୍ୟା ଜଣାନ୍ତୁ', supportExisting:'ପୁରୁଣା ସମସ୍ୟାକୁ ସମର୍ଥନ କରନ୍ତୁ', uniqueProblemId:'ସମସ୍ୟା ID', currentStatus:'ବର୍ତ୍ତମାନ ସ୍ଥିତି', pendingSync:'ସିଙ୍କ ବାକି', underReview:'ଯାଞ୍ଚରେ', thankYou:'ସମସ୍ୟା ଜଣାଇଥିବାରୁ ଧନ୍ୟବାଦ!', reportSuccessMessage:'ଆପଣଙ୍କ ସମସ୍ୟା ସଫଳତାର ସହ ଦାଖଲ ହୋଇଛି। ଏବେ ଯାଞ୍ଚ ହୋଇ ଠିକ୍ ସହଯୋଗୀଙ୍କ ସହ ମେଳ ହେବ।', ticketSummary:'ରିପୋର୍ଟ ସାରାଂଶ', problemTitleLabel:'ସମସ୍ୟାର ନାମ:', reportedLocationRole:'ରିପୋର୍ଟ ସ୍ଥାନ ଓ ଭୂମିକା:', categoryPriority:'ଶ୍ରେଣୀ ଓ ପ୍ରାଥମିକତା:', matchedCollaborators:'ମିଳିଥିବା ସହଯୋଗୀ:', copyLink:'ଲିଙ୍କ କପି କରନ୍ତୁ', copied:'ଲିଙ୍କ କପି ହୋଇଛି!', reportAnother:'ଆଉ ଏକ ସମସ୍ୟା ଜଣାନ୍ତୁ', universityPortal:'ବିଶ୍ୱବିଦ୍ୟାଳୟ ରିପୋର୍ଟ ପୋର୍ଟାଲ', universityPortalDesc:'କଲେଜ୍ କିମ୍ବା ଶିକ୍ଷା ସଂସ୍ଥା ପକ୍ଷରୁ ରିପୋର୍ଟ କରନ୍ତୁ। ତଳେ କ୍ୟାମ୍ପସ ଓ ବିଭାଗ ତଥ୍ୟ ଦିଅନ୍ତୁ।', governmentPortal:'ସରକାରୀ ନାଗରିକ ପୋର୍ଟାଲ', governmentPortalDesc:'ସରକାରୀ ସମସ୍ୟା ଜଣାନ୍ତୁ। ତଳେ ଜିଲ୍ଲା ଓ ବିଭାଗ ତଥ୍ୟ ଦିଅନ୍ତୁ।', beConcise:'ସମସ୍ୟାକୁ ସ୍ପଷ୍ଟ ଓ ଛୋଟ କରି ଲେଖନ୍ତୁ ଯାହାଦ୍ୱାରା ସହଯୋଗୀମାନେ ସହଜରେ ବୁଝିପାରିବେ।', stopRecording:'ରେକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ', previousStep:'ପୂର୍ବରୁ', nextStep:'ପରବର୍ତ୍ତୀ', enterAffected:'ପ୍ରଭାବିତ ଲୋକଙ୍କ ଆନୁମାନିକ ସଂଖ୍ୟା ଲେଖନ୍ତୁ (ଯେପରି ୫୦୦)', institutionPlaceholder:'ଯେପରି RVS College of Engineering & Technology', departmentPlaceholder:'ଯେପରି Computer Science & Engineering', campusPlaceholder:'ଯେପରି ମୁଖ୍ୟ କ୍ୟାମ୍ପସ', govDeptPlaceholder:'ଯେପରି ନଗର ଉନ୍ନୟନ / ଗ୍ରାମୀଣ ଉନ୍ନୟନ', districtPlaceholder:'ଯେପରି ରାଞ୍ଚି / ଜାମସେଦପୁର', problemPlaceholder:'ଉଦାହରଣ: ଆମ କଲେଜ୍ ପାଖରେ ଆବର୍ଜନା ଉଠାଯାଉନାହିଁ', descriptionPlaceholder:'ବିସ୍ତାରରେ କହନ୍ତୁ: କଣ ଘଟିଲା, କେଉଁଠି, କିଏ ପ୍ରଭାବିତ ଏବଂ କଣ କରିବା ଉଚିତ।', addressPlaceholder:'ଯେପରି ୟୁନିଭର୍ସିଟି ଗେଟ୍ ୨ ପାଖରେ, ମେନ୍ ରୋଡ୍', cityPlaceholder:'ଯେପରି ରାଞ୍ଚି', blockPlaceholder:'ଯେପରି ସଦର / ମାଙ୍ଗୋ / ଜାମସେଦପୁର', gpsPlaceholder:'GPS / ମାନଚିତ୍ର ବଛାଯାଇଛି', categoryPlaceholder:'ଯେପରି ଆବର୍ଜନା ସଂଗ୍ରହ ଓ ଫେଙ୍ଗିବା', tagPlaceholder:'କଷ୍ଟମ୍ ଟ୍ୟାଗ୍ ଲେଖନ୍ତୁ (ଯେପରି #sanitation) ଏବଂ Enter ଦବାନ୍ତୁ', capturedPhoto:'ଫଟୋ ପ୍ରମାଣ', capturedPhotoNo:'ପ୍ରମାଣ ଫଟୋ #{{count}}', supportRedirect:'ପୁରୁଣା ରିପୋର୍ଟରେ ଆପଣଙ୍କ ସମର୍ଥନ ଯୋଡାଯାଉଛି।',subcategory:'ଉପ-ଶ୍ରେଣୀ (ଇଚ୍ଛାଧୀନ)',problemTags:'ସମସ୍ୟା ଟ୍ୟାଗ୍' },
  sat: {}, ho: {}, nag: {}, kur: {}, kho: {}, mul: {}
};

// Concise, citizen-friendly wording for the Jharkhand regional-language options.
const regional = {
  sat: { language:'ᱵᱷᱟᱥᱟ', reportProblem:'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ', problem:'ᱥᱚᱢᱚᱥᱭᱟ', location:'ᱡᱟᱭᱜᱟ', evidence:'ᱯᱨᱚᱢᱟᱱ', impact:'ᱯᱨᱚᱵᱷᱟᱵ', review:'ᱧᱮᱞ', whatIsIt:'ᱥᱚᱢᱚᱥᱭᱟ ᱪᱮᱫ?', whereIsIt:'ᱥᱚᱢᱚᱥᱭᱟ ᱚᱠᱟᱨᱮ?', photosVideos:'ᱪᱤᱛᱟᱹᱨ / ᱵᱷᱤᱰᱤᱭᱚ', affectedPeople:'ᱯᱨᱚᱵᱷᱟᱵᱤᱛ ᱦᱚᱲ', confirmSubmit:'ᱱᱤᱥᱪᱤᱛ ᱟᱨ ᱡᱚᱢᱟ', stepDetails:'ᱫᱟᱯ {{step}} / ᱕', details:'ᱵᱤᱵᱨᱚᱱ', next:'ᱞᱟᱦᱟ', previous:'ᱛᱟᱭᱚᱢ', edit:'ᱵᱚᱫᱚᱞ', problemTitle:'ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ', problemDescription:'ᱥᱚᱢᱚᱥᱭᱟ ᱵᱤᱵᱨᱚᱱ', describeVoice:'ᱟᱹᱲᱟᱹ ᱛᱮ ᱞᱟᱹᱭ', improveAi:'AI ᱛᱮ ᱥᱩᱫᱷᱨᱟᱹ', improving:'ᱥᱩᱫᱷᱨᱟᱹ ᱦᱚᱭᱚᱜ...', reportAnonymously:'ᱵᱮᱱᱟᱢ ᱛᱮ ᱞᱟᱹᱭ', hideProfile:'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱩᱠᱟᱹᱭ ᱢᱮ', institutionName:'ᱥᱚᱝᱥᱛᱷᱟ ᱧᱩᱛᱩᱢ', department:'ᱵᱷᱟᱜ', campus:'ᱠᱮᱢᱯᱟᱥ / ᱥᱟᱠᱷᱟ', governmentDepartment:'ᱥᱚᱨᱠᱟᱨᱤ ᱵᱷᱟᱜ', districtMunicipality:'ᱡᱤᱞᱟ / ᱱᱚᱜᱚᱨ', address:'ᱴᱷᱤᱠᱟᱱᱟ', cityState:'ᱥᱟᱦᱟᱨ / ᱨᱟᱡᱽᱭ', coordinates:'ᱠᱚᱨᱰᱤᱱᱮᱴ', privacyMode:'ᱜᱚᱯᱚᱱᱤᱭᱟ ᱢᱚᱰ', deviceGps:'ᱯᱷᱚᱱ GPS ᱡᱟᱭᱜᱟ', selectMap:'ᱱᱟᱠᱷᱟ ᱨᱮ ᱵᱟᱪᱷᱟᱣ', enterManually:'ᱱᱤᱡᱮ ᱚᱞ', clickDragPin:'ᱯᱤᱱ ᱨᱮ ᱠᱞᱤᱠ ᱟᱨ ᱴᱟᱱ', typeAddress:'ᱴᱷᱤᱠᱟᱱᱟ ᱚᱞ', locationPicker:'ᱡᱟᱭᱜᱟ ᱵᱟᱪᱷᱟᱣ', mapHint:'ᱱᱟᱠᱷᱟ ᱨᱮ ᱠᱞᱤᱠ ᱢᱮ', privacyRadius:'᱕᱐᱐ ᱢᱤᱴᱟᱨ ᱜᱚᱯᱚᱱᱤᱭᱟ ᱮᱞᱟᱠᱟ', selectedPoint:'ᱵᱟᱪᱷᱟᱣ ᱡᱟᱭᱜᱟ', state:'ᱨᱟᱡᱽᱭ', district:'ᱡᱤᱞᱟ', selectDistrict:'ᱡᱤᱞᱟ ᱵᱟᱪᱷᱟᱣ', blockArea:'ᱵᱞᱚᱠ / ᱮᱞᱟᱠᱟ', latitude:'ᱞᱮᱛᱟ', longitude:'ᱞᱚᱝᱜᱤᱛᱟ', approximateLocation:'ᱩᱢᱟᱱ ᱡᱟᱭᱜᱟ / ᱜᱚᱯᱚᱱᱤᱭᱟ', uploadedEvidence:'ᱡᱚᱢᱟ ᱯᱨᱚᱢᱟᱱ', photoEvidence:'ᱪᱤᱛᱟᱹᱨ ᱯᱨᱚᱢᱟᱱ', takePhoto:'ᱪᱤᱛᱟᱹᱨ ᱞᱮ', uploadPhotos:'ᱪᱤᱛᱟᱹᱨ ᱟᱯᱞᱚᱰ', noPhotos:'ᱱᱤᱛᱚᱜ ᱪᱤᱛᱟᱹᱨ ᱵᱟᱝ', videoEvidence:'ᱵᱷᱤᱰᱤᱭᱚ ᱯᱨᱚᱢᱟᱱ', recordVideo:'ᱵᱷᱤᱰᱤᱭᱚ ᱨᱮᱠᱚᱨᱰ', uploadVideo:'ᱵᱷᱤᱰᱤᱭᱚ ᱟᱯᱞᱚᱰ', noVideos:'ᱱᱤᱛᱚᱜ ᱵᱷᱤᱰᱤᱭᱚ ᱵᱟᱝ', delete:'ᱢᱮᱴᱟᱣ', cancel:'ᱵᱟᱹᱛᱤᱞ', snapPhoto:'ᱪᱤᱛᱟᱹᱨ ᱞᱮ', affectedPeopleDesc:'ᱱᱚᱣᱟ ᱥᱚᱢᱚᱥᱭᱟ ᱛᱮ ᱚᱠᱟ ᱦᱚᱲ ᱯᱨᱚᱵᱷᱟᱵᱤᱛ ᱮᱱᱟ ᱚᱞ ᱢᱮ।', aiReport:'AI ᱥᱚᱢᱚᱥᱭᱟ ᱥᱟᱨᱟᱝᱥ ᱟᱨ ᱢᱮᱞ', confidence:'ᱵᱷᱚᱨᱚᱥᱟ ᱥᱠᱳᱨ', classifiedCategory:'ᱥᱚᱢᱚᱥᱭᱟ ᱥᱨᱮᱱᱤ', priority:'ᱡᱟᱹᱨᱩᱲᱤ', estimatedImpact:'ᱩᱢᱟᱱ ᱯᱨᱚᱵᱷᱟᱵ', recommendedCollaborators:'ᱞᱟᱦᱟᱣ ᱥᱟᱞᱟᱜ', potentialSolutions:'ᱥᱟᱢᱵᱷᱟᱵᱤᱛ ᱥᱚᱢᱟᱫᱷᱟᱱ', formReview:'ᱯᱷᱚᱨᱢ ᱧᱮᱞ', reviewDetails:'ᱡᱚᱢᱟ ᱢᱟᱲᱟᱝ ᱥᱟᱨᱟ ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ ᱢᱮ', whatProblem:'ᱥᱚᱢᱚᱥᱭᱟ ᱪᱮᱫ?', whereProblem:'ᱥᱚᱢᱚᱥᱭᱟ ᱚᱠᱟᱨᱮ?', evidenceAttached:'ᱯᱨᱚᱢᱟᱱ ᱡᱩᱲᱟᱹᱣ', estimatedImpactStep:'ᱩᱢᱟᱱ ᱯᱨᱚᱵᱷᱟᱵ', anonymousSubmission:'ᱵᱮᱱᱟᱢ ᱨᱤᱯᱚᱨᱴ', exactAddress:'ᱴᱷᱤᱠ ᱴᱷᱤᱠᱟᱱᱟ', enabledRadius:'ᱪᱟᱹᱞᱩ (᱕᱐᱐ ᱢᱤᱴᱟᱨ)', notSpecified:'ᱵᱟᱝ ᱚᱞ', editDetails:'ᱵᱤᱵᱨᱚᱱ ᱵᱚᱫᱚᱞ', uploading:'ᱨᱤᱯᱚᱨᱴ ᱡᱚᱢᱟ ᱟᱨ ᱥᱟᱧᱪᱟᱣ...', close:'ᱵᱚᱱᱫᱚ', view:'ᱧᱮᱞ', viewDetails:'ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ', status:'ᱫᱚᱨᱡᱟ', action:'ᱠᱟᱹᱢᱤ', reportSubmitted:'ᱨᱤᱯᱚᱨᱴ ᱡᱚᱢᱟ ᱮᱱᱟ', underAi:'AI ᱧᱮᱞ ᱨᱮ', govValidation:'ᱥᱚᱨᱠᱟᱨᱤ ᱧᱮᱞ', universityAssigned:'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ ᱨᱮ ᱯᱟᱴᱟᱣ', projectStarted:'ᱠᱟᱹᱢᱤ ᱮᱦᱚᱵ', research:'ᱯᱟᱹᱨᱥᱤ / ᱵᱤᱠᱟᱥ', deployed:'ᱥᱚᱢᱟᱫᱷᱟᱱ ᱞᱟᱜᱩ', solved:'ᱥᱚᱢᱚᱥᱭᱟ ᱥᱟᱹᱛ ᱮᱱᱟ', completed:'ᱯᱩᱨᱟᱹ', current:'ᱱᱤᱛᱚᱜ', upcoming:'ᱞᱟᱦᱟᱣ', reportedDetails:'ᱨᱤᱯᱚᱨᱴ ᱵᱤᱵᱨᱚᱱ', problemId:'ᱥᱚᱢᱚᱥᱭᱟ ID', category:'ᱥᱨᱮᱱᱤ', submittedDate:'ᱡᱚᱢᱟ ᱛᱟᱹᱨᱤᱠᱷ', description:'ᱵᱤᱵᱨᱚᱱ', noDescription:'ᱵᱟᱝ ᱩᱛᱟᱹᱨ ᱵᱤᱵᱨᱚᱱ', emptyProblems:'ᱟᱢ ᱱᱤᱛᱚᱜ ᱵᱟᱝ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱟᱠᱟᱫᱟ', total:'ᱡᱚᱛᱚ', id:'ID', people:'ᱦᱚᱲ', selectWho:'ᱚᱠᱚ ᱞᱟᱹᱭ ᱮᱱᱟ ᱵᱟᱪᱷᱟᱣ', roleReporting:'ᱨᱤᱯᱚᱨᱴ ᱠᱟᱱ ᱦᱚᱲ', citizen:'ᱱᱟᱜᱟᱨᱤᱠ', university:'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ', government:'ᱥᱚᱨᱠᱟᱨ', publicReporting:'ᱡᱟᱦᱟᱸᱭ ᱨᱤᱯᱚᱨᱴ', campusResearch:'ᱠᱮᱢᱯᱟᱥ ᱟᱨ ᱯᱟᱹᱨᱥᱤ', officialCivic:'ᱥᱚᱨᱠᱟᱨᱤ ᱨᱤᱯᱚᱨᱴ', similarProblem:'ᱞᱟᱛᱟᱨᱮ ᱢᱮᱞ ᱥᱚᱢᱚᱥᱭᱟ ᱧᱟᱢ ᱮᱱᱟ!', duplicateWarning:'AI ᱰᱩᱯᱞᱤᱠᱮᱴ ᱥᱟᱵᱫᱷᱟᱱ', newProblemAnyway:'ᱛᱟᱹᱦᱮ ᱱᱟᱣᱟ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ', supportExisting:'ᱢᱮᱱᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱥᱟᱦᱟᱭ', uniqueProblemId:'ᱥᱚᱢᱚᱥᱭᱟ ID', currentStatus:'ᱱᱤᱛᱚᱜ ᱫᱚᱨᱡᱟ', pendingSync:'ᱥᱤᱝᱠ ᱵᱟᱠᱤ', underReview:'ᱧᱮᱞ ᱨᱮ', thankYou:'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱞᱟᱜᱤᱫ ᱥᱟᱨᱦᱟᱣ!', reportSuccessMessage:'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱵᱮᱥ ᱞᱮᱠᱟ ᱡᱚᱢᱟ ᱮᱱᱟ। ᱱᱚᱣᱟ ᱧᱮᱞ ᱟᱨ ᱥᱟᱦᱟᱭ ᱥᱟᱞᱟᱜ ᱢᱮᱞ ᱮᱱᱟ।', ticketSummary:'ᱨᱤᱯᱚᱨᱴ ᱥᱟᱨᱟᱝᱥ', problemTitleLabel:'ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ:', reportedLocationRole:'ᱨᱤᱯᱚᱨᱴ ᱡᱟᱭᱜᱟ ᱟᱨ ᱵᱷᱩᱢᱤᱠᱟ:', categoryPriority:'ᱥᱨᱮᱱᱤ ᱟᱨ ᱡᱟᱹᱨᱩᱲᱤ:', matchedCollaborators:'ᱢᱮᱞ ᱥᱟᱦᱟᱭ:', copyLink:'ᱞᱤᱝᱠ ᱠᱚᱯᱤ', copied:'ᱞᱤᱝᱠ ᱠᱚᱯᱤ ᱮᱱᱟ!', reportAnother:'ᱟᱨᱮᱠ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ', universityPortal:'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ ᱨᱤᱯᱚᱨᱴ ᱯᱚᱨᱴᱟᱞ', universityPortalDesc:'ᱠᱚᱞᱮᱡ ᱥᱟᱶᱛᱮ ᱨᱤᱯᱚᱨᱴ ᱢᱮ। ᱠᱮᱢᱯᱟᱥ ᱟᱨ ᱵᱷᱟᱜ ᱵᱤᱵᱨᱚᱱ ᱫᱮᱢ ᱢᱮ।', governmentPortal:'ᱥᱚᱨᱠᱟᱨᱤ ᱱᱟᱜᱟᱨᱤᱠ ᱯᱚᱨᱴᱟᱞ', governmentPortalDesc:'ᱥᱚᱨᱠᱟᱨᱤ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ। ᱡᱤᱞᱟ ᱟᱨ ᱵᱷᱟᱜ ᱵᱤᱵᱨᱚᱱ ᱫᱮᱢ ᱢᱮ।', beConcise:'ᱥᱚᱢᱚᱥᱭᱟ ᱥᱯᱥᱴᱟ ᱟᱨ ᱪᱷᱚᱴ ᱛᱮ ᱚᱞ ᱢᱮ', stopRecording:'ᱨᱮᱠᱚᱨᱰᱤᱝ ᱵᱚᱱᱫᱚ', previousStep:'ᱛᱟᱭᱚᱢ', nextStep:'ᱞᱟᱦᱟ', enterAffected:'ᱯᱨᱚᱵᱷᱟᱵᱤᱛ ᱦᱚᱲ ᱨᱮᱭᱟᱜ ᱩᱢᱟᱱ ᱮᱞ ᱚᱞ ᱢᱮ', institutionPlaceholder:'ᱡᱮᱢᱚᱱ RVS College', departmentPlaceholder:'ᱡᱮᱢᱚᱱ Computer Science', campusPlaceholder:'ᱡᱮᱢᱚᱱ ᱢᱩᱬ ᱠᱮᱢᱯᱟᱥ', govDeptPlaceholder:'ᱡᱮᱢᱚᱱ ᱱᱚᱜᱚᱨ / ᱜᱟᱹᱢ ᱵᱤᱠᱟᱥ', districtPlaceholder:'ᱡᱮᱢᱚᱱ ᱨᱟᱺᱪᱤ / ᱡᱟᱢᱥᱮᱫᱯᱩᱨ', problemPlaceholder:'ᱡᱮᱢᱚᱱ: ᱟᱞᱮ ᱠᱚᱞᱮᱡ ᱟᱨᱮ ᱵᱟᱸᱜ ᱩᱴᱷᱟᱣ', descriptionPlaceholder:'ᱵᱤᱵᱨᱚᱱ ᱛᱮ ᱚᱞ ᱢᱮ: ᱪᱮᱫ ᱦᱩᱭᱮᱱᱟ, ᱚᱠᱟᱨᱮ, ᱚᱠᱚ ᱯᱨᱚᱵᱷᱟᱵᱤᱛ ᱟᱨ ᱪᱮᱫ ᱦᱩᱭᱩᱜ ᱞᱟᱹᱠᱛᱤ', addressPlaceholder:'ᱡᱮᱢᱚᱱ ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ ᱜᱮᱴ ᱱᱚᱝ ᱒ ᱥᱟᱶᱛᱮ', cityPlaceholder:'ᱡᱮᱢᱚᱱ ᱨᱟᱺᱪᱤ', blockPlaceholder:'ᱡᱮᱢᱚᱱ ᱥᱟᱫᱟᱨ / ᱢᱟᱝᱜᱚ / ᱡᱟᱢᱥᱮᱫᱯᱩᱨ', gpsPlaceholder:'GPS / ᱱᱟᱠᱷᱟ ᱵᱟᱪᱷᱟᱣ', categoryPlaceholder:'ᱡᱮᱢᱚᱱ ᱵᱟᱨᱛᱤ ᱡᱚᱢᱟ ᱟᱨ ᱩᱴᱷᱟᱣ', tagPlaceholder:'ᱴᱮᱜ ᱚᱞ ᱢᱮ ᱟᱨ Enter ᱫᱟᱵᱟᱣ', capturedPhoto:'ᱪᱤᱛᱟᱹᱨ ᱯᱨᱚᱢᱟᱱ', capturedPhotoNo:'ᱯᱨᱚᱢᱟᱱ ᱪᱤᱛᱟᱹᱨ #{{count}}', supportRedirect:'ᱢᱮᱱᱟᱜ ᱨᱤᱯᱚᱨᱴ ᱨᱮ ᱟᱢᱟᱜ ᱥᱟᱦᱟᱭ ᱡᱩᱲᱟᱹᱣ ᱦᱚᱭᱚᱜᱟ',subcategory:'ᱥᱟᱹᱱᱟ ᱥᱨᱮᱱᱤ',problemTags:'ᱥᱚᱢᱚᱥᱭᱟ ᱴᱮᱜ' },
};

// For Ho / Nagpuri / Kurmali / Khortha / Mundari, use the same simple local vocabulary already
// used by the project's locale catalogs, avoiding English fallback in the reporting flow.
const regionalHindiBase = {
  problem:'समस्या', location:'ठिकाना', evidence:'सबूत', impact:'असर', review:'जाँच', details:'बिबरन', next:'आगे', previous:'पाछू', edit:'बदलें', problemTitle:'समस्या के नाम', problemDescription:'समस्या के बिबरन', describeVoice:'आवाज से बताऊ', improveAi:'AI से सुधारू', improving:'सुधार हो रहल हे...', reportAnonymously:'गुप्त रूप से बताऊ', hideProfile:'अपन नाम छुपाऊ', institutionName:'संस्था के नाम', department:'बिभाग', campus:'कैंपस / शाखा', governmentDepartment:'सरकारी बिभाग', districtMunicipality:'जिला / नगर', address:'पता', cityState:'सहर / राज्य', coordinates:'निर्देशांक', privacyMode:'गोपनीयता', deviceGps:'फोन GPS ठिकाना', selectMap:'नक्शा पर चुनू', enterManually:'खुद भरू', clickDragPin:'पिन खींचू या क्लिक करू', typeAddress:'पता अउ पहचान के जगह लिखू', locationPicker:'ठिकाना चुनू', mapHint:'नक्शा पर क्लिक करू', privacyRadius:'500 मीटर गोपनीयता क्षेत्र', selectedPoint:'चुना ठिकाना', state:'राज्य', district:'जिला', selectDistrict:'जिला चुनू', blockArea:'ब्लॉक / इलाका', latitude:'अक्षांश', longitude:'देशांतर', approximateLocation:'अनुमानित ठिकाना / गोपनीयता', uploadedEvidence:'जमा सबूत', photoEvidence:'फोटो सबूत', takePhoto:'फोटो लू', uploadPhotos:'फोटो अपलोड करू', noPhotos:'अभी फोटो नइ हे', videoEvidence:'वीडियो सबूत', recordVideo:'वीडियो रिकॉर्ड करू', uploadVideo:'वीडियो अपलोड करू', noVideos:'अभी वीडियो नइ हे', delete:'हटाऊ', cancel:'रद्द करू', snapPhoto:'फोटो लू', affectedPeople:'प्रभावित लोग', affectedPeopleDesc:'बताऊ कि इस समस्या से करीब कितने लोग प्रभावित हे।', aiReport:'AI समस्या सार अउ मिलान रिपोर्ट', confidence:'भरोसा स्तर', classifiedCategory:'समस्या के श्रेणी', priority:'प्राथमिकता', estimatedImpact:'अनुमानित असर', recommendedCollaborators:'सुझाए सहयोगी', potentialSolutions:'संभावित समाधान', formReview:'फॉर्म जाँच', reviewDetails:'जमा करने से पहिले सब जानकारी जाँचू', whatProblem:'समस्या का हे?', whereProblem:'समस्या कहाँ हे?', evidenceAttached:'सबूत जुड़ल हे', estimatedImpactStep:'अनुमानित असर', anonymousSubmission:'गुप्त रिपोर्ट', exactAddress:'सही पता', enabledRadius:'चालू (500 मीटर क्षेत्र)', notSpecified:'नइ बताया', editDetails:'बिबरन बदलू', uploading:'रिपोर्ट जमा अउ सहेजा जा रहल हे...', close:'बंद करू', view:'देखू', viewDetails:'बिबरन देखू', status:'स्थिति', action:'काम', reportSubmitted:'रिपोर्ट जमा हो गेल', underAi:'AI जाँच में', govValidation:'सरकारी जाँच', universityAssigned:'विश्वविद्यालय भेजल गेल', projectStarted:'काम शुरू हो गेल', research:'शोध / विकास', deployed:'समाधान लागू हो गेल', solved:'समस्या हल हो गेल', completed:'पूरा', current:'अभी', upcoming:'आगे', reportedDetails:'रिपोर्ट के बिबरन', problemId:'समस्या ID', category:'श्रेणी', submittedDate:'जमा तारीख', description:'बिबरन', noDescription:'अउर बिबरन नइ दिया गेल', emptyProblems:'अभी तक कोई समस्या दर्ज नइ कइले', total:'कुल', id:'ID', people:'लोग', language:'भाषा', selectWho:'कौन रिपोर्ट कर रहल हे चुनू', roleReporting:'रिपोर्ट करे वाला चुनू', citizen:'नागरिक', university:'विश्वविद्यालय', government:'सरकार', publicReporting:'सार्वजनिक रिपोर्ट', campusResearch:'कैंपस अउ शोध', officialCivic:'सरकारी रिपोर्ट', similarProblem:'पास में मिलती समस्या मिलल!', duplicateWarning:'AI डुप्लिकेट चेतावनी', newProblemAnyway:'फिर भी नई समस्या बताऊ', supportExisting:'मौजूदा समस्या के समर्थन करू', uniqueProblemId:'समस्या ID', currentStatus:'अभी के स्थिति', pendingSync:'सिंक बाकी', underReview:'जाँच में', thankYou:'समस्या बतावे के धन्यवाद!', reportSuccessMessage:'आपके समस्या सफलतापूर्वक दर्ज हो गेल। अब जाँच होके सही सहयोगी से जोड़ा जाएगा।', ticketSummary:'रिपोर्ट सार', problemTitleLabel:'समस्या के नाम:', reportedLocationRole:'रिपोर्ट के ठिकाना अउ भूमिका:', categoryPriority:'श्रेणी अउ प्राथमिकता:', matchedCollaborators:'मिलल सहयोगी:', copyLink:'लिंक कॉपी करू', copied:'लिंक कॉपी हो गेल!', reportAnother:'एक अउ समस्या बताऊ', beConcise:'समस्या साफ अउ छोट लिखू ताकि सहयोगी जल्दी समझ सकें।', stopRecording:'रिकॉर्डिंग रोकू', previousStep:'पाछू', nextStep:'आगे', enterAffected:'प्रभावित लोग के अनुमानित संख्या लिखू (जैसे 500)', institutionPlaceholder:'जैसे RVS College', departmentPlaceholder:'जैसे Computer Science', campusPlaceholder:'जैसे मुख्य कैंपस', govDeptPlaceholder:'जैसे नगर विकास / ग्रामीण विकास', districtPlaceholder:'जैसे रांची / जमशेदपुर', problemPlaceholder:'उदाहरण: हमारे कॉलेज के पास कचरा नहीं उठाया जाता', descriptionPlaceholder:'बिस्तार से बताऊ: का हुआ, कहाँ हुआ, कौन प्रभावित हे अउ का करना चाही।', addressPlaceholder:'जैसे यूनिवर्सिटी गेट नंबर 2 के पास', cityPlaceholder:'जैसे रांची', blockPlaceholder:'जैसे सदर / मानगो / जमशेदपुर', gpsPlaceholder:'GPS / नक्शा चुना गेल', categoryPlaceholder:'जैसे कचरा संग्रह अउ कचरा फेंकना', tagPlaceholder:'कस्टम टैग लिखू (जैसे #sanitation) अउ Enter दबाऊ', capturedPhoto:'फोटो सबूत', capturedPhotoNo:'सबूत फोटो #{{count}}', supportRedirect:'मौजूदा रिपोर्ट में आपका समर्थन जोड़ा जा रहल हे।',subcategory:'उप-श्रेणी (वैकल्पिक)',problemTags:'समस्या के टैग',universityPortal:'विश्वविद्यालय रिपोर्ट पोर्टल',universityPortalDesc:'कॉलेज या शैक्षणिक संस्था की ओर से रिपोर्ट करें। नीचे कैंपस और विभाग की जानकारी दें।',governmentPortal:'सरकारी नागरिक पोर्टल',governmentPortalDesc:'सरकारी समस्या दर्ज करें। नीचे जिला और विभाग की जानकारी दें।'
};

for (const code of ['ho','nag','kur','kho','mul']) {
  ui[code] = { ...regionalHindiBase, reportProblem:'समस्या बताऊ', language:'भाषा', whatIsIt:'समस्या का हे?', whereIsIt:'समस्या कहाँ हे?', photosVideos:'फोटो / वीडियो', confirmSubmit:'पक्का करके जमा करू', stepDetails:'चरण {{step}} / 5', reportAnonymously:'गुप्त रूप से बताऊ', hideProfile:'अपन नाम छुपाऊ', previous:'पाछू', next:'आगे', cancel:'रद्द करू', close:'बंद करू', takePhoto:'फोटो लू', recordVideo:'वीडियो रिकॉर्ड करू', uploadPhotos:'फोटो अपलोड करू', uploadVideo:'वीडियो अपलोड करू', noPhotos:'अभी फोटो नइ हे', noVideos:'अभी वीडियो नइ हे', delete:'हटाऊ', snapPhoto:'फोटो लू', citizen:'नागरिक', university:'विश्वविद्यालय', government:'सरकार', reportProblem:'समस्या बताऊ' };
}
ui.ho = { ...ui.ho, reportProblem:'समस्या उदुब मे', problem:'समस्या', location:'ठिकाना', next:'लाहा', previous:'तायोम', reportAnonymously:'गुप्त रूप से उदुब मे', affectedPeople:'प्रभावित होड़', language:'भाषा' };
ui.mul = { ...ui.mul, reportProblem:'समस्या उदुब मे', next:'आगे', previous:'पाछू', language:'भाषा' };

ui.sat = regional.sat;



// Shared copy for the report-method and voice-report screens. These keys are intentionally
// citizen-only so Government / University / Industry portals remain unchanged.
const reportMethodCopy = {
  en: {
    reportMethodTitle:'How do you want to report the problem?', reportMethodSubtitle:'Choose how you would like to submit your problem.', throughVoice:'Through Voice', throughVoiceDesc:'Describe your problem naturally using your voice.', throughManual:'Through Manual Writing', throughManualDesc:'Fill in the existing step-by-step reporting form.', back:'Back', reportByVoice:'Report by Voice', voiceDescription:'Describe your problem naturally using your voice.', startSpeaking:'Start Speaking', stopRecording:'Stop Recording', startSpeakingHint:'Allow microphone access and describe your problem.', voiceRecordingNow:'Recording and listening...', yourStatement:'Your Statement', voiceStatementPlaceholder:'Your spoken statement will appear here...', editTranscript:'Edit Transcript', continueReport:'Continue', voiceSaved:'Your voice recording is ready.', voiceMicUnsupported:'This browser cannot access the microphone. Please use a browser with microphone support.', voiceSpeechUnsupported:'Your voice is being recorded, but live speech-to-text is not supported by this browser. The backend can process the recording later.', voiceRecognitionError:'Speech recognition could not continue. Your audio recording is still available.', voicePermissionError:'Microphone access was blocked or unavailable. Please allow microphone access and try again.', close:'Close'
  },
  hi: {
    reportMethodTitle:'समस्या कैसे दर्ज करना चाहते हैं?', reportMethodSubtitle:'समस्या दर्ज करने का तरीका चुनें।', throughVoice:'आवाज़ से', throughVoiceDesc:'अपनी समस्या अपनी आवाज़ में बताएं।', throughManual:'खुद लिखकर', throughManualDesc:'मौजूदा चरण-दर-चरण फॉर्म भरें।', back:'वापस', reportByVoice:'आवाज़ से समस्या दर्ज करें', voiceDescription:'अपनी समस्या अपनी आवाज़ में बताएं।', startSpeaking:'बोलना शुरू करें', stopRecording:'रिकॉर्डिंग रोकें', startSpeakingHint:'माइक्रोफोन की अनुमति दें और अपनी समस्या बताएं।', voiceRecordingNow:'रिकॉर्डिंग और सुनना जारी है...', yourStatement:'आपकी बात', voiceStatementPlaceholder:'आपकी बोली हुई बात यहाँ दिखाई देगी...', editTranscript:'ट्रांसक्रिप्ट बदलें', continueReport:'आगे बढ़ें', voiceSaved:'आपकी आवाज़ की रिकॉर्डिंग तैयार है।', voiceMicUnsupported:'यह ब्राउज़र माइक्रोफोन इस्तेमाल नहीं कर सकता।', voiceSpeechUnsupported:'आवाज़ रिकॉर्ड हो रही है, लेकिन इस ब्राउज़र में आवाज़ को टेक्स्ट में बदलना उपलब्ध नहीं है।', voiceRecognitionError:'आवाज़ पहचान जारी नहीं रह सकी। ऑडियो रिकॉर्डिंग जारी है।', voicePermissionError:'माइक्रोफोन की अनुमति नहीं मिली। माइक्रोफोन की अनुमति दें और फिर कोशिश करें।', close:'बंद करें'
  },
  bn: {
    reportMethodTitle:'কীভাবে সমস্যা জানাতে চান?', reportMethodSubtitle:'সমস্যা জানানোর পদ্ধতি বেছে নিন।', throughVoice:'কণ্ঠে জানান', throughVoiceDesc:'নিজের কণ্ঠে সমস্যাটি বলুন।', throughManual:'লিখে জানান', throughManualDesc:'ধাপে ধাপে রিপোর্ট ফর্ম পূরণ করুন।', back:'ফিরে যান', reportByVoice:'কণ্ঠে সমস্যা জানান', voiceDescription:'নিজের কণ্ঠে সমস্যাটি বলুন।', startSpeaking:'কথা বলা শুরু করুন', stopRecording:'রেকর্ডিং বন্ধ করুন', startSpeakingHint:'মাইক্রোফোনের অনুমতি দিন এবং সমস্যাটি বলুন।', voiceRecordingNow:'রেকর্ডিং চলছে...', yourStatement:'আপনার বক্তব্য', voiceStatementPlaceholder:'আপনার বলা কথা এখানে দেখা যাবে...', editTranscript:'লিখিত বক্তব্য বদলান', continueReport:'এগিয়ে যান', voiceSaved:'আপনার ভয়েস রেকর্ডিং প্রস্তুত।', voiceMicUnsupported:'এই ব্রাউজারে মাইক্রোফোন ব্যবহার করা যাচ্ছে না।', voiceSpeechUnsupported:'ভয়েস রেকর্ড হচ্ছে, কিন্তু এই ব্রাউজারে কথাকে লেখায় বদলানো যায় না।', voiceRecognitionError:'ভয়েস শনাক্তকরণ থেমে গেছে। অডিও রেকর্ডিং চলছে।', voicePermissionError:'মাইক্রোফোনের অনুমতি পাওয়া যায়নি। অনুমতি দিয়ে আবার চেষ্টা করুন।', close:'বন্ধ করুন'
  },
  or: {
    reportMethodTitle:'ସମସ୍ୟା କିପରି ଜଣାଇବେ?', reportMethodSubtitle:'ସମସ୍ୟା ଜଣାଇବାର ଉପାୟ ବାଛନ୍ତୁ।', throughVoice:'କଣ୍ଠରେ ଜଣାନ୍ତୁ', throughVoiceDesc:'ନିଜ କଣ୍ଠରେ ସମସ୍ୟା ବିଷୟରେ କହନ୍ତୁ।', throughManual:'ଲେଖି ଜଣାନ୍ତୁ', throughManualDesc:'ପଦକ୍ଷେପ ଅନୁସାରେ ଫର୍ମ ପୂରଣ କରନ୍ତୁ।', back:'ପଛକୁ', reportByVoice:'କଣ୍ଠରେ ସମସ୍ୟା ଜଣାନ୍ତୁ', voiceDescription:'ନିଜ କଣ୍ଠରେ ସମସ୍ୟା ବିଷୟରେ କହନ୍ତୁ।', startSpeaking:'କହିବା ଆରମ୍ଭ କରନ୍ତୁ', stopRecording:'ରେକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ', startSpeakingHint:'ମାଇକ୍ରୋଫୋନ୍ ଅନୁମତି ଦିଅନ୍ତୁ ଏବଂ ସମସ୍ୟା କହନ୍ତୁ।', voiceRecordingNow:'ରେକର୍ଡିଂ ଚାଲିଛି...', yourStatement:'ଆପଣଙ୍କ କଥା', voiceStatementPlaceholder:'ଆପଣ କହିଥିବା କଥା ଏଠାରେ ଦେଖାଯିବ...', editTranscript:'ଲିଖିତ କଥା ବଦଳାନ୍ତୁ', continueReport:'ଆଗକୁ ଯାଆନ୍ତୁ', voiceSaved:'ଆପଣଙ୍କ ଭଏସ୍ ରେକର୍ଡିଂ ପ୍ରସ୍ତୁତ।', voiceMicUnsupported:'ଏହି ବ୍ରାଉଜରରେ ମାଇକ୍ରୋଫୋନ୍ ଚାଲୁ ହେଉନାହିଁ।', voiceSpeechUnsupported:'ଭଏସ୍ ରେକର୍ଡ ହେଉଛି, କିନ୍ତୁ ଏହି ବ୍ରାଉଜରରେ କଥାକୁ ଟେକ୍ସଟ୍ କରିବା ଉପଲବ୍ଧ ନାହିଁ।', voiceRecognitionError:'କଣ୍ଠ ଚିହ୍ନଟ ଚାଲୁ ରହିପାରିଲା ନାହିଁ। ଅଡିଓ ରେକର୍ଡିଂ ଚାଲିଛି।', voicePermissionError:'ମାଇକ୍ରୋଫୋନ୍ ଅନୁମତି ମିଳିଲା ନାହିଁ। ଅନୁମତି ଦେଇ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।', close:'ବନ୍ଦ କରନ୍ତୁ'
  },
  sat: {
    reportMethodTitle:'ᱥᱚᱢᱚᱥᱭᱟ ᱪᱮᱞᱠᱟ ᱞᱟᱹᱭ ᱢᱮ?', reportMethodSubtitle:'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱨᱮᱭᱟᱜ ᱛᱟᱨᱤᱠᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ।', throughVoice:'ᱞᱟᱹᱭ ᱛᱮ', throughVoiceDesc:'ᱟᱢᱟᱜ ᱥᱟᱫᱟ ᱛᱮ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ।', throughManual:'ᱚᱞ ᱛᱮ', throughManualDesc:'ᱯᱟᱪᱷᱟ ᱯᱟᱪᱷᱟ ᱨᱤᱯᱚᱨᱴ ᱯᱷᱚᱨᱢ ᱯᱮᱨᱮᱡ ᱢᱮ।', back:'ᱛᱟᱭᱚᱢ', reportByVoice:'ᱞᱟᱹᱭ ᱛᱮ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ', voiceDescription:'ᱟᱢᱟᱜ ᱥᱟᱫᱟ ᱛᱮ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ।', startSpeaking:'ᱞᱟᱹᱭ ᱮᱦᱚᱵ', stopRecording:'ᱨᱮᱠᱚᱨᱰᱤᱝ ᱵᱚᱱᱫᱚ', startSpeakingHint:'ᱢᱟᱭᱠᱨᱚᱯᱷᱚᱱ ᱟᱹᱲᱤ ᱫᱚ ᱟᱨ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ।', voiceRecordingNow:'ᱨᱮᱠᱚᱨᱰᱤᱝ ᱪᱟᱹᱞᱩ ᱢᱮ...', yourStatement:'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ', voiceStatementPlaceholder:'ᱟᱢ ᱞᱟᱹᱭ ᱟᱠᱟᱫ ᱠᱟᱛᱷᱟ ᱱᱚᱛᱮ ᱧᱮᱞᱚᱜᱼᱟ...', editTranscript:'ᱚᱞ ᱵᱚᱫᱚᱞ', continueReport:'ᱞᱟᱦᱟ', voiceSaved:'ᱟᱢᱟᱜ ᱞᱟᱹᱭ ᱨᱮᱠᱚᱨᱰ ᱥᱟᱡᱟᱣ ᱮᱱᱟ।', voiceMicUnsupported:'ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱢᱟᱭᱠᱨᱚᱯᱷᱚᱱ ᱵᱟᱝ ᱪᱟᱞᱟᱣ ᱟ।', voiceSpeechUnsupported:'ᱞᱟᱹᱭ ᱨᱮᱠᱚᱨᱰ ᱦᱚᱜᱟ, ᱢᱮᱱᱛᱮ ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱚᱞ ᱨᱮ ᱵᱟᱝ ᱵᱚᱫᱞᱚᱜᱼᱟ।', voiceRecognitionError:'ᱞᱟᱹᱭ ᱧᱮᱞ ᱵᱟᱝ ᱪᱟᱞᱟᱣ ᱞᱮᱱᱟ। ᱟᱰᱤᱭᱚ ᱨᱮᱠᱚᱨᱰ ᱪᱟᱹᱞᱩ ᱢᱮ।', voicePermissionError:'ᱢᱟᱭᱠᱨᱚᱯᱷᱚᱱ ᱟᱹᱲᱤ ᱵᱟᱝ ᱧᱟᱢ ᱮᱱᱟ।', close:'ᱵᱚᱱᱫᱚ'
  },
};

const regionalMethodCopy = {
  ho: { reportMethodTitle:'समस्या उदुब मेना?', reportMethodSubtitle:'समस्या उदुब के तरीका बाछा मे।', throughVoice:'आवाज ते', throughVoiceDesc:'आम आवाज ते समस्या उदुब मे।', throughManual:'ओल ते', throughManualDesc:'चरण-चरण रिपोर्ट फॉर्म भरा।', back:'तायोम', reportByVoice:'आवाज ते समस्या उदुब मे', voiceDescription:'आम आवाज ते समस्या उदुब मे।', startSpeaking:'काथा एहोब', stopRecording:'रिकॉर्डिंग बोंदो', startSpeakingHint:'माइक के अनुमति दा आर समस्या उदुब मे।', voiceRecordingNow:'रिकॉर्डिंग चालू मे...', yourStatement:'आमाक काथा', voiceStatementPlaceholder:'आम जे काथा उदुब मे ओना एथे देखायगा...', editTranscript:'ओल बदल मे', continueReport:'लाहा', voiceSaved:'आमाक आवाज रिकॉर्ड हो गेल।', voiceMicUnsupported:'ए ब्राउजर माइक चालू नाय कर पारना।', voiceSpeechUnsupported:'आवाज रिकॉर्ड हो रहल हे, मुदा ए ब्राउजर आवाज के ओल मे नाय बदलना।', voiceRecognitionError:'आवाज पहचान रुक गेल। ऑडियो रिकॉर्डिंग चालू हे।', voicePermissionError:'माइक के अनुमति नाय मिलल।', close:'बोंदो' },
  nag: { reportMethodTitle:'समस्या कइसन बतावे के हे?', reportMethodSubtitle:'समस्या बतावे के तरीका चुनू।', throughVoice:'आवाज से', throughVoiceDesc:'अपन आवाज से समस्या बताऊ।', throughManual:'लिख के', throughManualDesc:'चरण-दर-चरण रिपोर्ट फॉर्म भरू।', back:'पाछू', reportByVoice:'आवाज से समस्या बताऊ', voiceDescription:'अपन आवाज से समस्या बताऊ।', startSpeaking:'बोलना शुरू करू', stopRecording:'रिकॉर्डिंग रोकू', startSpeakingHint:'माइक के अनुमति देके समस्या बताऊ।', voiceRecordingNow:'रिकॉर्डिंग चल रहल हे...', yourStatement:'आपन बात', voiceStatementPlaceholder:'आपन कहल बात इहाँ देखाई...', editTranscript:'लिखल बात बदलू', continueReport:'आगे', voiceSaved:'आपन आवाज रिकॉर्ड हो गेल।', voiceMicUnsupported:'ई ब्राउजर माइक नाय चला सकत।', voiceSpeechUnsupported:'आवाज रिकॉर्ड हो रहल हे, बाकिर ई ब्राउजर आवाज के लिखाई में नाय बदल सकत।', voiceRecognitionError:'आवाज पहचान रुक गेल। ऑडियो रिकॉर्डिंग चालू हे।', voicePermissionError:'माइक के अनुमति नाय मिलल।', close:'बंद करू' },
  kur: { reportMethodTitle:'समस्या एना के बताबै चाहो?', reportMethodSubtitle:'समस्या बताबै के तरीका चुनू।', throughVoice:'आवाज से', throughVoiceDesc:'अपन आवाज से समस्या बताऊ।', throughManual:'लिख के', throughManualDesc:'चरण-दर-चरण रिपोर्ट फॉर्म भरू।', back:'पाछू', reportByVoice:'आवाज से समस्या बताऊ', voiceDescription:'अपन आवाज से समस्या बताऊ।', startSpeaking:'बोलना शुरू करू', stopRecording:'रिकॉर्डिंग रोकू', startSpeakingHint:'माइक के अनुमति देके समस्या बताऊ।', voiceRecordingNow:'रिकॉर्डिंग चल रहल हे...', yourStatement:'आपन बात', voiceStatementPlaceholder:'आपन कहल बात इहाँ देखाई...', editTranscript:'लिखल बात बदलू', continueReport:'आगे', voiceSaved:'आपन आवाज रिकॉर्ड हो गेल।', voiceMicUnsupported:'ई ब्राउजर माइक नाय चला सकत।', voiceSpeechUnsupported:'आवाज रिकॉर्ड हो रहल हे, बाकिर ई ब्राउजर आवाज के लिखाई में नाय बदल सकत।', voiceRecognitionError:'आवाज पहचान रुक गेल। ऑडियो रिकॉर्डिंग चालू हे।', voicePermissionError:'माइक के अनुमति नाय मिलल।', close:'बंद करू' },
  kho: { reportMethodTitle:'समस्या केना बताबै चाही?', reportMethodSubtitle:'समस्या बताबै के तरीका चुनू।', throughVoice:'आवाज से', throughVoiceDesc:'अपन आवाज से समस्या बताऊ।', throughManual:'लिख के', throughManualDesc:'चरण-दर-चरण रिपोर्ट फॉर्म भरू।', back:'पाछू', reportByVoice:'आवाज से समस्या बताऊ', voiceDescription:'अपन आवाज से समस्या बताऊ।', startSpeaking:'बोलना शुरू करू', stopRecording:'रिकॉर्डिंग रोकू', startSpeakingHint:'माइक के अनुमति देके समस्या बताऊ।', voiceRecordingNow:'रिकॉर्डिंग चल रहल हे...', yourStatement:'अपन बात', voiceStatementPlaceholder:'अपन कहल बात इहाँ देखाई...', editTranscript:'लिखल बात बदलू', continueReport:'आगे', voiceSaved:'आपन आवाज रिकॉर्ड हो गेल।', voiceMicUnsupported:'ई ब्राउजर माइक नाय चला सकत।', voiceSpeechUnsupported:'आवाज रिकॉर्ड हो रहल हे, बाकिर ई ब्राउजर आवाज के लिखाई में नाय बदल सकत।', voiceRecognitionError:'आवाज पहचान रुक गेल। ऑडियो रिकॉर्डिंग चालू हे।', voicePermissionError:'माइक के अनुमति नाय मिलल।', close:'बंद करू' },
  mul: { reportMethodTitle:'समस्या केना बताबै चाही?', reportMethodSubtitle:'समस्या बताबै के तरीका चुनू।', throughVoice:'आवाज से', throughVoiceDesc:'अपन आवाज से समस्या बताऊ।', throughManual:'लिख के', throughManualDesc:'चरण-दर-चरण रिपोर्ट फॉर्म भरू।', back:'पाछू', reportByVoice:'आवाज से समस्या बताऊ', voiceDescription:'अपन आवाज से समस्या बताऊ।', startSpeaking:'बोलना शुरू करू', stopRecording:'रिकॉर्डिंग रोकू', startSpeakingHint:'माइक के अनुमति देके समस्या बताऊ।', voiceRecordingNow:'रिकॉर्डिंग चल रहल हे...', yourStatement:'अपन बात', voiceStatementPlaceholder:'अपन कहल बात इहाँ देखाई...', editTranscript:'लिखल बात बदलू', continueReport:'आगे', voiceSaved:'आपन आवाज रिकॉर्ड हो गेल।', voiceMicUnsupported:'ई ब्राउजर माइक नाय चला सकत।', voiceSpeechUnsupported:'आवाज रिकॉर्ड हो रहल हे, बाकिर ई ब्राउजर आवाज के लिखाई में नाय बदल सकत।', voiceRecognitionError:'आवाज पहचान रुक गेल। ऑडियो रिकॉर्डिंग चालू हे।', voicePermissionError:'माइक के अनुमति नाय मिलल।', close:'बंद करू' },
};



// Citizen dashboard copy. This is intentionally kept in the citizen catalog so
// changing the citizen language updates the dashboard itself, not just the
// report form.
const citizenDashboardCopy = {
  en: {
    'citizen.portal':'Citizen Portal','citizen.home':'Home','citizen.dashboard':'Dashboard','citizen.myProblems':'My Problems','citizen.reportProblem':'Report a Problem','citizen.profile':'Profile','citizen.logout':'Logout','citizen.hello':'Hello, {{name}}!','citizen.welcomeText':'Together we can create solutions for a better tomorrow.','citizen.totalReports':'Total Reports','citizen.totalReportsDesc':'Problems you have submitted','citizen.underReview':'Under Review','citizen.underReviewDesc':'Being checked by AI / Government','citizen.inProgress':'In Progress','citizen.inProgressDesc':'Assigned for action','citizen.completed':'Completed','citizen.completedDesc':'Solutions implemented','citizen.newProblem':'Report a New Problem','citizen.newProblemDesc':'Share a problem you have noticed in your area.','citizen.addLocation':'Add Location','citizen.addLocationDesc':'Help us identify the exact area','citizen.describeIssue':'Describe the Issue','citizen.describeIssueDesc':'Provide details and evidence','citizen.selectCategory':'Select Category','citizen.selectCategoryDesc':'Choose the relevant problem type','citizen.submit':'Submit','citizen.submitDesc':'Your report will be analyzed','citizen.recentNotifications':'Recent Notifications','citizen.recent':'Recent','citizen.noNotifications':'No notifications','citizen.smallActions':'Small actions create big changes','citizen.smallActionsDesc':'Your reports help universities, government and partners find real solutions for a better community.','citizen.checkProfile':'Check your profile','citizen.welcomeDashboard':'Welcome to your citizen dashboard','citizen.welcomeDashboardDesc':'Report a local problem and track its progress here.','citizen.getStarted':'Get started','citizen.recently':'Recently','citizen.earlier':'Earlier','citizen.reportUpdated':'Your report has been updated','citizen.reportProcessing':'Your report is being processed.','citizen.close':'Close','citizen.view':'View','citizen.viewDetails':'View Details','citizen.problemProgress':'Problem Progress','citizen.trackProgress':'Track how your reported problem is moving from submission to resolution.','citizen.problemTitle':'Problem Title','citizen.categoryLocation':'Category / Location','citizen.submittedOn':'Submitted On','citizen.action':'Action'
  },
  hi: {
    'citizen.portal':'नागरिक पोर्टल','citizen.home':'होम','citizen.dashboard':'डैशबोर्ड','citizen.myProblems':'मेरी समस्याएँ','citizen.reportProblem':'समस्या दर्ज करें','citizen.profile':'प्रोफ़ाइल','citizen.logout':'लॉग आउट','citizen.hello':'नमस्ते, {{name}}!','citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।','citizen.totalReports':'कुल रिपोर्ट','citizen.totalReportsDesc':'आपने दर्ज की गई समस्याएँ','citizen.underReview':'जाँच में','citizen.underReviewDesc':'AI / सरकार द्वारा जाँच की जा रही है','citizen.inProgress':'काम चल रहा है','citizen.inProgressDesc':'कार्रवाई के लिए भेजी गई','citizen.completed':'पूरा हुआ','citizen.completedDesc':'समाधान लागू किए गए','citizen.newProblem':'नई समस्या दर्ज करें','citizen.newProblemDesc':'अपने इलाके की कोई समस्या साझा करें।','citizen.addLocation':'स्थान जोड़ें','citizen.addLocationDesc':'सही जगह बताने में मदद करें','citizen.describeIssue':'समस्या बताएं','citizen.describeIssueDesc':'जानकारी और सबूत दें','citizen.selectCategory':'श्रेणी चुनें','citizen.selectCategoryDesc':'समस्या का सही प्रकार चुनें','citizen.submit':'जमा करें','citizen.submitDesc':'आपकी रिपोर्ट की जाँच होगी','citizen.recentNotifications':'हाल की सूचनाएँ','citizen.recent':'हाल की','citizen.noNotifications':'कोई सूचना नहीं','citizen.smallActions':'छोटे कदम बड़ा बदलाव लाते हैं','citizen.smallActionsDesc':'आपकी रिपोर्ट से विश्वविद्यालय, सरकार और साझेदार सही समाधान खोजने में मदद पाते हैं।','citizen.checkProfile':'अपनी प्रोफ़ाइल देखें','citizen.welcomeDashboard':'आपके नागरिक डैशबोर्ड में स्वागत है','citizen.welcomeDashboardDesc':'अपने इलाके की समस्या दर्ज करें और उसकी स्थिति देखें।','citizen.getStarted':'शुरू करें','citizen.recently':'अभी हाल में','citizen.earlier':'पहले','citizen.reportUpdated':'आपकी रिपोर्ट अपडेट हुई है','citizen.reportProcessing':'आपकी रिपोर्ट पर काम चल रहा है।','citizen.close':'बंद करें','citizen.view':'देखें','citizen.viewDetails':'विवरण देखें','citizen.problemProgress':'समस्या की प्रगति','citizen.trackProgress':'देखें कि आपकी समस्या दर्ज होने से समाधान तक कैसे आगे बढ़ रही है।','citizen.problemTitle':'समस्या का नाम','citizen.categoryLocation':'श्रेणी / स्थान','citizen.submittedOn':'जमा करने की तारीख','citizen.action':'कार्रवाई'
  },
  bn: {
    'citizen.portal':'নাগরিক পোর্টাল','citizen.home':'হোম','citizen.dashboard':'ড্যাশবোর্ড','citizen.myProblems':'আমার সমস্যাগুলি','citizen.reportProblem':'সমস্যা জানান','citizen.profile':'প্রোফাইল','citizen.logout':'লগ আউট','citizen.hello':'নমস্কার, {{name}}!','citizen.welcomeText':'একসঙ্গে আমরা আরও ভালো আগামীকালের জন্য সমাধান তৈরি করতে পারি।','citizen.totalReports':'মোট রিপোর্ট','citizen.totalReportsDesc':'আপনার জমা দেওয়া সমস্যা','citizen.underReview':'পর্যালোচনাধীন','citizen.underReviewDesc':'AI / সরকার যাচাই করছে','citizen.inProgress':'চলমান','citizen.inProgressDesc':'কাজের জন্য পাঠানো হয়েছে','citizen.completed':'সম্পন্ন','citizen.completedDesc':'সমাধান বাস্তবায়িত হয়েছে','citizen.newProblem':'নতুন সমস্যা জানান','citizen.newProblemDesc':'আপনার এলাকার দেখা কোনো সমস্যা জানান।','citizen.addLocation':'অবস্থান যোগ করুন','citizen.addLocationDesc':'সঠিক এলাকা চিহ্নিত করতে সাহায্য করুন','citizen.describeIssue':'সমস্যাটি বর্ণনা করুন','citizen.describeIssueDesc':'বিস্তারিত ও প্রমাণ দিন','citizen.selectCategory':'শ্রেণি নির্বাচন করুন','citizen.selectCategoryDesc':'উপযুক্ত সমস্যার ধরন বেছে নিন','citizen.submit':'জমা দিন','citizen.submitDesc':'আপনার রিপোর্ট বিশ্লেষণ করা হবে','citizen.recentNotifications':'সাম্প্রতিক বিজ্ঞপ্তি','citizen.recent':'সাম্প্রতিক','citizen.noNotifications':'কোনও বিজ্ঞপ্তি নেই','citizen.smallActions':'ছোট পদক্ষেপে বড় পরিবর্তন আসে','citizen.smallActionsDesc':'আপনার রিপোর্ট বিশ্ববিদ্যালয়, সরকার ও অংশীদারদের বাস্তব সমাধান খুঁজতে সাহায্য করে।','citizen.checkProfile':'আপনার প্রোফাইল দেখুন','citizen.welcomeDashboard':'আপনার নাগরিক ড্যাশবোর্ডে স্বাগতম','citizen.welcomeDashboardDesc':'এখানে এলাকার সমস্যা জানান এবং অগ্রগতি দেখুন।','citizen.getStarted':'শুরু করুন','citizen.recently':'এইমাত্র','citizen.earlier':'আগে','citizen.reportUpdated':'আপনার রিপোর্ট আপডেট হয়েছে','citizen.reportProcessing':'আপনার রিপোর্ট প্রক্রিয়াধীন।','citizen.close':'বন্ধ করুন','citizen.view':'দেখুন','citizen.viewDetails':'বিস্তারিত দেখুন','citizen.problemProgress':'সমস্যার অগ্রগতি','citizen.trackProgress':'আপনার রিপোর্ট করা সমস্যা কীভাবে জমা থেকে সমাধানের দিকে এগোচ্ছে তা দেখুন।','citizen.problemTitle':'সমস্যার শিরোনাম','citizen.categoryLocation':'শ্রেণি / অবস্থান','citizen.submittedOn':'জমা দেওয়ার তারিখ','citizen.action':'কাজ'
  },
  or: {
    'citizen.portal':'ନାଗରିକ ପୋର୍ଟାଲ','citizen.home':'ହୋମ୍','citizen.dashboard':'ଡ୍ୟାସବୋର୍ଡ','citizen.myProblems':'ମୋ ସମସ୍ୟାଗୁଡ଼ିକ','citizen.reportProblem':'ସମସ୍ୟା ଜଣାନ୍ତୁ','citizen.profile':'ପ୍ରୋଫାଇଲ୍','citizen.logout':'ଲଗ୍ ଆଉଟ୍','citizen.hello':'ନମସ୍କାର, {{name}}!','citizen.welcomeText':'ଏକାଠି ହୋଇ ଆମେ ଭଲ ଆସନ୍ତାକାଲି ପାଇଁ ସମାଧାନ ତିଆରି କରିପାରିବା।','citizen.totalReports':'ମୋଟ ରିପୋର୍ଟ','citizen.totalReportsDesc':'ଆପଣ ଦାଖଲ କରିଥିବା ସମସ୍ୟା','citizen.underReview':'ଯାଞ୍ଚରେ','citizen.underReviewDesc':'AI / ସରକାର ଯାଞ୍ଚ କରୁଛନ୍ତି','citizen.inProgress':'ଚାଲୁଛି','citizen.inProgressDesc':'କାର୍ଯ୍ୟ ପାଇଁ ପଠାଯାଇଛି','citizen.completed':'ସମାପ୍ତ','citizen.completedDesc':'ସମାଧାନ କାର୍ଯ୍ୟକାରୀ ହୋଇଛି','citizen.newProblem':'ନୂଆ ସମସ୍ୟା ଜଣାନ୍ତୁ','citizen.newProblemDesc':'ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ଦେଖିଥିବା ସମସ୍ୟା ଜଣାନ୍ତୁ।','citizen.addLocation':'ସ୍ଥାନ ଯୋଡନ୍ତୁ','citizen.addLocationDesc':'ଠିକ୍ ଅଞ୍ଚଳ ଚିହ୍ନଟ କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ','citizen.describeIssue':'ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ','citizen.describeIssueDesc':'ବିବରଣୀ ଓ ପ୍ରମାଣ ଦିଅନ୍ତୁ','citizen.selectCategory':'ଶ୍ରେଣୀ ବାଛନ୍ତୁ','citizen.selectCategoryDesc':'ଉପଯୁକ୍ତ ସମସ୍ୟା ପ୍ରକାର ବାଛନ୍ତୁ','citizen.submit':'ଦାଖଲ କରନ୍ତୁ','citizen.submitDesc':'ଆପଣଙ୍କ ରିପୋର୍ଟ ବିଶ୍ଳେଷଣ ହେବ','citizen.recentNotifications':'ସାମ୍ପ୍ରତିକ ସୂଚନା','citizen.recent':'ସାମ୍ପ୍ରତିକ','citizen.noNotifications':'କୌଣସି ସୂଚନା ନାହିଁ','citizen.smallActions':'ଛୋଟ ପଦକ୍ଷେପ ବଡ଼ ପରିବର୍ତ୍ତନ ଆଣେ','citizen.smallActionsDesc':'ଆପଣଙ୍କ ରିପୋର୍ଟ ବିଶ୍ୱବିଦ୍ୟାଳୟ, ସରକାର ଓ ସହଭାଗୀମାନଙ୍କୁ ସଠିକ୍ ସମାଧାନ ଖୋଜିବାରେ ସାହାଯ୍ୟ କରେ।','citizen.checkProfile':'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ','citizen.welcomeDashboard':'ଆପଣଙ୍କ ନାଗରିକ ଡ୍ୟାସବୋର୍ଡକୁ ସ୍ୱାଗତ','citizen.welcomeDashboardDesc':'ଏଠାରେ ସ୍ଥାନୀୟ ସମସ୍ୟା ଜଣାନ୍ତୁ ଓ ଅଗ୍ରଗତି ଦେଖନ୍ତୁ।','citizen.getStarted':'ଆରମ୍ଭ କରନ୍ତୁ','citizen.recently':'ସମ୍ପ୍ରତି','citizen.earlier':'ପୂର୍ବରୁ','citizen.reportUpdated':'ଆପଣଙ୍କ ରିପୋର୍ଟ ଅପଡେଟ୍ ହୋଇଛି','citizen.reportProcessing':'ଆପଣଙ୍କ ରିପୋର୍ଟ ପ୍ରକ୍ରିୟାରେ ଅଛି।','citizen.close':'ବନ୍ଦ କରନ୍ତୁ','citizen.view':'ଦେଖନ୍ତୁ','citizen.viewDetails':'ବିବରଣୀ ଦେଖନ୍ତୁ','citizen.problemProgress':'ସମସ୍ୟାର ଅଗ୍ରଗତି','citizen.trackProgress':'ଆପଣଙ୍କ ରିପୋର୍ଟ କରାଯାଇଥିବା ସମସ୍ୟା ଦାଖଲରୁ ସମାଧାନ ପର୍ଯ୍ୟନ୍ତ କିପରି ଆଗକୁ ବଢ଼ୁଛି ଦେଖନ୍ତୁ।','citizen.problemTitle':'ସମସ୍ୟାର ଶୀର୍ଷକ','citizen.categoryLocation':'ଶ୍ରେଣୀ / ସ୍ଥାନ','citizen.submittedOn':'ଦାଖଲ ତାରିଖ','citizen.action':'କାର୍ଯ୍ୟ'
  },
  sat: {
    'citizen.portal':'ᱦᱚᱲ ᱯᱚᱨᱴᱟᱞ','citizen.home':'ᱚᱞ ᱵᱤᱰᱟᱹᱣ','citizen.dashboard':'ᱰᱮᱥᱵᱚᱨᱰ','citizen.myProblems':'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ','citizen.reportProblem':'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ','citizen.profile':'ᱯᱨᱚᱯᱟᱭᱞ','citizen.logout':'ᱞᱚᱜᱟᱣᱴ','citizen.hello':'ᱡᱚᱦᱟᱨ, {{name}}!','citizen.welcomeText':'ᱢᱤᱫ ᱥᱟᱶᱛᱟᱣ ᱛᱮ ᱵᱮᱥ ᱦᱚᱲᱜᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱢᱟᱫᱷᱟᱱ ᱵᱟᱹᱱᱟᱣ ᱫᱟᱹᱲᱟᱣ ᱟᱢ।','citizen.totalReports':'ᱢᱚᱴ ᱨᱤᱯᱚᱨᱴ','citizen.totalReportsDesc':'ᱟᱢ ᱡᱟᱹᱯᱟᱹᱣ ᱟᱠᱟᱫ ᱥᱚᱢᱚᱥᱭᱟ','citizen.underReview':'ᱡᱟᱹᱧᱪ ᱨᱮ','citizen.underReviewDesc':'AI / ᱥᱚᱨᱠᱟᱨ ᱡᱟᱹᱧᱪ ᱠᱟᱱᱟ','citizen.inProgress':'ᱠᱟᱹᱢ ᱪᱟᱹᱞᱩ','citizen.inProgressDesc':'ᱠᱟᱹᱢ ᱞᱟᱹᱜᱤᱫ ᱮᱢ ᱟᱠᱟᱱᱟ','citizen.completed':'ᱯᱩᱨᱟᱹ ᱮᱱᱟ','citizen.completedDesc':'ᱥᱚᱢᱟᱫᱷᱟᱱ ᱠᱟᱹᱨᱭᱟᱱᱣᱟᱭᱤᱛ ᱮᱱᱟ','citizen.newProblem':'ᱱᱟᱣᱟ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ','citizen.newProblemDesc':'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱨᱮ ᱧᱮᱞ ᱟᱠᱟᱫ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ।','citizen.addLocation':'ᱴᱷᱟᱶ ᱮᱢ ᱢᱮ','citizen.addLocationDesc':'ᱥᱚᱢᱟᱱ ᱴᱚᱞᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱨᱮ ᱥᱟᱦᱟᱭ ᱢᱮ','citizen.describeIssue':'ᱥᱚᱢᱚᱥᱭᱟ ᱵᱟᱹᱨᱮ ᱞᱟᱹᱭ ᱢᱮ','citizen.describeIssueDesc':'ᱵᱤᱵᱨᱚᱱ ᱟᱨ ᱯᱨᱚᱢᱟᱱ ᱮᱢ ᱢᱮ','citizen.selectCategory':'ᱥᱨᱮᱱᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ','citizen.selectCategoryDesc':'ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱴᱷᱤᱠ ᱯᱨᱚᱠᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ','citizen.submit':'ᱡᱟᱹᱯᱟᱹᱣ ᱢᱮ','citizen.submitDesc':'ᱟᱢᱟᱜ ᱨᱤᱯᱚᱨᱴ ᱵᱤᱥᱞᱮᱥᱚᱱ ᱦᱚᱪᱚᱜᱼᱟ','citizen.recentNotifications':'ᱱᱟᱣᱟ ᱞᱟᱹᱭ ᱛᱟᱦᱮᱸᱫ','citizen.recent':'ᱱᱟᱣᱟ','citizen.noNotifications':'ᱡᱟᱦᱟᱱ ᱞᱟᱹᱭ ᱵᱟᱝ','citizen.smallActions':'ᱦᱩᱰᱤᱧ ᱠᱟᱹᱢ ᱵᱟᱹᱲᱤ ᱵᱚᱫᱚᱞ ᱮᱢᱚᱜᱼᱟ','citizen.smallActionsDesc':'ᱟᱢᱟᱜ ᱨᱤᱯᱚᱨᱴ ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ, ᱥᱚᱨᱠᱟᱨ ᱟᱨ ᱥᱟᱦᱟᱭᱤᱭᱟ ᱠᱚ ᱴᱷᱤᱠ ᱥᱚᱢᱟᱫᱷᱟᱱ ᱧᱟᱢ ᱨᱮ ᱥᱟᱦᱟᱭ ᱠᱟᱱᱟ।','citizen.checkProfile':'ᱟᱢᱟᱜ ᱯᱨᱚᱯᱟᱭᱞ ᱧᱮᱞ ᱢᱮ','citizen.welcomeDashboard':'ᱟᱢᱟᱜ ᱦᱚᱲ ᱰᱮᱥᱵᱚᱨᱰ ᱨᱮ ᱡᱚᱦᱟᱨ','citizen.welcomeDashboardDesc':'ᱱᱚᱛᱮ ᱴᱚᱞᱟᱜᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱟᱨ ᱞᱟᱦᱟᱱ ᱧᱮᱞ ᱢᱮ।','citizen.getStarted':'ᱮᱦᱚᱵ ᱢᱮ','citizen.recently':'ᱱᱟᱣᱟ ᱜᱮ','citizen.earlier':'ᱞᱟᱦᱟᱱ','citizen.reportUpdated':'ᱟᱢᱟᱜ ᱨᱤᱯᱚᱨᱴ ᱱᱟᱣᱟ ᱮᱱᱟ','citizen.reportProcessing':'ᱟᱢᱟᱜ ᱨᱤᱯᱚᱨᱴ ᱠᱟᱹᱢ ᱨᱮ ᱢᱮᱱᱟ।','citizen.close':'ᱵᱚᱱᱫᱚ','citizen.view':'ᱧᱮᱞ ᱢᱮ','citizen.viewDetails':'ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ ᱢᱮ','citizen.problemProgress':'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱦᱟᱱ','citizen.trackProgress':'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱡᱟᱹᱯᱟᱹᱣ ᱠᱷᱚᱱ ᱥᱚᱢᱟᱫᱷᱟᱱ ᱛᱟᱹᱠ ᱠᱟᱹᱞᱟᱜ ᱞᱟᱦᱟᱱ ᱧᱮᱞ ᱢᱮ।','citizen.problemTitle':'ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱛᱟᱢ','citizen.categoryLocation':'ᱥᱨᱮᱱᱤ / ᱴᱷᱟᱶ','citizen.submittedOn':'ᱡᱟᱹᱯᱟᱹᱣ ᱛᱟᱨᱤᱠ','citizen.action':'ᱠᱟᱹᱢ'
  },
  ho: {}, nag: {}, kur: {}, kho: {}, mul: {}
};

// The remaining Jharkhand regional languages use the same simple citizen-facing
// wording already used in the voice/report UI. This keeps the dashboard in the
// selected language instead of silently falling back to English.
const hindiRegionalDashboard = {
  'citizen.portal':'नागरिक पोर्टल','citizen.home':'होम','citizen.dashboard':'डैशबोर्ड','citizen.myProblems':'मेरी समस्याएँ','citizen.reportProblem':'समस्या दर्ज करें','citizen.profile':'प्रोफ़ाइल','citizen.logout':'लॉग आउट','citizen.hello':'नमस्ते, {{name}}!','citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।','citizen.totalReports':'कुल रिपोर्ट','citizen.totalReportsDesc':'आपने दर्ज की गई समस्याएँ','citizen.underReview':'जाँच में','citizen.underReviewDesc':'AI / सरकार द्वारा जाँच की जा रही है','citizen.inProgress':'काम चल रहा है','citizen.inProgressDesc':'कार्रवाई के लिए भेजी गई','citizen.completed':'पूरा हुआ','citizen.completedDesc':'समाधान लागू किए गए','citizen.newProblem':'नई समस्या दर्ज करें','citizen.newProblemDesc':'अपने इलाके की कोई समस्या साझा करें।','citizen.addLocation':'स्थान जोड़ें','citizen.addLocationDesc':'सही जगह बताने में मदद करें','citizen.describeIssue':'समस्या बताएं','citizen.describeIssueDesc':'जानकारी और सबूत दें','citizen.selectCategory':'श्रेणी चुनें','citizen.selectCategoryDesc':'समस्या का सही प्रकार चुनें','citizen.submit':'जमा करें','citizen.submitDesc':'आपकी रिपोर्ट की जाँच होगी','citizen.recentNotifications':'हाल की सूचनाएँ','citizen.recent':'हाल की','citizen.noNotifications':'कोई सूचना नहीं','citizen.smallActions':'छोटे कदम बड़ा बदलाव लाते हैं','citizen.smallActionsDesc':'आपकी रिपोर्ट से विश्वविद्यालय, सरकार और साझेदार सही समाधान खोजने में मदद पाते हैं।','citizen.checkProfile':'अपनी प्रोफ़ाइल देखें','citizen.welcomeDashboard':'आपके नागरिक डैशबोर्ड में स्वागत है','citizen.welcomeDashboardDesc':'अपने इलाके की समस्या दर्ज करें और उसकी स्थिति देखें।','citizen.getStarted':'शुरू करें','citizen.recently':'अभी हाल में','citizen.earlier':'पहले','citizen.reportUpdated':'आपकी रिपोर्ट अपडेट हुई है','citizen.reportProcessing':'आपकी रिपोर्ट पर काम चल रहा है।','citizen.close':'बंद करें','citizen.view':'देखें','citizen.viewDetails':'विवरण देखें','citizen.problemProgress':'समस्या की प्रगति','citizen.trackProgress':'देखें कि आपकी समस्या दर्ज होने से समाधान तक कैसे आगे बढ़ रही है।','citizen.problemTitle':'समस्या का नाम','citizen.categoryLocation':'श्रेणी / स्थान','citizen.submittedOn':'जमा करने की तारीख','citizen.action':'कार्रवाई'
};
for (const code of ['ho','nag','kur','kho','mul']) citizenDashboardCopy[code] = { ...hindiRegionalDashboard };

const commonCitizenLabels = {
  en: {close:'Close',view:'View',viewDetails:'View Details',status:'Status',action:'Action',reportSubmitted:'Report Submitted',underAi:'Under AI Analysis',govValidation:'Government Validation',universityAssigned:'University Assigned',projectStarted:'Project Started',research:'Research / Development',deployed:'Solution Deployed',solved:'Problem Solved',completed:'Completed',current:'Current',upcoming:'Upcoming',reportedDetails:'Reported Problem Details',problemId:'Problem ID',category:'Category',submittedDate:'Submitted Date',description:'Description',noDescription:'No additional description provided.',emptyProblems:'You have not submitted any problems yet.',id:'ID',location:'Location'},
  hi: {close:'बंद करें',view:'देखें',viewDetails:'विवरण देखें',status:'स्थिति',action:'कार्रवाई',reportSubmitted:'रिपोर्ट जमा हुई',underAi:'AI जाँच में',govValidation:'सरकारी जाँच',universityAssigned:'विश्वविद्यालय को भेजा गया',projectStarted:'काम शुरू हुआ',research:'अनुसंधान / विकास',deployed:'समाधान लागू हुआ',solved:'समस्या हल हुई',completed:'पूरा हुआ',current:'वर्तमान',upcoming:'आगे',reportedDetails:'रिपोर्ट की जानकारी',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा करने की तारीख',description:'विवरण',noDescription:'कोई अतिरिक्त विवरण नहीं दिया गया।',emptyProblems:'आपने अभी तक कोई समस्या दर्ज नहीं की है।',id:'ID',location:'स्थान'},
  bn: {close:'বন্ধ করুন',view:'দেখুন',viewDetails:'বিস্তারিত দেখুন',status:'স্থিতি',action:'কাজ',reportSubmitted:'রিপোর্ট জমা হয়েছে',underAi:'AI বিশ্লেষণে',govValidation:'সরকারি যাচাই',universityAssigned:'বিশ্ববিদ্যালয়ে পাঠানো হয়েছে',projectStarted:'কাজ শুরু হয়েছে',research:'গবেষণা / উন্নয়ন',deployed:'সমাধান বাস্তবায়িত',solved:'সমস্যা সমাধান হয়েছে',completed:'সম্পন্ন',current:'বর্তমান',upcoming:'পরবর্তী',reportedDetails:'জানানো সমস্যার বিবরণ',problemId:'সমস্যার ID',category:'শ্রেণি',submittedDate:'জমার তারিখ',description:'বিবরণ',noDescription:'কোনও অতিরিক্ত বিবরণ দেওয়া হয়নি।',emptyProblems:'আপনি এখনও কোনও সমস্যা জানাননি।',id:'ID',location:'অবস্থান'},
  or: {close:'ବନ୍ଦ କରନ୍ତୁ',view:'ଦେଖନ୍ତୁ',viewDetails:'ବିବରଣୀ ଦେଖନ୍ତୁ',status:'ସ୍ଥିତି',action:'କାର୍ଯ୍ୟ',reportSubmitted:'ରିପୋର୍ଟ ଦାଖଲ ହୋଇଛି',underAi:'AI ବିଶ୍ଳେଷଣରେ',govValidation:'ସରକାରୀ ଯାଞ୍ଚ',universityAssigned:'ବିଶ୍ୱବିଦ୍ୟାଳୟକୁ ପଠାଯାଇଛି',projectStarted:'କାମ ଆରମ୍ଭ ହୋଇଛି',research:'ଗବେଷଣା / ବିକାଶ',deployed:'ସମାଧାନ କାର୍ଯ୍ୟକାରୀ',solved:'ସମସ୍ୟା ସମାଧାନ ହୋଇଛି',completed:'ସମାପ୍ତ',current:'ବର୍ତ୍ତମାନ',upcoming:'ପରବର୍ତ୍ତୀ',reportedDetails:'ଜଣାଇଥିବା ସମସ୍ୟାର ବିବରଣୀ',problemId:'ସମସ୍ୟା ID',category:'ଶ୍ରେଣୀ',submittedDate:'ଦାଖଲ ତାରିଖ',description:'ବିବରଣୀ',noDescription:'ଅତିରିକ୍ତ ବିବରଣୀ ନାହିଁ।',emptyProblems:'ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସମସ୍ୟା ଜଣାଇନାହାନ୍ତି।',id:'ID',location:'ସ୍ଥାନ'},
  sat: {close:'ᱵᱚᱱᱫᱚ',view:'ᱧᱮᱞ ᱢᱮ',viewDetails:'ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ ᱢᱮ',status:'ᱫᱟᱥᱟ',action:'ᱠᱟᱹᱢ',reportSubmitted:'ᱨᱤᱯᱚᱨᱴ ᱡᱟᱹᱯᱟᱹᱣ ᱮᱱᱟ',underAi:'AI ᱡᱟᱹᱧᱪ ᱨᱮ',govValidation:'ᱥᱚᱨᱠᱟᱨᱤ ᱡᱟᱹᱧᱪ',universityAssigned:'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ ᱨᱮ ᱮᱢ ᱮᱱᱟ',projectStarted:'ᱠᱟᱹᱢ ᱮᱦᱚᱵ ᱮᱱᱟ',research:'ᱯᱟᱹᱲᱦᱟᱣ / ᱵᱤᱠᱟᱥ',deployed:'ᱥᱚᱢᱟᱫᱷᱟᱱ ᱞᱟᱹᱜᱩ ᱮᱱᱟ',solved:'ᱥᱚᱢᱚᱥᱭᱟ ᱥᱚᱞᱵᱷ ᱮᱱᱟ',completed:'ᱯᱩᱨᱟᱹ ᱮᱱᱟ',current:'ᱱᱤᱛᱚᱜ',upcoming:'ᱞᱟᱦᱟᱱ',reportedDetails:'ᱞᱟᱹᱭ ᱟᱠᱟᱫ ᱥᱚᱢᱚᱥᱭᱟ ᱵᱤᱵᱨᱚᱱ',problemId:'ᱥᱚᱢᱚᱥᱭᱟ ID',category:'ᱥᱨᱮᱱᱤ',submittedDate:'ᱡᱟᱹᱯᱟᱹᱣ ᱛᱟᱨᱤᱠ',description:'ᱵᱤᱵᱨᱚᱱ',noDescription:'ᱡᱟᱦᱟᱱ ᱵᱟᱹᱲᱛᱤ ᱵᱤᱵᱨᱚᱱ ᱵᱟᱝ ᱮᱢ ᱮᱱᱟ।',emptyProblems:'ᱟᱢ ᱟᱡ ᱛᱟᱹᱠ ᱡᱟᱦᱟᱱ ᱥᱚᱢᱚᱥᱭᱟ ᱵᱟᱝ ᱞᱟᱹᱭ ᱟᱠᱟᱫᱟ।',id:'ID',location:'ᱴᱷᱟᱶ'},
  ho: {close:'बोंदो',view:'नोड मे',viewDetails:'बिवरन नोड मे',status:'दसा',action:'काज',reportSubmitted:'रिपोर्ट जमा हो गेल',underAi:'AI जांच मे',govValidation:'सरकारी जांच',universityAssigned:'विश्वविद्यालय के भेजल गेल',projectStarted:'काज एहोब हो गेल',research:'रिसर्च / विकास',deployed:'समाधान लागू हो गेल',solved:'समस्या हल हो गेल',completed:'पूरा हो गेल',current:'एखन',upcoming:'आगू',reportedDetails:'रिपोर्ट के बिवरन',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा तारीख',description:'बिवरन',noDescription:'कोनो अउरी बिवरन नाय देल गेल।',emptyProblems:'आम एखन तक कोनो समस्या नाय उदुब केना।',id:'ID',location:'जगह'},
  nag: {close:'बंद करू',view:'देखू',viewDetails:'विवरण देखू',status:'स्थिति',action:'काम',reportSubmitted:'रिपोर्ट जमा हो गेल',underAi:'AI जाँच में',govValidation:'सरकारी जाँच',universityAssigned:'विश्वविद्यालय भेजल गेल',projectStarted:'काम शुरू हो गेल',research:'शोध / विकास',deployed:'समाधान लागू हो गेल',solved:'समस्या हल हो गेल',completed:'पूरा हो गेल',current:'अभी',upcoming:'आगे',reportedDetails:'रिपोर्ट के विवरण',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा तारीख',description:'विवरण',noDescription:'कोनो अउरी विवरण नाय देल गेल।',emptyProblems:'आपने अभी तक कोनो समस्या नाय बतावल।',id:'ID',location:'जगह'},
  kur: {close:'बंद करू',view:'देखू',viewDetails:'विवरण देखू',status:'स्थिति',action:'काम',reportSubmitted:'रिपोर्ट जमा हो गेल',underAi:'AI जाँच में',govValidation:'सरकारी जाँच',universityAssigned:'विश्वविद्यालय भेजल गेल',projectStarted:'काम शुरू हो गेल',research:'शोध / विकास',deployed:'समाधान लागू हो गेल',solved:'समस्या हल हो गेल',completed:'पूरा हो गेल',current:'अभी',upcoming:'आगे',reportedDetails:'रिपोर्ट के विवरण',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा तारीख',description:'विवरण',noDescription:'कोनो अउरी विवरण नाय देल गेल।',emptyProblems:'आपने अभी तक कोनो समस्या नाय बतावल।',id:'ID',location:'जगह'},
  kho: {close:'बंद करू',view:'देखू',viewDetails:'विवरण देखू',status:'स्थिति',action:'काम',reportSubmitted:'रिपोर्ट जमा हो गेल',underAi:'AI जाँच में',govValidation:'सरकारी जाँच',universityAssigned:'विश्वविद्यालय भेजल गेल',projectStarted:'काम शुरू हो गेल',research:'शोध / विकास',deployed:'समाधान लागू हो गेल',solved:'समस्या हल हो गेल',completed:'पूरा हो गेल',current:'अभी',upcoming:'आगे',reportedDetails:'रिपोर्ट के विवरण',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा तारीख',description:'विवरण',noDescription:'कोनो अउरी विवरण नाय देल गेल।',emptyProblems:'आपने अभी तक कोनो समस्या नाय बतावल।',id:'ID',location:'जगह'},
  mul: {close:'बोंदो',view:'नोड मे',viewDetails:'बिवरन नोड मे',status:'दसा',action:'काज',reportSubmitted:'रिपोर्ट जमा हो गेल',underAi:'AI जांच मे',govValidation:'सरकारी जांच',universityAssigned:'विश्वविद्यालय के भेजल गेल',projectStarted:'काज एहोब हो गेल',research:'रिसर्च / विकास',deployed:'समाधान लागू हो गेल',solved:'समस्या हल हो गेल',completed:'पूरा हो गेल',current:'एखन',upcoming:'आगू',reportedDetails:'रिपोर्ट के बिवरन',problemId:'समस्या ID',category:'श्रेणी',submittedDate:'जमा तारीख',description:'बिवरन',noDescription:'कोनो अउरी बिवरन नाय देल गेल।',emptyProblems:'आम एखन तक कोनो समस्या नाय उदुब केना।',id:'ID',location:'जगह'}
};

for (const [code, copy] of Object.entries(citizenDashboardCopy)) ui[code] = { ...(ui[code] || {}), ...copy, ...(commonCitizenLabels[code] || {}) };
for (const code of Object.keys(citizenDashboardCopy)) {
  const extra = {
    en: {
      'module.citizen':'Citizen', 'common.notifications':'Notifications', 'common.logout':'Logout', 'common.profile':'Profile', 'citizen.dashboard':'Citizen Dashboard', 'citizen.myProblems':'My Reported Problems', 'citizen.myReportedProblems':'My Reported Problems', 'citizen.myReportedProblemsDesc':'Track real-time status and AI validation of all problems submitted by you.', 'citizen.totalReportsDesc':'Problems submitted by you', 'citizen.problemProgress':'Problem Progress', 'citizen.trackProgress':'Track how your reported problem is moving from submission to resolution.', 'citizen.inProgress':'In Progress', 'citizen.noNotifications':'No notifications', 'citizen.problemTitle':'Problem Title', 'citizen.categoryLocation':'Category / Location', 'citizen.submittedOn':'Submitted On', 'citizen.action':'Action', 'citizen.reportProblem':'Report Problem',
      'citizen.report':'Report', 'citizen.newNotif':'new', 'citizen.markAllRead':'Mark all read', 'citizen.viewArrow':'View →', 'citizen.viewAllReports':'View All Reports & Track Status →', 'citizen.recently':'Recently', 'citizen.earlier':'Earlier', 'citizen.oneHourAgo':'1 hour ago', 'citizen.twoHoursAgo':'2 hours ago', 'citizen.threeHoursAgo':'3 hours ago', 'citizen.yesterday':'Yesterday', 'citizen.twoDaysAgo':'2 days ago', 'citizen.threeDaysAgo':'3 days ago', 'citizen.tenMinsAgo':'10 mins ago',
      'citizen.notifStatusUnderReview':'Report Status: Under Review', 'citizen.notifWaterloggingDesc':'Your waterlogging issue was received and assigned to the local municipal ward officer.', 'citizen.notifAiAnalysisComplete':'AI Analysis Complete', 'citizen.notifAiAnalysisDesc':'AI categorized your problem under Infrastructure with High societal impact score.', 'citizen.notifUpvoteMilestone':'Community Upvote Milestone', 'citizen.notifUpvoteDesc':'Your reported road repair issue received 25 community upvotes in your locality.', 'citizen.notifSubmitNewIssue':'Submit a New Issue', 'citizen.notifSubmitNewIssueDesc':'Notice any civic or environmental issues in your area? Report with photo/voice in 30 seconds.', 'citizen.hello':'Hello, {{name}}!', 'citizen.welcomeText':'Together we can solve the civic and environmental issues in our locality.'
    },
    hi: {
      'module.citizen':'नागरिक', 'common.notifications':'सूचनाएँ', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें',
      'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले',
      'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।'
    },
    bn: {
      'module.citizen':'নাগরিক', 'common.notifications':'বিজ্ঞপ্তি', 'common.logout':'লগ আউট', 'common.profile':'প্রোফাইল', 'citizen.dashboard':'নাগরিক ড্যাশবোর্ড', 'citizen.myProblems':'আমার জানানো সমস্যা', 'citizen.myReportedProblems':'আমার জানানো সমস্যা', 'citizen.myReportedProblemsDesc':'আপনার জমা দেওয়া সমস্ত সমস্যার রিয়েল-টাইম অবস্থা এবং AI যাচাই ট্র্যাক করুন।', 'citizen.totalReportsDesc':'আপনার জমা দেওয়া সমস্যা', 'citizen.problemProgress':'সমস্যার অগ্রগতি', 'citizen.trackProgress':'আপনার সমস্যা জমা দেওয়া থেকে সমাধান পর্যন্ত কীভাবে এগোচ্ছে তা দেখুন।', 'citizen.inProgress':'চলমান', 'citizen.noNotifications':'কোনো বিজ্ঞপ্তি নেই', 'citizen.problemTitle':'সমস্যার নাম', 'citizen.categoryLocation':'শ্রেণি / অবস্থান', 'citizen.submittedOn':'জমার তারিখ', 'citizen.action':'কাজ', 'citizen.reportProblem':'সমস্যা জানান',
      'citizen.report':'রিপোর্ট', 'citizen.newNotif':'নতুন', 'citizen.markAllRead':'সব পঠিত চিহ্নিত করুন', 'citizen.viewArrow':'দেখুন →', 'citizen.viewAllReports':'সমস্ত রিপোর্ট দেখুন এবং অবস্থা ট্র্যাক করুন →', 'citizen.recently':'সম্প্রতি', 'citizen.earlier':'আগে', 'citizen.oneHourAgo':'১ ঘন্টা আগে', 'citizen.twoHoursAgo':'২ ঘন্টা আগে', 'citizen.threeHoursAgo':'৩ ঘন্টা আগে', 'citizen.yesterday':'গতকাল', 'citizen.twoDaysAgo':'২ দিন আগে', 'citizen.threeDaysAgo':'৩ দিন আগে', 'citizen.tenMinsAgo':'১০ মিনিট আগে',
      'citizen.notifStatusUnderReview':'রিপোর্ট অবস্থা: পর্যালোচনায়', 'citizen.notifWaterloggingDesc':'আপনার জল জমার সমস্যা প্রাপ্ত হয়েছে এবং স্থানীয় পৌর ওয়ার্ড কর্মকর্তার কাছে পাঠানো হয়েছে।', 'citizen.notifAiAnalysisComplete':'AI বিশ্লেষণ সম্পন্ন হয়েছে', 'citizen.notifAiAnalysisDesc':'AI আপনার সমস্যাটিকে উচ্চ প্রভাব স্কোরের সাথে পরিকাঠামো শ্রেণিতে শ্রেণীবদ্ধ করেছে।', 'citizen.notifUpvoteMilestone':'কমিউনিটি সমর্থনের মাইলফলক', 'citizen.notifUpvoteDesc':'আপনার রাস্তা মেরামতের সমস্যাটিতে আপনার এলাকায় ২৫টি কমিউনিটি ভোট পড়েছে।', 'citizen.notifSubmitNewIssue':'নতুন সমস্যা জানান', 'citizen.notifSubmitNewIssueDesc':'আপনার এলাকায় কোনো নাগরিক সমস্যা আছে? ৩০ সেকেন্ডে ছবি/কণ্ঠে রিপোর্ট করুন।', 'citizen.hello':'নমস্কার, {{name}}!', 'citizen.welcomeText':'একসাথে আমরা আমাদের এলাকার নাগরিক সমস্যার সমাধান করতে পারি।'
    },
    or: {
      'module.citizen':'ନାଗରିକ', 'common.notifications':'ବିଜ୍ଞପ୍ତି', 'common.logout':'ଲଗ୍ ଆଉଟ୍', 'common.profile':'ପ୍ରୋଫାଇଲ୍', 'citizen.dashboard':'ନାଗରିକ ଡ୍ୟାସବୋର୍ଡ', 'citizen.myProblems':'ମୋର ଦାଖଲ ସମସ୍ୟା', 'citizen.myReportedProblems':'ମୋର ଦାଖଲ ସମସ୍ୟା', 'citizen.myReportedProblemsDesc':'ଆପଣଙ୍କ ଦ୍ୱାରା ଦାଖଲ ହୋଇଥିବା ସମସ୍ତ ସମସ୍ୟାର ସ୍ଥିତି ଏବଂ AI ଯାଞ୍ଚ ଟ୍ରାକ୍ କରନ୍ତୁ।', 'citizen.totalReportsDesc':'ଆପଣଙ୍କ ଦାଖଲ ସମସ୍ୟା', 'citizen.problemProgress':'ସମସ୍ୟା ଅଗ୍ରଗତି', 'citizen.trackProgress':'ଆପଣଙ୍କ ସମସ୍ୟା ଦାଖଲରୁ ସମାଧାନ ଯାଏଁ କିପରି ଆଗେଇଛି ଦେଖନ୍ତୁ।', 'citizen.inProgress':'ଚାଲୁଛି', 'citizen.noNotifications':'କୌଣସି ସୂଚନା ନାହିଁ', 'citizen.problemTitle':'ସମସ୍ୟାର ନାମ', 'citizen.categoryLocation':'ଶ୍ରେଣୀ / ସ୍ଥାନ', 'citizen.submittedOn':'ଦାଖଲ ତାରିଖ', 'citizen.action':'କାର୍ଯ୍ୟ', 'citizen.reportProblem':'ସମସ୍ୟା ଜଣାନ୍ତୁ',
      'citizen.report':'ରିପୋର୍ଟ', 'citizen.newNotif':'ନୂଆ', 'citizen.markAllRead':'ସବୁ ପଢ଼ା ହୋଇଛି ଚିହ୍ନଟ କରନ୍ତୁ', 'citizen.viewArrow':'ଦେଖନ୍ତୁ →', 'citizen.viewAllReports':'ସମସ୍ତ ରିପୋର୍ଟ ଦେଖନ୍ତୁ ଏବଂ ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ →', 'citizen.recently':'ନିକଟରେ', 'citizen.earlier':'ପୂର୍ବରୁ', 'citizen.oneHourAgo':'୧ ଘଣ୍ଟା ପୂର୍ବରୁ', 'citizen.twoHoursAgo':'୨ ଘଣ୍ଟା ପୂର୍ବରୁ', 'citizen.threeHoursAgo':'୩ ଘଣ୍ଟା ପୂର୍ବରୁ', 'citizen.yesterday':'ଗତକାଲି', 'citizen.twoDaysAgo':'୨ ଦିନ ପୂର୍ବରୁ', 'citizen.threeDaysAgo':'୩ ଦିନ ପୂର୍ବରୁ', 'citizen.tenMinsAgo':'୧୦ ମିନିଟ୍ ପୂର୍ବରୁ',
      'citizen.notifStatusUnderReview':'ରିପୋର୍ଟ ସ୍ଥିତି: ଯାଞ୍ଚରେ', 'citizen.notifWaterloggingDesc':'ଆପଣଙ୍କ ଜଳବନ୍ଦୀ ସମସ୍ୟା ମିଳିଛି ଏବଂ ସ୍ଥାନୀୟ ପୌର ୱାର୍ଡ ଅଧିକାରୀଙ୍କୁ ଦିଆଯାଇଛି।', 'citizen.notifAiAnalysisComplete':'AI ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି', 'citizen.notifAiAnalysisDesc':'AI ଆପଣଙ୍କ ସମସ୍ୟାକୁ ଉଚ୍ଚ ପ୍ରଭାବ ସ୍କୋର ସହ ଭିତ୍ତିଭୂମି ଶ୍ରେଣୀରେ ବର୍ଗୀକୃତ କରିଛି।', 'citizen.notifUpvoteMilestone':'ସମ୍ପ୍ରଦାୟ ସମର୍ଥନ ମାଇଲଷ୍ଟୋନ୍', 'citizen.notifUpvoteDesc':'ଆପଣଙ୍କ ରାସ୍ତା ମରାମତି ସମସ୍ୟାରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ୨୫ଟି ସମର୍ଥନ ମିଳିଛି।', 'citizen.notifSubmitNewIssue':'ନୂଆ ସମସ୍ୟା ଜଣାନ୍ତୁ', 'citizen.notifSubmitNewIssueDesc':'ଆପଣଙ୍କ ଅଞ୍ଚଳରେ କୌଣସି ସମସ୍ୟା ଅଛି କି? ୩୦ ସେକେଣ୍ଡରେ ଫଟୋ/କଥାରେ ଜଣାନ୍ତୁ।', 'citizen.hello':'ନମସ୍କାର, {{name}}!', 'citizen.welcomeText':'ମିଶିକରି ଆମେ ଆମ ଅଞ୍ଚଳର ସମସ୍ୟାର ସମାଧାନ କରିପାରିବା।'
    },
    sat: {
      'module.citizen':'ᱦᱚᱲ', 'common.notifications':'ᱞᱟᱹᱭ ᱛᱟᱦᱮᱸᱫ', 'common.logout':'ᱞᱚᱜᱽ ᱟᱣᱩᱴ', 'common.profile':'ᱯᱨᱚᱯᱟᱭᱞ', 'citizen.dashboard':'ᱱᱟᱜᱟᱨᱤᱠ ᱰᱮᱥᱵᱳᱨᱰ', 'citizen.myProblems':'ᱤᱧᱟᱜ ᱞᱟᱹᱭ ᱥᱚᱢᱚᱥᱭᱟ', 'citizen.myReportedProblems':'ᱤᱧᱟᱜ ᱞᱟᱹᱭ ᱥᱚᱢᱚᱥᱭᱟ', 'citizen.myReportedProblemsDesc':'ᱟᱢ ᱡᱚᱢᱟ ᱠᱟᱫ ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱫᱚᱨᱡᱟ ᱟᱨ AI ᱯᱨᱚᱢᱟᱱ ᱴᱨᱮᱠ ᱢᱮ।', 'citizen.totalReportsDesc':'ᱟᱢ ᱡᱚᱢᱟ ᱠᱟᱫ ᱥᱚᱢᱚᱥᱭᱟ', 'citizen.problemProgress':'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱦᱟᱣ', 'citizen.trackProgress':'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱡᱚᱢᱟ ᱠᱷᱚᱱ ᱥᱚᱢᱟᱫᱷᱟᱱ ᱦᱟᱹᱵᱤᱡ ᱪᱮᱠᱟ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ ᱧᱮᱞ ᱢᱮ।', 'citizen.inProgress':'ᱪᱟᱹᱞᱩ', 'citizen.noNotifications':'ᱪᱮᱫ ᱦᱚᱸ ᱥᱩᱪᱱᱟ ᱵᱟᱝ', 'citizen.problemTitle':'ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ', 'citizen.categoryLocation':'ᱥᱨᱮᱱᱤ / ᱡᱟᱭᱜᱟ', 'citizen.submittedOn':'ᱡᱚᱢᱟ ᱛᱟᱹᱨᱤᱠᱷ', 'citizen.action':'ᱠᱟᱹᱢᱤ', 'citizen.reportProblem':'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ',
      'citizen.report':'ᱨᱤᱯᱚᱨᱴ', 'citizen.newNotif':'ᱱᱟᱣᱟ', 'citizen.markAllRead':'ᱡᱚᱛᱚ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', 'citizen.viewArrow':'ᱧᱮᱞ ᱢᱮ →', 'citizen.viewAllReports':'ᱡᱚᱛᱚ ᱨᱤᱯᱚᱨᱴ ᱧᱮᱞ ᱟᱨ ᱫᱚᱨᱡᱟ ᱴᱨᱮᱠ ᱢᱮ →', 'citizen.recently':'ᱱᱤᱛᱚᱜ ᱜᱮ', 'citizen.earlier':'ᱢᱟᱲᱟᱝ', 'citizen.oneHourAgo':'᱑ ᱜᱷᱟᱱᱴᱟ ᱢᱟᱲᱟᱝ', 'citizen.twoHoursAgo':'᱒ ᱜᱷᱟᱱᱴᱟ ᱢᱟᱲᱟᱝ', 'citizen.threeHoursAgo':'᱓ ᱜᱷᱟᱱᱴᱟ ᱢᱟᱲᱟᱝ', 'citizen.yesterday':'ᱦᱚᱞᱟ', 'citizen.twoDaysAgo':'᱒ ᱢᱟᱦᱟᱸ ᱢᱟᱲᱟᱝ', 'citizen.threeDaysAgo':'᱓ ᱢᱟᱦᱟᱸ ᱢᱟᱲᱟᱝ', 'citizen.tenMinsAgo':'᱑᱐ ᱢᱤᱱᱤᱴ ᱢᱟᱲᱟᱝ',
      'citizen.notifStatusUnderReview':'ᱨᱤᱯᱚᱨᱴ ᱫᱚᱨᱡᱟ: ᱧᱮᱞ ᱨᱮ', 'citizen.notifWaterloggingDesc':'ᱟᱢᱟᱜ ᱫᱟᱜ ᱡᱟᱢᱟ ᱥᱚᱢᱚᱥᱭᱟ ᱧᱟᱢ ᱮᱱᱟ ᱟᱨ ᱱᱚᱜᱚᱨ ᱣᱟᱨᱰ ᱟᱯᱷᱤᱥᱟᱨ ᱴᱷᱮᱱ ᱮᱢ ᱮᱱᱟ।', 'citizen.notifAiAnalysisComplete':'AI ᱡᱟᱹᱧᱪ ᱯᱩᱨᱟᱹ ᱮᱱᱟ', 'citizen.notifAiAnalysisDesc':'AI ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱩᱥᱩᱞ ᱯᱨᱚᱵᱷᱟᱵ ᱥᱟᱶ ᱤᱱᱯᱷᱨᱟᱥᱴᱨᱟᱠᱪᱟᱨ ᱨᱮ ᱵᱟᱪᱷᱟᱣ ᱠᱮᱫᱟ।', 'citizen.notifUpvoteMilestone':'ᱜᱟᱶᱛᱟ ᱥᱟᱦᱟᱭ ᱢᱟᱭᱤᱞᱥᱴᱳᱱ', 'citizen.notifUpvoteDesc':'ᱟᱢᱟᱜ ᱨᱟᱥᱛᱟ ᱵᱮᱱᱟᱣ ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮ ᱒᱕ ᱦᱚᱲ ᱥᱟᱦᱟᱭ ᱮᱢ ᱠᱮᱫᱟ।', 'citizen.notifSubmitNewIssue':'ᱱᱟᱣᱟ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱢᱮ', 'citizen.notifSubmitNewIssueDesc':'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱨᱮ ᱡᱟᱦᱟᱱ ᱥᱚᱢᱚᱥᱭᱟ ᱢᱮᱱᱟᱜ-ᱟ? ᱓᱐ ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱪᱤᱛᱟᱹᱨ ᱥᱟᱶ ᱞᱟᱹᱭ ᱢᱮ।', 'citizen.hello':'ᱡᱚᱦᱟᱨ, {{name}}!', 'citizen.welcomeText':'ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱟᱵᱚ ᱴᱚᱞᱟ ᱨᱮᱭᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱥᱚᱢᱟᱫᱷᱟᱱ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ।'
    },
    ho: { 'module.citizen':'होड़', 'common.notifications':'सूचना', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें', 'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले', 'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।' },
    nag: { 'module.citizen':'नागरिक', 'common.notifications':'सूचना', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें', 'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले', 'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।' },
    kur: { 'module.citizen':'नागरिक', 'common.notifications':'सूचना', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें', 'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले', 'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।' },
    kho: { 'module.citizen':'नागरिक', 'common.notifications':'सूचना', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें', 'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले', 'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।' },
    mul: { 'module.citizen':'होड़', 'common.notifications':'सूचना', 'common.logout':'लॉग आउट', 'common.profile':'प्रोफ़ाइल', 'citizen.dashboard':'नागरिक डैशबोर्ड', 'citizen.myProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblems':'मेरी दर्ज समस्याएँ', 'citizen.myReportedProblemsDesc':'आपके द्वारा दर्ज की गई सभी समस्याओं की स्थिति और AI सत्यापन ट्रैक करें।', 'citizen.totalReportsDesc':'आपके द्वारा दर्ज की गई समस्याएँ', 'citizen.problemProgress':'समस्या की प्रगति', 'citizen.trackProgress':'देखें कि आपकी दर्ज समस्या जमा होने से लेकर समाधान तक कैसे आगे बढ़ रही है।', 'citizen.inProgress':'प्रगति पर', 'citizen.noNotifications':'कोई सूचना नहीं', 'citizen.problemTitle':'समस्या का नाम', 'citizen.categoryLocation':'श्रेणी / स्थान', 'citizen.submittedOn':'जमा करने की तारीख', 'citizen.action':'कार्रवाई', 'citizen.reportProblem':'समस्या दर्ज करें', 'citizen.report':'रिपोर्ट', 'citizen.newNotif':'नया', 'citizen.markAllRead':'सभी पढ़ा हुआ चिह्नित करें', 'citizen.viewArrow':'देखें →', 'citizen.viewAllReports':'सभी रिपोर्ट देखें और स्थिति ट्रैक करें →', 'citizen.recently':'अभी हाल में', 'citizen.earlier':'पहले', 'citizen.oneHourAgo':'1 घंटे पहले', 'citizen.twoHoursAgo':'2 घंटे पहले', 'citizen.threeHoursAgo':'3 घंटे पहले', 'citizen.yesterday':'कल', 'citizen.twoDaysAgo':'2 दिन पहले', 'citizen.threeDaysAgo':'3 दिन पहले', 'citizen.tenMinsAgo':'10 मिनट पहले', 'citizen.notifStatusUnderReview':'रिपोर्ट स्थिति: जाँच में', 'citizen.notifWaterloggingDesc':'आपकी जलभराव समस्या प्राप्त हुई और स्थानीय नगरपालिका वार्ड अधिकारी को सौंपी गई।', 'citizen.notifAiAnalysisComplete':'AI जाँच पूरी हुई', 'citizen.notifAiAnalysisDesc':'AI ने आपकी समस्या को उच्च प्रभाव स्कोर के साथ बुनियादी ढांचा श्रेणी में वर्गीकृत किया।', 'citizen.notifUpvoteMilestone':'सामुदायिक समर्थन मील का पत्थर', 'citizen.notifUpvoteDesc':'आपकी सड़क मरम्मत समस्या को आपके क्षेत्र में 25 सामुदायिक वोट मिले।', 'citizen.notifSubmitNewIssue':'नई समस्या दर्ज करें', 'citizen.notifSubmitNewIssueDesc':'क्या आपके क्षेत्र में कोई नागरिक या पर्यावरणीय समस्या है? 30 सेकंड में फोटो/आवाज़ के साथ रिपोर्ट करें।', 'citizen.hello':'नमस्ते, {{name}}!', 'citizen.welcomeText':'मिलकर हम अपने आसपास की समस्याओं का समाधान कर सकते हैं।' }
  };
  ui[code] = { ...ui[code], ...(extra[code] || {}) };
}

for (const [code, copy] of Object.entries(reportMethodCopy)) ui[code] = { ...(ui[code] || {}), ...copy };
for (const [code, copy] of Object.entries(regionalMethodCopy)) ui[code] = { ...(ui[code] || {}), ...copy };

const citizenExtraLabels = {
  en: {
    'citizen.userProfile':'Citizen Profile','citizen.profileDesc':'Manage your civic profile details, track reported issues, and view community impact.','citizen.role':'Role','location':'Location','district':'District','selectDistrict':'Select District','notProvided':'Not provided','problemsSubmitted':'Problems Submitted','accountStatus':'Account Status','activeVerified':'Active Verified','memberSince':'Member Since','districtArea':'District Area','categoryHealthcare':'Healthcare','categoryWasteManagement':'Waste Management','categoryWaterManagement':'Water Management','categoryEducation':'Education','categoryRoads':'Roads','categorySanitation':'Sanitation','categoryPublicSafety':'Public Safety','categoryGeneral':'General','citizen.approvedActiveChallenge':'Approved as Active Challenge','citizen.pendingReview':'Pending Review','citizen.underAiAnalysis':'Under AI Analysis','citizen.inProgressStatus':'In Progress','citizen.completedStatus':'Completed',
    submitReport:'Submit Report',clearRerecord:'Clear & Re-record',submittingReport:'Submitting...',reportByVoice:'Report Problem by Voice',voiceDescription:'Speak naturally about the civic or environmental issue in your area. AI will transcribe and analyze it.',storedInMongo:'Stored in Database',voiceReportSubmittedSuccess:'Voice Report Submitted Successfully!',voiceReportSubmittedDesc:'Your problem has been registered in the database and analyzed by AI.',trackOnDashboard:'Track on Dashboard',reportAnotherIssue:'Report Another Issue',back:'Back',
    personalInfo:'Personal Information',civicDetails:'Civic Jurisdiction & Location',contactInfo:'Contact Details',fullName:'Full Name',email:'Email Address',phone:'Phone Number',citizenId:'Citizen ID',preferredLang:'Preferred Language',jurisdiction:'Jurisdiction Level',civicBadges:'Civic Badges & Recognition',recentActivity:'Recent Reported Issues',privacySettings:'Privacy & Account Preferences',editProfile:'Edit Profile',saveChanges:'Save Changes',saving:'Saving...',verifiedCitizen:'Verified Citizen',stateJharkhand:'Jharkhand',civicScore:'Civic Engagement Score',upvotesCount:'Community Upvotes',underReviewCount:'Under Review',inProgressCount:'In Progress',resolvedCount:'Resolved / Completed',totalProblems:'Total Problems Reported',viewAllProblems:'View All Issues',noRecentActivity:'No recent reported problems found.',anonymousMode:'Anonymous Mode',anonymousDesc:'Hide citizen identity when submitting sensitive community issues',locationRadius:'Location Privacy Protection',locationRadiusDesc:'500m area blur applied on public maps',notifications:'Status Notifications',notificationsDesc:'In-app & SMS alerts enabled for problem resolution',updateProfileSuccess:'Profile updated successfully!',bio:'About / Civic Bio',bioPlaceholder:'Brief description of your civic involvement or community background...',residentOf:'Resident of',reportNewProblem:'Report a Problem',verifiedResident:'Verified Resident',activeCivicLeader:'Active Civic Leader',impactMaker:'Community Impact Maker',viewProblem:'View'
  },
  hi: {
    'citizen.userProfile':'नागरिक प्रोफ़ाइल','citizen.profileDesc':'अपनी नागरिक प्रोफ़ाइल प्रबंधित करें, दर्ज समस्याओं को ट्रैक करें और प्रभाव देखें।','citizen.role':'भूमिका','location':'स्थान','district':'जिला','selectDistrict':'जिला चुनें','notProvided':'उपलब्ध नहीं','problemsSubmitted':'दर्ज की गई समस्याएँ','accountStatus':'खाता स्थिति','activeVerified':'सक्रिय और सत्यापित','memberSince':'सदस्य बने','districtArea':'जिला क्षेत्र','categoryHealthcare':'स्वास्थ्य सेवा','categoryWasteManagement':'कचरा प्रबंधन','categoryWaterManagement':'जल प्रबंधन','categoryEducation':'शिक्षा','categoryRoads':'सड़कें','categorySanitation':'स्वच्छता','categoryPublicSafety':'सार्वजनिक सुरक्षा','categoryGeneral':'सामान्य','citizen.approvedActiveChallenge':'सक्रिय चुनौती के रूप में स्वीकृत','citizen.pendingReview':'जाँच लंबित','citizen.underAiAnalysis':'AI जाँच में','citizen.inProgressStatus':'काम चल रहा है','citizen.completedStatus':'पूरा हुआ',
    submitReport:'रिपोर्ट जमा करें',clearRerecord:'हटाएं और फिर से रिकॉर्ड करें',submittingReport:'रिपोर्ट जमा हो रही है...',reportByVoice:'आवाज़ से समस्या दर्ज करें',voiceDescription:'अपने क्षेत्र की नागरिक या पर्यावरणीय समस्या के बारे में सहजता से बोलें। AI इसे लिखेगा और विश्लेषण करेगा।',storedInMongo:'डेटाबेस में सुरक्षित',voiceReportSubmittedSuccess:'आवाज़ रिपोर्ट सफलतापूर्वक दर्ज हो गई!',voiceReportSubmittedDesc:'आपकी समस्या डेटाबेस में दर्ज हो गई है और AI द्वारा विश्लेषित की गई है।',trackOnDashboard:'डैशबोर्ड पर ट्रैक करें',reportAnotherIssue:'एक और समस्या दर्ज करें',back:'वापस',
    personalInfo:'व्यक्तिगत जानकारी',civicDetails:'नागरिक अधिकार क्षेत्र एवं स्थान',contactInfo:'संपर्क विवरण',fullName:'पूरा नाम',email:'ईमेल पता',phone:'फ़ोन नंबर',citizenId:'नागरिक आईडी',preferredLang:'पसंदीदा भाषा',jurisdiction:'प्रशासनिक स्तर',civicBadges:'नागरिक बैज और सम्मान',recentActivity:'हाल ही में दर्ज की गई समस्याएँ',privacySettings:'गोपनीयता और खाता प्राथमिकताएं',editProfile:'प्रोफ़ाइल बदलें',saveChanges:'बदलाव सहेजें',saving:'सहेजा जा रहा है...',verifiedCitizen:'सत्यापित नागरिक',stateJharkhand:'झारखंड',civicScore:'नागरिक सहभागिता स्कोर',upvotesCount:'सामुदायिक समर्थन (वोट)',underReviewCount:'जाँच में',inProgressCount:'प्रगति पर',resolvedCount:'हल / पूर्ण',totalProblems:'कुल दर्ज समस्याएँ',viewAllProblems:'सभी समस्याएँ देखें',noRecentActivity:'हाल की कोई समस्या दर्ज नहीं की गई है।',anonymousMode:'गुमनाम रिपोर्टिंग मोड',anonymousDesc:'संवेदनशील नागरिक समस्याएं दर्ज करते समय पहचान छिपाएं',locationRadius:'स्थान गोपनीयता सुरक्षा',locationRadiusDesc:'सार्वजनिक मानचित्र पर 500 मीटर क्षेत्र सुरक्षा लागू',notifications:'स्थिति सूचनाएं',notificationsDesc:'समस्या समाधान अपडेट के लिए इन-ऐप और SMS सूचनाएं सक्रिय',updateProfileSuccess:'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',bio:'परिचय / नागरिक विवरण',bioPlaceholder:'अपने नागरिक योगदान या सामुदायिक कार्यों के बारे में संक्षेप में लिखें...',residentOf:'निवासी',reportNewProblem:'समस्या दर्ज करें',verifiedResident:'सत्यापित निवासी',activeCivicLeader:'सक्रिय नागरिक लीडर',impactMaker:'सामुदायिक प्रभाव निर्माता',viewProblem:'देखें'
  },
  bn: {
    'citizen.userProfile':'নাগরিক প্রোফাইল','citizen.profileDesc':'আপনার নাগরিক প্রোফাইল পরিচালনা করুন, সমস্যা ট্র্যাক করুন এবং প্ল্যাটফর্ম অবদান দেখুন।','citizen.role':'ভূমিকা','location':'অবস্থান','district':'জেলা','selectDistrict':'জেলা বাছুন','notProvided':'দেওয়া হয়নি','problemsSubmitted':'জমা দেওয়া সমস্যা','accountStatus':'অ্যাকাউন্টের অবস্থা','activeVerified':'সক্রিয় ও যাচাইকৃত','memberSince':'সদস্য হওয়ার সময়','districtArea':'জেলা এলাকা','categoryHealthcare':'স্বাস্থ্যসেবা','categoryWasteManagement':'বর্জ্য ব্যবস্থাপনা','categoryWaterManagement':'জল ব্যবস্থাপনা','categoryEducation':'শিক্ষা','categoryRoads':'রাস্তা','categorySanitation':'স্যানিটেশন','categoryPublicSafety':'জননিরাপত্তা','categoryGeneral':'সাধারণ','citizen.approvedActiveChallenge':'সক্রিয় চ্যালেঞ্জ হিসেবে অনুমোদিত','citizen.pendingReview':'পর্যালোচনা অপেক্ষমাণ','citizen.underAiAnalysis':'AI বিশ্লেষণে','citizen.inProgressStatus':'চলমান','citizen.completedStatus':'সম্পন্ন',
    submitReport:'রিপোর্ট জমা দিন',clearRerecord:'মুছে আবার রেকর্ড করুন',submittingReport:'রিপোর্ট জমা হচ্ছে...',reportByVoice:'কণ্ঠে সমস্যা জানান',voiceDescription:'আপনার এলাকার নাগরিক সমস্যা সম্পর্কে স্বাভাবিকভাবে বলুন। AI এটি প্রতিলিপি ও বিশ্লেষণ করবে।',storedInMongo:'ডাটাবেসে সংরক্ষিত',voiceReportSubmittedSuccess:'ভয়েস রিপোর্ট সফলভাবে জমা হয়েছে!',voiceReportSubmittedDesc:'আপনার সমস্যা ডাটাবেসে নিবন্ধিত হয়েছে এবং AI দ্বারা বিশ্লেষিত হয়েছে।',trackOnDashboard:'ড্যাশবোর্ডে ট্র্যাক করুন',reportAnotherIssue:'আরেকটি সমস্যা জানান',back:'পিছনে',
    personalInfo:'ব্যক্তিগত তথ্য',civicDetails:'নাগরিক এখতিয়ার ও অবস্থান',contactInfo:'যোগাযোগের বিবরণ',fullName:'পুরো নাম',email:'ইমেল ঠিকানা',phone:'ফোন নম্বর',citizenId:'নাগরিক আইডি',preferredLang:'পছন্দের ভাষা',jurisdiction:'প্রশাসনিক স্তর',civicBadges:'নাগরিক ব্যাজ ও সম্মাননা',recentActivity:'সম্প্রতি জমা দেওয়া সমস্যা',privacySettings:'গোপনীয়তা ও অ্যাকাউন্ট পছন্দ',editProfile:'প্রোফাইল পরিবর্তন',saveChanges:'সংরক্ষণ করুন',saving:'সংরক্ষণ হচ্ছে...',verifiedCitizen:'যাচাইকৃত নাগরিক',stateJharkhand:'ঝাড়খণ্ড',civicScore:'নাগরিক অংশগ্রহণ স্কোর',upvotesCount:'কমিউনিটি সমর্থন',underReviewCount:'পর্যালোচনাধীন',inProgressCount:'চলমান',resolvedCount:'সমাধান / সম্পন্ন',totalProblems:'মোট সমস্যা',viewAllProblems:'সব সমস্যা দেখুন',noRecentActivity:'কোনো সাম্প্রতিক সমস্যা পাওয়া যায়নি।',anonymousMode:'বেনামী রিপোর্টিং মোড',anonymousDesc:'সংবেদনশীল সমস্যা জমা দেওয়ার সময় পরিচয় গোপন রাখুন',locationRadius:'অবস্থান গোপনীয়তা সুরক্ষা',locationRadiusDesc:'মানচিত্রে ৫০০ মিটার এলাকা সুরক্ষা প্রযোজ্য',notifications:'বিজ্ঞপ্তি সতর্কতা',notificationsDesc:'সমস্যা সমাধানের জন্য ইন-অ্যাপ এবং এসএমএস বিজ্ঞপ্তি সক্রিয়',updateProfileSuccess:'প্রোফাইল সফলভাবে আপডেট হয়েছে!',bio:'পরিচয় / বিবরণ',bioPlaceholder:'আপনার সামাজিক কাজ বা অবদান সম্পর্কে লিখুন...',residentOf:'বাসিন্দা',reportNewProblem:'সমস্যা জানান',verifiedResident:'যাচাইকৃত বাসিন্দা',activeCivicLeader:'সক্রিয় নাগরিক নেতা',impactMaker:'কমিউনিটি প্রভাব নির্মাতা',viewProblem:'দেখুন'
  },
  or: {
    'citizen.userProfile':'ନାଗରିକ ପ୍ରୋଫାଇଲ୍','citizen.profileDesc':'ଆପଣଙ୍କ ନାଗରିକ ପ୍ରୋଫାଇଲ୍ ପରିଚାଳନା କରନ୍ତୁ, ସମସ୍ୟା ଟ୍ରାକ୍ କରନ୍ତୁ ଓ ଅବଦାନ ଦେଖନ୍ତୁ।','citizen.role':'ଭୂମିକା','location':'ସ୍ଥାନ','district':'ଜିଲ୍ଲା','selectDistrict':'ଜିଲ୍ଲା ବାଛନ୍ତୁ','notProvided':'ଦିଆଯାଇନାହିଁ','problemsSubmitted':'ଦାଖଲ ସମସ୍ୟା','accountStatus':'ଖାତା ସ୍ଥିତି','activeVerified':'ସକ୍ରିୟ ଓ ଯାଞ୍ଚିତ','memberSince':'ସଦସ୍ୟ ହେବାଠାରୁ','districtArea':'ଜିଲ୍ଲା ଅଞ୍ଚଳ','categoryHealthcare':'ସ୍ୱାସ୍ଥ୍ୟସେବା','categoryWasteManagement':'ଆବର୍ଜନା ପରିଚାଳନା','categoryWaterManagement':'ଜଳ ପରିଚାଳନା','categoryEducation':'ଶିକ୍ଷା','categoryRoads':'ରାସ୍ତା','categorySanitation':'ପରିମଳ','categoryPublicSafety':'ଜନସୁରକ୍ଷା','categoryGeneral':'ସାଧାରଣ','citizen.approvedActiveChallenge':'ସକ୍ରିୟ ଚ୍ୟାଲେଞ୍ଜ ଭାବେ ଅନୁମୋଦିତ','citizen.pendingReview':'ଯାଞ୍ଚ ଅପେକ୍ଷାରେ','citizen.underAiAnalysis':'AI ବିଶ୍ଳେଷଣରେ','citizen.inProgressStatus':'ଚାଲୁଛି','citizen.completedStatus':'ସମାପ୍ତ',
    submitReport:'ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ',clearRerecord:'ହଟାଇ ପୁଣି ରେକର୍ଡ କରନ୍ତୁ',submittingReport:'ରିପୋର୍ଟ ଦାଖଲ ହେଉଛି...',reportByVoice:'କଥାରେ ସମସ୍ୟା ଜଣାନ୍ତୁ',voiceDescription:'ଆପଣଙ୍କ ଅଞ୍ଚଳର ସମସ୍ୟା ବିଷୟରେ ସ୍ୱାଭାବିକ ଭାବେ କୁହନ୍ତୁ। AI ଏହାକୁ ଲେଖିବ ଓ ବିଶ୍ଳେଷଣ କରିବ।',storedInMongo:'ଡାଟାବେସରେ ସଂରକ୍ଷିତ',voiceReportSubmittedSuccess:'ଭଏସ୍ ରିପୋର୍ଟ ସଫଳତାର ସହ ଦାଖଲ ହୋଇଛି!',voiceReportSubmittedDesc:'ଆପଣଙ୍କ ସମସ୍ୟା ଡାଟାବେସରେ ପଞ୍ଜୀକୃତ ହୋଇଛି ଏବଂ AI ଦ୍ୱାରା ବିଶ୍ଳେଷଣ କରାଯାଇଛି।',trackOnDashboard:'ଡ୍ୟାସବୋର୍ଡରେ ଟ୍ରାକ୍ କରନ୍ତୁ',reportAnotherIssue:'ଆଉ ଏକ ସମସ୍ୟା ଜଣାନ୍ତୁ',back:'ପଛକୁ',
    personalInfo:'ବ୍ୟକ୍ତିଗତ ସୂଚନା',civicDetails:'ନାଗରିକ ଅଧିକାର କ୍ଷେତ୍ର ଓ ସ୍ଥାନ',contactInfo:'ଯୋଗାଯୋଗ ବିବରଣୀ',fullName:'ପୂରା ନାମ',email:'ଇମେଲ୍ ଠିକଣା',phone:'ଫୋନ୍ ନମ୍ବର',citizenId:'ନାଗରିକ ଆଇଡି',preferredLang:'ପସନ୍ଦ ଭାଷା',jurisdiction:'ପ୍ରଶାସନିକ ସ୍ତର',civicBadges:'ନାଗରିକ ବ୍ୟାଜ୍ ଓ ସମ୍ମାନ',recentActivity:'ନିକଟରେ ଦାଖଲ ସମସ୍ୟା',privacySettings:'ଗୋପନୀୟତା ଓ ଖାତା ପସନ୍ଦ',editProfile:'ପ୍ରୋଫାଇଲ୍ ସମ୍ପାଦନ',saveChanges:'ସଂରକ୍ଷଣ କରନ୍ତୁ',saving:'ସଂରକ୍ଷଣ ହେଉଛି...',verifiedCitizen:'ଯାଞ୍ଚିତ ନାଗରିକ',stateJharkhand:'ଝାଡ଼ଖଣ୍ଡ',civicScore:'ନାଗରିକ ଅଂଶଗ୍ରହଣ ସ୍କୋର',upvotesCount:'ସମୁଦାୟ ସମର୍ଥନ',underReviewCount:'ଯାଞ୍ଚରେ',inProgressCount:'ଚାଲୁଛି',resolvedCount:'ସମାପ୍ତ',totalProblems:'ମୋଟ ସମସ୍ୟା',viewAllProblems:'ସମସ୍ତ ସମସ୍ୟା ଦେଖନ୍ତୁ',noRecentActivity:'କୌଣସି ନିକଟ ସମସ୍ୟା ମିଳିନାହିଁ।',anonymousMode:'ଗୋପନୀୟ ରିପୋର୍ଟ ମୋଡ୍',anonymousDesc:'ସମ୍ବେଦନଶୀଳ ସମସ୍ୟା ଦାଖଲ ବେଳେ ପରିଚୟ ଲୁଚାନ୍ତୁ',locationRadius:'ସ୍ଥାନ ସୁରକ୍ଷା',locationRadiusDesc:'ମାନଚିତ୍ରରେ ୫୦୦ ମିଟର ଅଞ୍ଚଳ ସୁରକ୍ଷା ଲାଗୁ',notifications:'ସ୍ଥିତି ସୂଚନା',notificationsDesc:'ସମାଧାନ ଅପଡେଟ୍ ପାଇଁ ଇନ୍-ଆପ୍ ଓ SMS ସୂଚନା ସକ୍ରିୟ',updateProfileSuccess:'ପ୍ରୋଫାଇଲ୍ ସଫଳତାର ସହ ଅପଡେଟ୍ ହୋଇଛି!',bio:'ପରିଚୟ / ବିବରଣୀ',bioPlaceholder:'ଆପଣଙ୍କ ସାମାଜିକ କାର୍ଯ୍ୟ ବା ଅବଦାନ ବିଷୟରେ ଲେଖନ୍ତୁ...',residentOf:'ନିବାସୀ',reportNewProblem:'ସମସ୍ୟା ଜଣାନ୍ତୁ',verifiedResident:'ଯାଞ୍ଚିତ ନିବାସୀ',activeCivicLeader:'ସକ୍ରିୟ ନାଗରିକ ନେତା',impactMaker:'ସମୁଦାୟ ପ୍ରଭାବକାରୀ',viewProblem:'ଦେଖନ୍ତୁ'
  },
  sat: {
    'citizen.userProfile':'ᱵᱟᱭᱦᱟᱨ ᱯᱨᱚᱯᱟᱭᱞ','citizen.profileDesc':'ᱟᱢᱟᱜ ᱯᱨᱚᱯᱟᱭᱞ ᱵᱤᱵᱨᱚᱱ ᱟᱨ ᱟᱢᱟᱜ ᱠᱟᱹᱢ ᱧᱮᱞ ᱢᱮ।','citizen.role':'ᱯᱚᱫᱚ','location':'ᱴᱷᱟᱶ','district':'ᱡᱤᱞᱟ','selectDistrict':'ᱡᱤᱞᱟ ᱵᱟᱪᱷᱟᱣ','notProvided':'ᱵᱟᱝ ᱮᱢ ᱟᱠᱟᱱᱟ','problemsSubmitted':'ᱡᱟᱹᱯᱟᱹᱣ ᱥᱚᱢᱚᱥᱭᱟ','accountStatus':'ᱠᱷᱟᱛᱟ ᱫᱟᱥᱟ','activeVerified':'ᱡᱟᱹᱣ ᱟᱨ ᱯᱨᱚᱢᱟᱱᱤᱛ','memberSince':'ᱥᱚᱫᱚᱥᱭᱟ ᱠᱷᱚᱱ','districtArea':'ᱡᱤᱞᱟ ᱴᱚᱞᱟ','categoryHealthcare':'ᱥᱮᱬᱟ ᱥᱮᱵᱟ','categoryWasteManagement':'ᱦᱚᱲᱟ ᱠᱟᱹᱢ','categoryWaterManagement':'ᱫᱟᱜ ᱵᱮᱵᱚᱥᱛᱟ','categoryEducation':'ᱯᱟᱹᱲᱦᱟᱹᱣ','categoryRoads':'ᱨᱟᱥᱛᱟ','categorySanitation':'ᱥᱟᱯᱷᱟᱹᱭ','categoryPublicSafety':'ᱦᱚᱲ ᱥᱮᱠᱩᱨᱤᱴᱤ','categoryGeneral':'ᱥᱟᱫᱟᱨᱚᱱ','citizen.approvedActiveChallenge':'ᱡᱟᱹᱣ ᱪᱮᱞᱮᱧᱡ ᱞᱮᱠᱟ ᱵᱟᱪᱷᱟᱣ','citizen.pendingReview':'ᱡᱟᱹᱧᱪ ᱛᱟᱹᱠ','citizen.underAiAnalysis':'AI ᱡᱟᱹᱧᱪ ᱨᱮ','citizen.inProgressStatus':'ᱠᱟᱹᱢ ᱪᱟᱹᱞᱩ','citizen.completedStatus':'ᱯᱩᱨᱟᱹ ᱮᱱᱟ',
    submitReport:'ᱨᱤᱯᱚᱨᱴ ᱡᱚᱢᱟ ᱢᱮ',clearRerecord:'ᱢᱮᱴᱟᱣ ᱟᱨ ᱫᱚᱦᱲᱟ ᱨᱮᱠᱚᱨᱰ',submittingReport:'ᱨᱤᱯᱚᱨᱴ ᱡᱚᱢᱟ ᱦᱚᱭᱚᱜ ᱠᱟᱱᱟ...',reportByVoice:'ᱟᱹᱲᱟᱹ ᱛᱮ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ',voiceDescription:'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱨᱮᱭᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱵᱟᱵᱚᱛ ᱟᱹᱲᱟᱹ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ। AI ᱱᱚᱣᱟ ᱚᱞ ᱟᱨ ᱡᱟᱹᱧᱪᱟᱭ।',storedInMongo:'ᱰᱟᱴᱟᱵᱮᱥ ᱨᱮ ᱥᱟᱧᱪᱟᱣ',voiceReportSubmittedSuccess:'ᱟᱹᱲᱟᱹ ᱨᱤᱯᱚᱨᱴ ᱵᱮᱥ ᱞᱮᱠᱟ ᱡᱚᱢᱟ ᱮᱱᱟ!',voiceReportSubmittedDesc:'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱰᱟᱴᱟᱵᱮᱥ ᱨᱮ ᱡᱚᱢᱟ ᱮᱱᱟ ᱟᱨ AI ᱛᱮ ᱡᱟᱹᱧᱪ ᱮᱱᱟ।',trackOnDashboard:'ᱰᱮᱥᱵᱳᱨᱰ ᱨᱮ ᱴᱨᱮᱠ ᱢᱮ',reportAnotherIssue:'ᱟᱨᱮᱠ ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ',back:'ᱛᱟᱭᱚᱢ',
    personalInfo:'ᱱᱤᱡᱮᱨ ᱵᱤᱵᱨᱚᱱ',civicDetails:'ᱱᱟᱜᱟᱨᱤᱠ ᱡᱟᱭᱜᱟ ᱟᱨ ᱴᱷᱟᱶ',contactInfo:'ᱥᱟᱹᱜᱟᱹᱭ ᱵᱤᱵᱨᱚᱱ',fullName:'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',email:'ᱤᱢᱮᱞ',phone:'ᱯᱷᱚᱱ ᱮᱞ',citizenId:'ᱱᱟᱜᱟᱨᱤᱠ ID',preferredLang:'ᱠᱩᱥᱤ ᱯᱟᱹᱨᱥᱤ',jurisdiction:'ᱥᱚᱨᱠᱟᱨᱤ ᱥᱛᱚᱨ',civicBadges:'ᱱᱟᱜᱟᱨᱤᱠ ᱵᱮᱡ',recentActivity:'ᱱᱤᱛᱚᱜ ᱡᱚᱢᱟ ᱥᱚᱢᱚᱥᱭᱟ',privacySettings:'ᱜᱚᱯᱚᱱᱤᱭᱟ ᱟᱨ ᱠᱷᱟᱛᱟ',editProfile:'ᱯᱨᱚᱯᱟᱭᱞ ᱵᱚᱫᱚᱞ',saveChanges:'ᱥᱟᱧᱪᱟᱣ ᱢᱮ',saving:'ᱥᱟᱧᱪᱟᱣᱜ ᱠᱟᱱᱟ...',verifiedCitizen:'ᱯᱨᱚᱢᱟᱱᱤᱛ ᱱᱟᱜᱟᱨᱤᱠ',stateJharkhand:'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ',civicScore:'ᱱᱟᱜᱟᱨᱤᱠ ᱥᱠᱳᱨ',upvotesCount:'ᱦᱚᱲ ᱜᱚᱲᱚ',underReviewCount:'ᱧᱮᱞ ᱨᱮ',inProgressCount:'ᱠᱟᱹᱢ ᱪᱟᱹᱞᱩ',resolvedCount:'ᱥᱟᱹᱛ ᱮᱱᱟ',totalProblems:'ᱡᱚᱛᱚ ᱥᱚᱢᱚᱥᱭᱟ',viewAllProblems:'ᱥᱟᱱᱟᱢ ᱥᱚᱢᱚᱥᱭᱟ ᱧᱮᱞ',noRecentActivity:'ᱱᱤᱛᱚᱜ ᱵᱟᱝ ᱥᱚᱢᱚᱥᱭᱟ ᱧᱟᱢ ᱮᱱᱟ।',anonymousMode:'ᱵᱮᱱᱟᱢ ᱢᱚᱰ',anonymousDesc:'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ ᱡᱚᱠᱷᱮᱡ ᱧᱩᱛᱩᱢ ᱩᱠᱩ ᱢᱮ',locationRadius:'ᱡᱟᱭᱜᱟ ᱜᱚᱯᱚᱱᱤᱭᱟ',locationRadiusDesc:'᱕᱐᱐ ᱢᱤᱴᱟᱨ ᱮᱞᱟᱠᱟ ᱥᱩᱨᱚᱠᱷᱤᱛ',notifications:'ᱠᱷᱚᱵᱚᱨ ᱥᱩᱪᱱᱟ',notificationsDesc:'ᱥᱚᱢᱟᱫᱷᱟᱱ ᱞᱟᱹᱜᱤᱫ SMS ᱟᱨ ᱮᱯ ᱥᱩᱪᱱᱟ',updateProfileSuccess:'ᱯᱨᱚᱯᱟᱭᱞ ᱵᱮᱥ ᱛᱮ ᱟᱯᱰᱮᱴ ᱮᱱᱟ!',bio:'ᱟᱢᱟᱜ ᱵᱟᱵᱚᱛ',bioPlaceholder:'ᱟᱢᱟᱜ ᱱᱟᱜᱟᱨᱤᱠ ᱠᱟᱹᱢᱤ ᱵᱟᱵᱚᱛ ᱚᱞ ᱢᱮ...',residentOf:'ᱱᱤᱵᱟᱥᱤ',reportNewProblem:'ᱥᱚᱢᱚᱥᱭᱟ ᱞᱟᱹᱭ',verifiedResident:'ᱯᱨᱚᱢᱟᱱᱤᱛ ᱱᱤᱵᱟᱥᱤ',activeCivicLeader:'ᱥᱚᱠᱨᱤᱭᱚ ᱱᱟᱜᱟᱨᱤᱠ',impactMaker:'ᱦᱚᱲ ᱩᱛᱱᱟᱹᱣᱤᱭᱟᱹ',viewProblem:'ᱧᱮᱞ'
  }
};

const regionalHindiExtra = citizenExtraLabels.hi;
for (const code of ['ho','nag','kur','kho','mul']) citizenExtraLabels[code] = { ...regionalHindiExtra };
for (const [code, copy] of Object.entries(citizenExtraLabels)) ui[code] = { ...(ui[code] || {}), ...copy };

const problemTitleTranslations = {
  hi: {
    light: 'स्ट्रीट लाइट',
    'street light': 'स्ट्रीट लाइट',
    streetlight: 'स्ट्रीट लाइट',
    'broken street light': 'खराब स्ट्रीट लाइट',
    water: 'पेयजल समस्या',
    'drinking water': 'पीने का पानी',
    'water supply': 'जल आपूर्ति समस्या',
    'water leakage': 'पानी का रिसाव',
    waterlogging: 'जलभराव',
    road: 'सड़क समस्या',
    roads: 'सड़कें',
    pothole: 'सड़क पर गड्ढा',
    potholes: 'सड़क के गड्ढे',
    'broken road': 'टूटी सड़क',
    'bad road': 'खराब सड़क',
    garbage: 'कचरा समस्या',
    waste: 'कचरा प्रबंधन',
    'garbage collection': 'कचरा उठाव',
    trash: 'कचरा',
    drainage: 'नाली / जल निकासी',
    drain: 'नाली की समस्या',
    'blocked drain': 'जाम नाली',
    sewage: 'सीवरेज समस्या',
    electricity: 'बिजली आपूर्ति',
    'power outage': 'बिजली कटौती',
    sanitation: 'स्वच्छता',
    healthcare: 'स्वास्थ्य सेवा',
    hospital: 'अस्पताल',
    education: 'शिक्षा',
    school: 'विद्यालय',
    pollution: 'प्रदूषण',
    traffic: 'यातायात जाम',
  },
  bn: {
    light: 'স্ট্রিট লাইট',
    'street light': 'স্ট্রিট লাইট',
    streetlight: 'স্ট্রিট লাইট',
    'broken street light': 'নষ্ট স্ট্রিট লাইট',
    water: 'জল সমস্যা',
    'drinking water': 'পানীয় জল',
    'water supply': 'জল সরবরাহ সমস্যা',
    'water leakage': 'জল ফুটো',
    waterlogging: 'জল জমা',
    road: 'রাস্তা সমস্যা',
    roads: 'রাস্তাঘাট',
    pothole: 'রাস্তার গর্ত',
    potholes: 'রাস্তার গর্ত',
    'broken road': 'ভাঙা রাস্তা',
    'bad road': 'খারাপ রাস্তা',
    garbage: 'আবর্জনা সমস্যা',
    waste: 'বর্জ্য ব্যবস্থাপনা',
    'garbage collection': 'আবর্জনা সংগ্রহ',
    trash: 'আবর্জনা',
    drainage: 'নর্দমা / জল নিষ্কাশন',
    drain: 'ড্রেন সমস্যা',
    'blocked drain': 'বন্ধ ড্রেন',
    sewage: 'পয়ঃনিষ্কাশন',
    electricity: 'বিদ্যুৎ সমস্যা',
    'power outage': 'বিদ্যুৎ বিভ্রাট',
    sanitation: 'স্যানিটেশন',
    healthcare: 'স্বাস্থ্যসেবা',
    hospital: 'হাসপাতাল',
    education: 'শিক্ষা',
    school: 'বিদ্যালয়',
    pollution: 'দূষণ',
    traffic: 'যানজট',
  },
  or: {
    light: 'ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍',
    'street light': 'ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍',
    streetlight: 'ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍',
    'broken street light': 'ଖରାପ ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍',
    water: 'ପାଣି ସମସ୍ୟା',
    'drinking water': 'ପିଇବା ପାଣି',
    'water supply': 'ଜଳ ଯୋଗାଣ ସମସ୍ୟା',
    'water leakage': 'ପାଣି ଲିକ୍',
    waterlogging: 'ଜଳବନ୍ଦୀ',
    road: 'ରାସ୍ତା ସମସ୍ୟା',
    roads: 'ରାସ୍ତାଘାଟ',
    pothole: 'ରାସ୍ତା ଖାଲ',
    potholes: 'ରାସ୍ତା ଖାଲ',
    'broken road': 'ଭଙ୍ଗା ରାସ୍ତା',
    'bad road': 'ଖରାପ ରାସ୍ତା',
    garbage: 'ଆବର୍ଜନା ସମସ୍ୟା',
    waste: 'ଆବର୍ଜନା ପରିଚାଳନା',
    'garbage collection': 'ଆବର୍ଜନା ସଂଗ୍ରହ',
    trash: 'ଆବର୍ଜନା',
    drainage: 'ନାଳ ନର୍ଦ୍ଦମା',
    drain: 'ଡ୍ରେନ୍ ସମସ୍ୟା',
    'blocked drain': 'ବନ୍ଦ ଡ୍ରେନ୍',
    sewage: 'ନର୍ଦ୍ଦମା',
    electricity: 'ବିଦ୍ୟୁତ୍ ସମସ୍ୟା',
    'power outage': 'ବିଦ୍ୟୁତ୍ କାଟ',
    sanitation: 'ପରିମଳ',
    healthcare: 'ସ୍ୱାସ୍ଥ୍ୟସେବା',
    hospital: 'ଡାକ୍ତରଖାନା',
    education: 'ଶିକ୍ଷା',
    school: 'ବିଦ୍ୟାଳୟ',
    pollution: 'ପ୍ରଦୂଷଣ',
    traffic: 'ଟ୍ରାଫିକ୍ ଜାମ୍',
  },
  sat: {
    light: 'ᱵᱟᱹᱛᱤ / ᱞᱟᱭᱤᱴ',
    'street light': 'ᱥᱴᱨᱤᱴ ᱞᱟᱭᱤᱴ',
    streetlight: 'ᱥᱴᱨᱤᱴ ᱞᱟᱭᱤᱴ',
    'broken street light': 'ᱵᱟᱹᱲᱤᱡ ᱞᱟᱭᱤᱴ',
    water: 'ᱫᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ',
    'drinking water': 'ᱧᱩ ᱫᱟᱜ',
    'water supply': 'ᱫᱟᱜ ᱥᱟᱯᱞᱟᱭ',
    'water leakage': 'ᱫᱟᱜ ᱞᱤᱠ',
    waterlogging: 'ᱫᱟᱜ ᱡᱟᱢᱟ',
    road: 'ᱨᱟᱥᱛᱟ ᱥᱚᱢᱚᱥᱭᱟ',
    roads: 'ᱨᱟᱥᱛᱟ',
    pothole: 'ᱨᱟᱥᱛᱟ ᱠᱷᱟᱰᱞᱟ',
    potholes: 'ᱨᱟᱥᱛᱟ ᱠᱷᱟᱰᱞᱟ',
    'broken road': 'ᱨᱟᱹᱯᱩᱫ ᱨᱟᱥᱛᱟ',
    'bad road': 'ᱵᱟᱹᱲᱤᱡ ᱨᱟᱥᱛᱟ',
    garbage: 'ᱦᱚᱲᱟ / ᱡᱟᱵᱽᱨᱟ',
    waste: 'ᱡᱟᱵᱽᱨᱟ ᱠᱟᱹᱢ',
    'garbage collection': 'ᱡᱟᱵᱽᱨᱟ ᱩᱴᱷᱟᱣ',
    trash: 'ᱡᱟᱵᱽᱨᱟ',
    drainage: 'ᱱᱟᱞᱤ',
    drain: 'ᱱᱟᱞᱤ',
    'blocked drain': 'ᱵᱚᱱᱫᱚ ᱱᱟᱞᱤ',
    sewage: 'ᱱᱟᱞᱤ ᱫᱟᱜ',
    electricity: 'ᱵᱤᱡᱞᱤ',
    'power outage': 'ᱵᱤᱡᱞᱤ ᱵᱚᱱᱫᱚ',
    sanitation: 'ᱥᱟᱯᱷᱟᱹᱭ',
    healthcare: 'ᱥᱮᱬᱟ ᱥᱮᱵᱟ',
    hospital: 'ᱦᱟᱥᱯᱟᱛᱟᱞ',
    education: 'ᱯᱟᱹᱲᱦᱟᱹᱣ',
    school: 'ᱤᱛᱩᱱ ᱟᱥᱲᱟ',
    pollution: 'ᱯᱨᱚᱫᱩᱥᱚᱱ',
    traffic: 'ᱴᱨᱟᱯᱷᱤᱠ ᱡᱟᱢ',
  }
};

const nameDictionary = {
  hi: {
    aman: 'अमन',
    rahul: 'राहुल',
    rohit: 'रोहित',
    priya: 'प्रिया',
    shruti: 'श्रुति',
    sneha: 'स्नेहा',
    amit: 'अमित',
    ankit: 'अंकित',
    raj: 'राज',
    vikas: 'विकास',
    vivek: 'विवेक',
    deepak: 'दीपक',
    suresh: 'सुरेश',
    rajesh: 'राजेश',
    ramesh: 'रमेश',
    ravi: 'रवि',
    abhishek: 'अभिषेक',
    shubham: 'शुभम',
    saurabh: 'सौरभ',
    manish: 'मनीष',
    sachin: 'सचिन',
    ajay: 'अजय',
    vijay: 'विजय',
    sanjay: 'संजय',
    sunil: 'सुनील',
    anil: 'अनिल',
    alok: 'आलोक',
    ashish: 'आशीष',
    harsh: 'हर्ष',
    ayush: 'आयुष',
    gaurav: 'गौरव',
    nikhil: 'निखिल',
    aryan: 'आर्यन',
    arjun: 'अर्जुन',
    karan: 'करण',
    mohan: 'मोहन',
    sohan: 'सोहन',
    rohan: 'रोहन',
    sonu: 'सोनू',
    monu: 'मोनू',
    citizen: 'नागरिक',
    user: 'नागरिक',
    admin: 'प्रशासक',
    kumar: 'कुमार',
    singh: 'सिंह',
    sharma: 'शर्मा',
    verma: 'वर्मा',
    gupta: 'गुप्ता',
    yadav: 'यादव',
  },
  bn: {
    aman: 'অমন',
    rahul: 'রাহুল',
    rohit: 'রোহিত',
    priya: 'প্রিয়া',
    shruti: 'শ্রুতি',
    sneha: 'স্নেহা',
    amit: 'অমিত',
    ankit: 'অঙ্কিত',
    raj: 'রাজ',
    citizen: 'নাগরিক',
    user: 'নাগরিক',
    kumar: 'কুমার',
    singh: 'সিংহ',
  },
  or: {
    aman: 'ଅମନ',
    rahul: 'ରାହୁଲ',
    rohit: 'ରୋହିତ',
    priya: 'ପ୍ରିୟା',
    shruti: 'ଶ୍ରୁତି',
    sneha: 'ସ୍ନେହା',
    amit: 'ଅମିତ',
    ankit: 'ଅଙ୍କିତ',
    raj: 'ରାଜ',
    citizen: 'ନାଗରିକ',
    user: 'ନାଗରିକ',
    kumar: 'କୁମାର',
    singh: 'ସିଂହ',
  },
  sat: {
    aman: 'ᱚᱢᱚᱱ',
    rahul: 'ᱨᱟᱦᱩᱞ',
    rohit: 'ᱨᱳᱦᱤᱛ',
    priya: 'ᱯᱨᱤᱭᱟ',
    shruti: 'ᱥᱨᱩᱛᱤ',
    amit: 'ᱚᱢᱤᱛ',
    citizen: 'ᱦᱚᱲ',
    user: 'ᱦᱚᱲ',
    kumar: 'ᱠᱩᱢᱟᱨ',
  }
};

export function localizeUserName(rawName, language = 'hi') {
  if (!rawName || typeof rawName !== 'string') return rawName || '';
  if (!language || language === 'en') return rawName;

  const trimmed = rawName.trim();
  if (/[\u0900-\u0D7F]/.test(trimmed)) {
    // Already in Indian script
    return trimmed;
  }

  const langCode = ['ho', 'nag', 'kur', 'kho', 'mul'].includes(language) ? 'hi' : language;
  const dict = nameDictionary[langCode] || nameDictionary.hi;

  const words = trimmed.split(/\s+/);
  const translatedWords = words.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (dict[clean]) return dict[clean];
    if (nameDictionary.hi[clean]) return nameDictionary.hi[clean];
    return w;
  });

  return translatedWords.join(' ');
}

const addressDictionary = {
  hi: {
    jharkhand: 'झारखंड',
    bihar: 'बिहार',
    india: 'भारत',
    'east singhbhum': 'पूर्वी सिंहभूम',
    'purbi singhbhum': 'पूर्वी सिंहभूम',
    'west singhbhum': 'पश्चिमी सिंहभूम',
    'pashchimi singhbhum': 'पश्चिमी सिंहभूम',
    ranchi: 'रांची',
    dhanbad: 'धनबाद',
    bokaro: 'बोकारो',
    deoghar: 'देवघर',
    hazaribagh: 'हज़ारीबाग',
    giridih: 'गिरिडीह',
    ramgarh: 'रामगढ़',
    dumka: 'दुमका',
    godda: 'गोड्डा',
    jamtara: 'जामताड़ा',
    sahibganj: 'साहिबगंज',
    pakur: 'पाकुड़',
    palamu: 'पलामू',
    garhwa: 'गढ़वा',
    latehar: 'लातेहार',
    chatra: 'चतरा',
    gumla: 'गुमला',
    simdega: 'सिमडेगा',
    lohardaga: 'लोहरदगा',
    khunti: 'खूंटी',
    koderma: 'कोडरमा',
    'seraikela kharsawan': 'सरायकेला खरसावां',
    'saraikela kharsawan': 'सरायकेला खरसावां',
    seraikela: 'सरायकेला',
    saraikela: 'सरायकेला',
    kharsawan: 'खरसावां',
    jamshedpur: 'जमशेदपुर',
    dimna: 'डिमना',
    'dimna road': 'डिमना रोड',
    'golmuri-cum-jugsalai': 'गोलमुरी-सह-जुगसलाई',
    'golmuri cum jugsalai': 'गोलमुरी-सह-जुगसलाई',
    golmuri: 'गोलमुरी',
    jugsalai: 'जुगसलाई',
    sakchi: 'साकची',
    bistupur: 'बिष्टुपुर',
    mango: 'मानगो',
    kadma: 'कदमा',
    sonari: 'सोनारी',
    telco: 'टेल्को',
    adityapur: 'आदित्यपुर',
    gamharia: 'गम्हरिया',
    birsanagar: 'बिरसानगर',
    baridih: 'बारीडीह',
    bagbera: 'बागबेड़ा',
    parsudih: 'परसुडीह',
    doranda: 'डोरंडा',
    kanke: 'कांके',
    harmu: 'हरमू',
    ratu: 'रातू',
    namkum: 'नामकुम',
    bariatu: 'बरियातू',
    morabadi: 'मोराबादी',
    lalpur: 'लालपुर',
    hindpiri: 'हिंदपीढ़ी',
    dhurwa: 'धुर्वा',
    hehal: 'हेहल',
    tatisilwai: 'तातीसिलवे',
    chas: 'चास',
    bermo: 'बेरमो',
    phusro: 'फुसरो',
    jharia: 'झरिया',
    katras: 'कतरास',
    sindri: 'सिंदरी',
    nirsa: 'निरसा',
    baghmara: 'बाघमारा',
    govindpur: 'गोविंदपुर',
    madhupur: 'मधुपुर',
    ghatshila: 'घाटशिला',
    chakradharpur: 'चक्रधरपुर',
    chaibasa: 'चाईबासा',
    medininagar: 'मेदिनीनगर',
    daltonganj: 'डालटनगंज',
    bundu: 'बुंडू',
    tamar: 'तमाड़',
    silli: 'सिल्ली',
    mandar: 'मांडर',
    bero: 'बेड़ो',
    ormanjhi: 'ओरमांझी',
    angara: 'अनगड़ा',
    sadar: 'सदर',
    near: 'के पास',
    opposite: 'के सामने',
    behind: 'के पीछे',
    road: 'रोड',
    'main road': 'मेन रोड',
    street: 'मार्ग',
    chowk: 'चौक',
    market: 'बाज़ार',
    colony: 'कॉलोनी',
    nagar: 'नगर',
    sector: 'सेक्टर',
    phase: 'फेज़',
    block: 'ब्लॉक',
    ward: 'वार्ड',
    station: 'स्टेशन',
    'railway station': 'रेलवे स्टेशन',
    'bus stand': 'बस स्टैंड',
    hospital: 'अस्पताल',
    school: 'विद्यालय',
    college: 'कॉलेज',
    university: 'विश्वविद्यालय',
    gate: 'गेट',
    'gate no': 'गेट नंबर'
  },
  bn: {
    jharkhand: 'ঝাড়খণ্ড',
    bihar: 'বিহার',
    india: 'ভারত',
    'east singhbhum': 'পূর্ব সিংভূম',
    'purbi singhbhum': 'পূর্ব সিংভূম',
    'west singhbhum': 'পশ্চিম সিংভূম',
    'pashchimi singhbhum': 'পশ্চিম সিংভূম',
    ranchi: 'রাঁচি',
    dhanbad: 'ধানবাদ',
    bokaro: 'বোকারো',
    deoghar: 'দেওঘর',
    hazaribagh: 'হাজারিবাগ',
    giridih: 'গিরিডি',
    ramgarh: 'রামগড়',
    dumka: 'দুমকা',
    godda: 'গোড্ডা',
    jamtara: 'জামতাড়া',
    sahibganj: 'সাহেবগঞ্জ',
    sahebganj: 'সাহেবগঞ্জ',
    pakur: 'পাকুর',
    palamu: 'পালামৌ',
    garhwa: 'গড়ওয়া',
    latehar: 'লাতেহার',
    chatra: 'চাতরা',
    gumla: 'গুমলা',
    simdega: 'সিমডেগা',
    lohardaga: 'লোহারদাগা',
    khunti: 'খুঁটি',
    koderma: 'কোডারমা',
    'seraikela kharsawan': 'সেরাইকেলা খরসোয়া',
    'saraikela kharsawan': 'সেরাইকেলা খরসোয়া',
    'saraikela-kharsawan': 'সেরাইকেলা খরসোয়া',
    seraikela: 'সেরাইকেলা',
    saraikela: 'সেরাইকেলা',
    kharsawan: 'খরসোয়া',
    jamshedpur: 'জামশেদপুর',
    dimna: 'ডিমনা',
    'dimna road': 'ডিমনা রোড',
    'golmuri-cum-jugsalai': 'গোলমুরি-সহ-জুগসলাই',
    golmuri: 'গোলমুরি',
    jugsalai: 'জুগসলাই',
    sakchi: 'সাকচি',
    bistupur: 'বিস্টুপুর',
    mango: 'মানগো',
    kadma: 'কদমা',
    sonari: 'সোনারি',
    telco: 'টেলকো',
    adityapur: 'আদিত্যপুর',
    gamharia: 'গামহারিয়া',
    birsanagar: 'বিরসানগর',
    baridih: 'বারিডিহ'
  },
  or: {
    jharkhand: 'ଝାଡ଼ଖଣ୍ଡ',
    bihar: 'ବିହାର',
    india: 'ଭାରତ',
    'east singhbhum': 'ପୂର୍ବ ସିଂହଭୂମି',
    'purbi singhbhum': 'ପୂର୍ବ ସିଂହଭୂମି',
    'west singhbhum': 'ପଶ୍ଚିମ ସିଂହଭୂମି',
    'pashchimi singhbhum': 'ପଶ୍ଚିମ ସିଂହଭୂମି',
    ranchi: 'ରାଞ୍ଚି',
    dhanbad: 'ଧନବାଦ',
    bokaro: 'ବୋକାରୋ',
    deoghar: 'ଦେଓଘର',
    hazaribagh: 'ହଜାରିବାଗ',
    giridih: 'ଗିରିଡିହ',
    ramgarh: 'ରାମଗଡ଼',
    dumka: 'ଦୁମକା',
    godda: 'ଗୋଡ୍ଡା',
    jamtara: 'ଜାମତାରା',
    sahibganj: 'ସାହେବଗଞ୍ଜ',
    sahebganj: 'ସାହେବଗଞ୍ଜ',
    pakur: 'ପାକୁଡ଼',
    palamu: 'ପଲାମୁ',
    garhwa: 'ଗଢ଼ୱା',
    latehar: 'ଲାତେହାର',
    chatra: 'ଚତ୍ରା',
    gumla: 'ଗୁମଲା',
    simdega: 'ସିମଡେଗା',
    lohardaga: 'ଲୋହରଦଗା',
    khunti: 'ଖୁଣ୍ଟି',
    koderma: 'କୋଡେରମା',
    'seraikela kharsawan': 'ଷଢେଇକଳା ଖରସୁଆଁ',
    'saraikela kharsawan': 'ଷଢେଇକଳା ଖରସୁଆଁ',
    'saraikela-kharsawan': 'ଷଢେଇକଳା ଖରସୁଆଁ',
    seraikela: 'ଷଢେଇକଳା',
    saraikela: 'ଷଢେଇକଳା',
    kharsawan: 'ଖରସୁଆଁ',
    jamshedpur: 'ଜାମସେଦପୁର',
    dimna: 'ଡିମନା',
    'dimna road': 'ଡିମନା ରୋଡ୍',
    'golmuri-cum-jugsalai': 'ଗୋଲମୁରି-ସହ-ଜୁଗସଲାଇ',
    golmuri: 'ଗୋଲମୁରି',
    jugsalai: 'ଜୁଗସଲାଇ',
    sakchi: 'ସାକଚି',
    bistupur: 'ବିଷ୍ଟୁପୁର',
    mango: 'ମାଙ୍ଗୋ',
    kadma: 'କଦମା',
    sonari: 'ସୋନାରି',
    telco: 'ଟେଲକୋ',
    adityapur: 'ଆଦିତ୍ୟପୁର',
    gamharia: 'ଗମହରିଆ',
    birsanagar: 'ବିରସାନଗର',
    baridih: 'ବାରିଡିହ'
  },
  sat: {
    jharkhand: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ',
    bihar: 'ᱵᱤᱦᱟᱨ',
    india: 'ᱵᱷᱟᱨᱚᱛ',
    'east singhbhum': 'ᱯᱩᱨᱵᱤ ᱥᱤᱝᱵᱷᱩᱢ',
    'purbi singhbhum': 'ᱯᱩᱨᱵᱤ ᱥᱤᱝᱵᱷᱩᱢ',
    'west singhbhum': 'ᱯᱟᱪᱷᱤᱢ ᱥᱤᱝᱵᱷᱩᱢ',
    'pashchimi singhbhum': 'ᱯᱟᱪᱷᱤᱢ ᱥᱤᱝᱵᱷᱩᱢ',
    ranchi: 'ᱨᱟᱺᱪᱤ',
    dhanbad: 'ᱫᱷᱟᱱᱵᱟᱫ',
    bokaro: 'ᱵᱚᱠᱟᱨᱚ',
    deoghar: 'ᱫᱮᱣᱜᱷᱟᱨ',
    hazaribagh: 'ᱦᱟᱡᱟᱨᱤᱵᱟᱜ',
    giridih: 'ᱜᱤᱨᱤᱰᱤᱦ',
    ramgarh: 'ᱨᱟᱢᱜᱟᱲ',
    dumka: 'ᱫᱩᱢᱠᱟ',
    godda: 'ᱜᱚᱰᱰᱟ',
    jamtara: 'ᱡᱟᱢᱛᱟᱲᱟ',
    sahibganj: 'ᱥᱟᱦᱮᱵᱽᱜᱚᱸᱡᱽ',
    sahebganj: 'ᱥᱟᱦᱮᱵᱽᱜᱚᱸᱡᱽ',
    pakur: 'ᱯᱟᱠᱩᱲ',
    palamu: 'ᱯᱟᱞᱟᱢᱩ',
    garhwa: 'ᱜᱟᱲᱣᱟ',
    latehar: 'ᱞᱟᱛᱮᱦᱟᱨ',
    chatra: 'ᱪᱟᱛᱨᱟ',
    gumla: 'ᱜᱩᱢᱞᱟ',
    simdega: 'ᱥᱤᱢᱰᱮᱜᱟ',
    lohardaga: 'ᱞᱳᱦᱟᱨᱫᱟᱜᱟ',
    khunti: 'ᱠᱷᱩᱱᱴᱤ',
    koderma: 'ᱠᱳᱰᱟᱨᱢᱟ',
    'seraikela kharsawan': 'ᱥᱟᱨᱟᱭᱠᱮᱞᱟ ᱠᱷᱟᱨᱥᱟᱣᱟᱱ',
    'saraikela kharsawan': 'ᱥᱟᱨᱟᱭᱠᱮᱞᱟ ᱠᱷᱟᱨᱥᱟᱣᱟᱱ',
    'saraikela-kharsawan': 'ᱥᱟᱨᱟᱭᱠᱮᱞᱟ ᱠᱷᱟᱨᱥᱟᱣᱟᱱ',
    seraikela: 'ᱥᱟᱨᱟᱭᱠᱮᱞᱟ',
    saraikela: 'ᱥᱟᱨᱟᱭᱠᱮᱞᱟ',
    kharsawan: 'ᱠᱷᱟᱨᱥᱟᱣᱟᱱ',
    jamshedpur: 'ᱡᱟᱢᱥᱮᱫᱯᱩᱨ',
    dimna: 'ᱰᱤᱢᱱᱟ',
    'dimna road': 'ᱰᱤᱢᱱᱟ ᱨᱟᱥᱛᱟ',
    'golmuri-cum-jugsalai': 'ᱜᱳᱞᱢᱩᱨᱤ-ᱡᱩᱜᱥᱟᱞᱟᱭ',
    golmuri: 'ᱜᱳᱞᱢᱩᱨᱤ',
    jugsalai: 'ᱡᱩᱜᱥᱟᱞᱟᱭ',
    sakchi: 'ᱥᱟᱠᱪᱤ',
    bistupur: 'ᱵᱤᱥᱴᱩᱯᱩᱨ',
    mango: 'ᱢᱟᱱᱜᱳ',
    kadma: 'ᱠᱟᱫᱢᱟ',
    sonari: 'ᱥᱳᱱᱟᱨᱤ',
    telco: 'ᱴᱮଲᱠᱳ',
    adityapur: 'ᱟᱫᱤᱛᱭᱚᱯᱩᱨ',
    gamharia: 'ᱜᱟᱢᱦᱟᱨᱤᱭᱟ',
    birsanagar: 'ᱵᱤᱨᱥᱟᱱᱚᱜᱚᱨ',
    baridih: 'ᱵᱟᱨᱤᱰᱤହ'
  }
};

export function localizeAddress(rawAddress, language = 'hi') {
  if (!rawAddress || typeof rawAddress !== 'string') return rawAddress || '';
  if (!language || language === 'en') return rawAddress;

  const langCode = ['ho', 'nag', 'kur', 'kho', 'mul'].includes(language) ? 'hi' : language;
  const dict = addressDictionary[langCode] || addressDictionary.hi;

  const parts = rawAddress.split(/,\s*/);
  const localizedParts = parts.map((part) => {
    const trimmed = part.trim();
    if (!trimmed) return '';
    const cleanLower = trimmed.toLowerCase();

    if (dict[cleanLower]) return dict[cleanLower];
    if (addressDictionary.hi[cleanLower]) return addressDictionary.hi[cleanLower];

    let modified = trimmed;
    const entries = Object.entries({ ...addressDictionary.hi, ...dict }).sort((a, b) => b[0].length - a[0].length);
    for (const [enKey, locVal] of entries) {
      const regex = new RegExp(`\\b${enKey}\\b`, 'gi');
      if (regex.test(modified)) {
        modified = modified.replace(regex, locVal);
      }
    }

    if (/[\u0900-\u0D7F]/.test(modified) || /^\d+$/.test(modified)) {
      return modified;
    }

    const words = modified.split(/\s+/);
    const trWords = words.map((w) => {
      const wClean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (dict[wClean]) return dict[wClean];
      if (addressDictionary.hi[wClean]) return addressDictionary.hi[wClean];
      return localizeUserName(w, language);
    });

    return trWords.join(' ');
  });

  return localizedParts.filter(Boolean).join(', ');
}

export function localizeProblemStatus(status, language = 'hi') {
  const value = String(status || '').trim().toLowerCase();
  const t = (k) => citizenText(language, k);
  if (!value) return t('underAi');
  if (value.includes('approved') || value.includes('active challenge') || value === 'approved') return t('citizen.approvedActiveChallenge');
  if (value.includes('pending') || value.includes('review') || value === 'under review') return t('citizen.pendingReview');
  if (value.includes('ai') && value.includes('analysis')) return t('citizen.underAiAnalysis');
  if (value.includes('progress') || value.includes('assigned') || value.includes('started')) return t('citizen.inProgressStatus');
  if (value.includes('complete') || value.includes('resolved') || value.includes('solved')) return t('citizen.completedStatus');
  return status;
}

export function localizeProblemTitle(language, rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') return rawTitle || '';
  if (!language || language === 'en') return rawTitle;

  const clean = rawTitle.trim().toLowerCase();
  const dict = problemTitleTranslations[language] || (['ho','nag','kur','kho','mul'].includes(language) ? problemTitleTranslations.hi : null);
  if (!dict) return rawTitle;

  if (dict[clean]) return dict[clean];

  for (const [key, val] of Object.entries(dict)) {
    if (clean === key) return val;
  }

  for (const [key, val] of Object.entries(dict)) {
    if (clean.includes(key)) {
      if (clean.length <= key.length + 10) {
        return val;
      }
    }
  }

  return rawTitle;
}

export function localizeCategory(category, language = 'hi') {
  if (!category || typeof category !== 'string') return category || '';
  if (!language || language === 'en') return category;

  const key = category.trim().toLowerCase();
  const langCode = ['ho', 'nag', 'kur', 'kho', 'mul'].includes(language) ? 'hi' : language;

  const categoryMap = {
    hi: {
      'electricity & lighting': 'विद्युत एवं प्रकाश व्यवस्था',
      'clean energy': 'विद्युत एवं प्रकाश व्यवस्था',
      'electricity': 'विद्युत एवं प्रकाश व्यवस्था',
      'water management': 'जल प्रबंधन एवं आपूर्ति',
      'water & sanitation': 'जल एवं स्वच्छता प्रबंधन',
      'water': 'जल प्रबंधन एवं आपूर्ति',
      'waste & sanitation': 'स्वच्छता एवं कचरा प्रबंधन',
      'waste management': 'स्वच्छता एवं कचरा प्रबंधन',
      'sanitation & waste': 'स्वच्छता एवं कचरा प्रबंधन',
      'sanitation': 'स्वच्छता एवं सफाई',
      'roads & infrastructure': 'सड़क एवं ग्रामीण बुनियादी ढांचा',
      'rural infrastructure': 'सड़क एवं ग्रामीण बुनियादी ढांचा',
      'infrastructure': 'सड़क एवं बुनियादी ढांचा',
      'health & medtech': 'स्वास्थ्य सेवा एवं चिकित्सा',
      'healthcare': 'स्वास्थ्य सेवा एवं चिकित्सा',
      'smart education': 'शिक्षा एवं स्मार्ट लर्निंग',
      'education': 'शिक्षा एवं विद्यालय',
      'agriculture & foodtech': 'कृषि एवं खाद्य प्रौद्योगिकी',
      'agriculture': 'कृषि एवं खाद्य प्रौद्योगिकी',
      'public safety': 'सार्वजनिक सुरक्षा',
      'general': 'सामान्य नागरिक समस्या',
      'general issue': 'सामान्य नागरिक समस्या',
      'civic & infrastructure': 'नागरिक एवं बुनियादी ढांचा'
    },
    bn: {
      'electricity & lighting': 'বিদ্যুৎ ও আলোক ব্যবস্থা',
      'clean energy': 'বিদ্যুৎ ও শক্তি ব্যবস্থা',
      'electricity': 'বিদ্যুৎ ও আলো',
      'water management': 'জল ব্যবস্থাপনা ও সরবরাহ',
      'water & sanitation': 'জল ও স্যানিটেশন',
      'water': 'জল ব্যবস্থাপনা',
      'waste & sanitation': 'পয়ঃপ্রণালী ও বর্জ্য ব্যবস্থাপনা',
      'waste management': 'বর্জ্য ব্যবস্থাপনা',
      'sanitation & waste': 'পয়ঃপ্রণালী ও বর্জ্য',
      'sanitation': 'স্যানিটেশন',
      'roads & infrastructure': 'রাস্তা ও পরিকাঠামো',
      'rural infrastructure': 'গ্রামীণ পরিকাঠামো',
      'infrastructure': 'পরিকাঠামো',
      'health & medtech': 'স্বাস্থ্যসেবা ও চিকিৎসা',
      'healthcare': 'স্বাস্থ্যসেবা',
      'smart education': 'শিক্ষা ও বিদ্যালয়',
      'education': 'শিক্ষা',
      'agriculture & foodtech': 'কৃষি ও খাদ্য প্রযুক্তি',
      'agriculture': 'কৃষি',
      'public safety': 'জননিরাপত্তা',
      'general': 'সাধারণ সমস্যা',
      'general issue': 'সাধারণ সমস্যা',
      'civic & infrastructure': 'নাগরিক পরিকাঠামো'
    },
    or: {
      'electricity & lighting': 'ବିଦ୍ୟୁତ୍ ଓ ଆଲୋକ ବ୍ୟବସ୍ଥା',
      'clean energy': 'ବିଦ୍ୟୁତ୍ ଓ ସ୍ୱଚ୍ଛ ଶକ୍ତି',
      'electricity': 'ବିଦ୍ୟୁତ୍ ଓ ଆଲୋକ',
      'water management': 'ଜଳ ପରିଚାଳନା ଓ ଯୋଗାଣ',
      'water & sanitation': 'ଜଳ ଓ ପରିମଳ',
      'water': 'ଜଳ ପରିଚାଳନା',
      'waste & sanitation': 'ପରିମଳ ଓ ଆବର୍ଜନା ପରିଚାଳନା',
      'waste management': 'ଆବର୍ଜନା ପରିଚାଳନା',
      'sanitation & waste': 'ପରିମଳ ଓ ବର୍ଜ୍ୟବସ୍ତୁ',
      'sanitation': 'ପରିମଳ',
      'roads & infrastructure': 'ରାସ୍ତା ଓ ଭିତ୍ତିଭୂମି',
      'rural infrastructure': 'ଗ୍ରାମୀଣ ଭିତ୍ତିଭୂମି',
      'infrastructure': 'ଭିତ୍ତିଭୂମି',
      'health & medtech': 'ସ୍ୱାସ୍ଥ୍ୟସେବା ଓ ଚିକିତ୍ସା',
      'healthcare': 'ସ୍ୱାସ୍ଥ୍ୟସେବା',
      'smart education': 'ଶିକ୍ଷା ଓ ବିଦ୍ୟାଳୟ',
      'education': 'ଶିକ୍ଷା',
      'agriculture & foodtech': 'କୃଷି ଓ ଖାଦ୍ୟ ପ୍ରଯୁକ୍ତି',
      'agriculture': 'କୃଷି',
      'public safety': 'ଜନସୁରକ୍ଷା',
      'general': 'ସାଧାରଣ ସମସ୍ୟା',
      'general issue': 'ସାଧାରଣ ସମସ୍ୟା',
      'civic & infrastructure': 'ନାଗରିକ ଭିତ୍ତିଭୂମି'
    },
    sat: {
      'electricity & lighting': 'ᱵᱤᱡᱞᱤ ᱟᱨ ᱢᱟᱨᱥᱟᱞ',
      'clean energy': 'ᱵᱤᱡᱞᱤ ᱵᱮᱵᱚᱥᱛᱟ',
      'electricity': 'ᱵᱤᱡᱞᱤ',
      'water management': 'ᱫᱟᱜ ᱵᱮᱵᱚᱥᱛᱟ',
      'water & sanitation': 'ᱫᱟᱜ ᱟᱨ ᱥᱟᱯᱷᱟᱹᱭ',
      'water': 'ᱫᱟᱜ ᱵᱮᱵᱚᱥᱛᱟ',
      'waste & sanitation': 'ᱥᱟᱯᱷᱟᱹᱭ ᱟᱨ ᱦᱚᱲᱟ',
      'waste management': 'ᱦᱚᱲᱟ ᱵᱮᱵᱚᱥᱛᱟ',
      'sanitation & waste': 'ᱥᱟᱯᱷᱟᱹᱭ ᱟᱨ ᱦᱚᱲᱟ',
      'sanitation': 'ᱥᱟᱯᱷᱟᱹᱭ',
      'roads & infrastructure': 'ᱨᱟᱥᱛᱟ ᱟᱨ ᱵᱤᱠᱟᱥ',
      'rural infrastructure': 'ᱟᱹᱛᱩ ᱨᱟᱥᱛᱟ ᱵᱤᱠᱟᱥ',
      'infrastructure': 'ᱵᱤᱠᱟᱥ',
      'health & medtech': 'ᱦᱚᱲᱢᱚ ᱥᱮᱵᱟ',
      'healthcare': 'ᱦᱚᱲᱢᱚ ᱥᱮᱵᱟ',
      'smart education': 'ᱯᱟᱹᱲᱦᱟᱹᱣ ᱟᱨ ᱤᱥᱠᱩᱞ',
      'education': 'ᱯᱟᱹᱲᱦᱟᱹᱣ',
      'agriculture & foodtech': 'ᱪᱟᱥ ᱟᱨ ᱡᱚᱢᱟᱜ',
      'agriculture': 'ᱪᱟᱥ',
      'public safety': 'ᱦᱚᱲ ᱥᱮᱠᱩᱨᱤᱴᱤ',
      'general': 'ᱥᱟᱫᱟᱨᱚᱱ ᱥᱚᱢᱚᱥᱭᱟ',
      'general issue': 'ᱥᱟᱫᱟᱨᱚᱱ ᱥᱚᱢᱚᱥᱭᱟ',
      'civic & infrastructure': 'ᱱᱟᱜᱟᱨᱤᱠ ᱵᱤᱠᱟᱥ'
    }
  };

  const dict = categoryMap[langCode] || categoryMap.hi;
  if (dict[key]) return dict[key];

  for (const [k, v] of Object.entries(dict)) {
    if (key.includes(k) || k.includes(key)) return v;
  }

  return category;
}

export function localizePriority(priority, language = 'hi') {
  if (!priority || typeof priority !== 'string') return priority || '';
  if (!language || language === 'en') return priority;

  const key = priority.trim().toLowerCase();
  const langCode = ['ho', 'nag', 'kur', 'kho', 'mul'].includes(language) ? 'hi' : language;

  const priorityMap = {
    hi: {
      critical: 'गंभीर',
      'critical priority': 'गंभीर प्राथमिकता',
      high: 'उच्च',
      'high priority': 'उच्च प्राथमिकता',
      medium: 'मध्यम',
      'medium priority': 'मध्यम प्राथमिकता',
      low: 'कम',
      'low priority': 'कम प्राथमिकता'
    },
    bn: {
      critical: 'সংকটপূর্ণ',
      'critical priority': 'সংকটপূর্ণ অগ্রাধিকার',
      high: 'উচ্চ',
      'high priority': 'উচ্চ অগ্রাধিকার',
      medium: 'মাঝারি',
      'medium priority': 'মাঝারি অগ্রাধিকার',
      low: 'কম',
      'low priority': 'কম অগ্রাধিকার'
    },
    or: {
      critical: 'ଅତ୍ୟନ୍ତ ଜରୁରୀ',
      'critical priority': 'ଅତ୍ୟନ୍ତ ଜରୁରୀ',
      high: 'ଉଚ୍ଚ',
      'high priority': 'ଉଚ୍ଚ ପ୍ରାଥମିକତା',
      medium: 'ମଧ୍ୟମ',
      'medium priority': 'ମଧ୍ୟମ ପ୍ରାଥମିକତା',
      low: 'କମ୍',
      'low priority': 'କମ୍ ପ୍ରାଥମିକତା'
    },
    sat: {
      critical: 'ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲᱤ',
      'critical priority': 'ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲᱤ',
      high: 'ᱩᱥᱩᱞ',
      'high priority': 'ᱩᱥᱩᱞ ᱡᱟᱹᱨᱩᱲᱤ',
      medium: 'ᱛᱟᱞᱟ',
      'medium priority': 'ᱛᱟᱞᱟ ᱡᱟᱹᱨᱩᱲᱤ',
      low: 'ᱠᱚᱢ',
      'low priority': 'ᱠᱚᱢ ᱡᱟᱹᱨᱩᱲᱤ'
    }
  };

  const dict = priorityMap[langCode] || priorityMap.hi;
  if (dict[key]) return dict[key];

  if (key.includes('crit')) return dict.critical;
  if (key.includes('high')) return dict.high;
  if (key.includes('med')) return dict.medium;
  if (key.includes('low')) return dict.low;

  return priority;
}

export function localizeCollaborator(collab, language = 'hi') {
  if (!collab || typeof collab !== 'string') return collab || '';
  if (!language || language === 'en') return collab;

  const key = collab.trim().toLowerCase();
  const langCode = ['ho', 'nag', 'kur', 'kho', 'mul'].includes(language) ? 'hi' : language;

  const map = {
    hi: {
      government: 'सरकार',
      universities: 'विश्वविद्यालय',
      university: 'विश्वविद्यालय',
      industry: 'उद्योग',
      ngos: 'गैर-सरकारी संगठन (NGO)',
      ngo: 'गैर-सरकारी संगठन (NGO)'
    },
    bn: {
      government: 'সরকার',
      universities: 'বিশ্ববিদ্যালয়',
      university: 'বিশ্ববিদ্যালয়',
      industry: 'শিল্প',
      ngos: 'এনজিও',
      ngo: 'এনজিও'
    },
    or: {
      government: 'ସରକାର',
      universities: 'ବିଶ୍ୱବିଦ୍ୟାଳୟ',
      university: 'ବିଶ୍ୱବିଦ୍ୟାଳୟ',
      industry: 'ଶିଳ୍ପ',
      ngos: 'ଏନଜିଓ',
      ngo: 'ଏନଜିଓ'
    },
    sat: {
      government: 'ᱥᱚᱨᱠᱟᱨ',
      universities: 'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ',
      university: 'ᱤᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ',
      industry: 'ᱤᱱᱰᱟᱥᱴᱨᱤ',
      ngos: 'ᱮᱱ.ᱡᱤ.ᱳ',
      ngo: 'ᱮᱱ.ᱡᱤ.ᱳ'
    }
  };

  const dict = map[langCode] || map.hi;
  if (dict[key]) return dict[key];

  for (const [k, v] of Object.entries(dict)) {
    if (key.startsWith(k)) {
      // e.g. "Government (Urja Nigam)" -> "सरकार (विद्युत निगम)"
      return collab.replace(new RegExp(k, 'i'), v);
    }
  }

  return collab;
}

export function citizenText(language, key, values = {}) {
  const catalog = ui[language] || ui.en;
  let text = catalog[key];
  if (text == null) text = ui.en[key] ?? key;
  Object.entries(values).forEach(([name, value]) => { text = String(text).replaceAll(`{{${name}}}`, String(value)); });
  return text;
}
