// AUTO-GENERATED from the Owner Academy content source. Answer keys live in the
// database (public.training_keys) and are graded server-side by submit_training().
// To update a module: edit content, bump its version, and insert a new key row.

export type Lesson = { title: string; body: string[]; list_title?: string; list?: string[] };
export type QuizQuestion = { q: string; options: string[] };
export type TrainingModule = { slug: string; num: number; version: number; title: string; minutes: number; required: "TMR" | "Fleet Formal"; summary: string; lessons: Lesson[]; quiz: QuizQuestion[] };

export const PASS_PERCENT = 80;

export const MODULES: TrainingModule[] = [
  {
    "slug": "anti-discrimination",
    "num": 1,
    "version": 1,
    "title": "Anti-discrimination & sexual harassment",
    "minutes": 15,
    "required": "TMR",
    "summary": "Protected attributes, direct and indirect discrimination, unconscious bias, and what counts as sexual harassment.",
    "lessons": [
      {
        "title": "Your legal duty",
        "body": [
          "Queensland law says every booked hire driver must be trained in anti-discrimination awareness, including sexual harassment, before their first paid trip. Fleet Formal can't send you a booking until you pass this module.",
          "Under the Anti-Discrimination Act 1991 (Qld) it's unlawful to treat a passenger worse because of a protected attribute. Federal laws (Sex, Race, Age and Disability Discrimination Acts) say the same."
        ],
        "list_title": "Protected attributes in Queensland",
        "list": [
          "Sex, sex characteristics, gender identity and sexuality",
          "Relationship status, pregnancy, parental status, breastfeeding and family responsibilities",
          "Age",
          "Race, including descent, ethnicity and nationality",
          "Impairment (disability), including relying on an assistance animal or mobility aid",
          "Religion, political belief, trade union activity and sex work activity",
          "Being associated with someone who has any of these attributes"
        ]
      },
      {
        "title": "How discrimination happens",
        "body": [
          "Direct discrimination is treating someone worse because of who they are. Example: cancelling a booking when you see two boys are each other's formal date.",
          "Indirect discrimination is a rule that looks fair but disadvantages some people. Example: \"no animals in my classic car\" shuts out a passenger with a guide dog. That's unlawful.",
          "Unconscious bias is an assumption you don't notice you're making. Example: speaking only to the boy and ignoring his date when you confirm the address. Treat every passenger as an individual."
        ]
      },
      {
        "title": "Sexual harassment",
        "body": [
          "Sexual harassment is any unwelcome sexual remark, look, touch, request or message. It doesn't matter whether you meant it as a joke or a compliment: what counts is how it's received.",
          "Most of our passengers are 16 to 18, so Fleet Formal's line is stricter than the law. \"You all look fantastic\" is the limit."
        ],
        "list_title": "Never",
        "list": [
          "Comment on bodies, or say someone looks \"hot\" or \"sexy\"",
          "Touch anyone without being asked, and even then only to help",
          "Make sexual jokes or innuendo, or play explicit music",
          "Ask for phone numbers or social media, or contact anyone after the trip"
        ]
      },
      {
        "title": "Doing it right",
        "body": [
          "Give everyone the same warm welcome, the same help and the same respect. Avoid stereotypes about how people should look, dress or behave.",
          "If passengers harass or put each other down, calmly say \"Let's keep it respectful in the car tonight.\" If someone is unsafe or distressed, stop safely and call Fleet Formal.",
          "It's also unlawful to treat someone badly because they complained. Report any incident to Fleet Formal within 24 hours."
        ]
      }
    ],
    "quiz": [
      {
        "q": "Which of these is a protected attribute in Queensland?",
        "options": [
          "Favourite footy team",
          "Gender identity",
          "Type of car you drive"
        ]
      },
      {
        "q": "A rule that looks fair but disadvantages some people is called:",
        "options": [
          "Fair policy",
          "Direct discrimination",
          "Indirect discrimination"
        ]
      },
      {
        "q": "Refusing a booking because the passengers are a same-sex couple is:",
        "options": [
          "Direct discrimination and unlawful",
          "Only a problem if they complain",
          "Fine if it's your own car"
        ]
      },
      {
        "q": "You tell a passenger \"you look really hot tonight\". This is:",
        "options": [
          "A harmless compliment",
          "Sexual harassment",
          "Fine if they're over 18"
        ]
      },
      {
        "q": "What counts when deciding whether a remark is harassment?",
        "options": [
          "Whether anyone else heard it",
          "Whether you meant it as a joke",
          "How it's received by the passenger"
        ]
      },
      {
        "q": "Unconscious bias is best described as:",
        "options": [
          "A legal defence",
          "Something only other people have",
          "An assumption you don't notice you're making"
        ]
      },
      {
        "q": "A passenger in your car makes a racist comment to another. You should:",
        "options": [
          "Ignore it, it's not your business",
          "Calmly ask everyone to keep it respectful, and report it",
          "Join in to keep the mood light"
        ]
      },
      {
        "q": "After a passenger complains about you, it's unlawful to:",
        "options": [
          "Report it to Fleet Formal",
          "Treat them worse because they complained",
          "Apologise"
        ]
      },
      {
        "q": "When should you report an incident to Fleet Formal?",
        "options": [
          "Within 24 hours",
          "At the end of the formal season",
          "Only if police are called"
        ]
      },
      {
        "q": "Which greeting fits the Fleet Formal standard?",
        "options": [
          "\"Which of you two is the boyfriend?\"",
          "\"You all look fantastic, ready for a great night?\"",
          "\"Nice dress, very sexy\""
        ]
      }
    ]
  },
  {
    "slug": "disability-awareness",
    "num": 2,
    "version": 1,
    "title": "Disability awareness",
    "minutes": 15,
    "required": "TMR",
    "summary": "Visible and invisible disability, communicating well, asking before helping, assistance animals and mobility aids.",
    "lessons": [
      {
        "title": "Disability isn't always visible",
        "body": [
          "Queensland law also requires disability awareness training before your first paid trip.",
          "Disability can be physical, intellectual, sensory (vision or hearing) or psychosocial (mental health). Many disabilities can't be seen: autism, anxiety, epilepsy, diabetes, chronic pain, arthritis or hearing loss.",
          "Never assume someone is fine, or that they need help, based on how they look."
        ]
      },
      {
        "title": "Communicating well",
        "body": [
          "Speak directly to the passenger, not their friend or parent. Keep eye contact and use plain, normal language. Don't raise your voice unless asked."
        ],
        "list_title": "Good habits",
        "list": [
          "Always ask before helping: \"Would you like a hand?\" and wait for a yes",
          "Never touch or move a wheelchair, cane or other aid without permission",
          "Give passengers time, and don't finish their sentences",
          "If you don't understand, say so and ask them to repeat it",
          "Tell a passenger with low vision what you're doing: \"I'm opening your door now\""
        ]
      },
      {
        "title": "Assistance animals",
        "body": [
          "A passenger with a guide, hearing or assistance dog can always bring the dog in your car. That's the law under the Guide, Hearing and Assistance Dogs Act 2009 (Qld) and federal disability law.",
          "You can't refuse, charge extra, or ask the passenger to put the dog in the boot. You may politely ask to see the handler's identity card. Allergies or a precious interior aren't a reason to refuse: tell Fleet Formal at booking time and we'll match a suitable car."
        ]
      },
      {
        "title": "Mobility aids and sensory needs",
        "body": [
          "Classic cars can be low, narrow and loud. Fleet Formal asks about access needs at booking so the right car is matched. If a booking arrives with needs your car can't meet, tell us straight away, never on the night.",
          "Fold and store mobility aids carefully, and keep them within reach on arrival.",
          "Some passengers are sensitive to noise, light or crowds. Ask before revving the engine for photos: \"Are you OK with a few revs?\""
        ]
      }
    ],
    "quiz": [
      {
        "q": "Which of these can be an invisible disability?",
        "options": [
          "A broken arm in a cast",
          "A wheelchair",
          "Epilepsy"
        ]
      },
      {
        "q": "A passenger's friend answers for them. Who should you speak to?",
        "options": [
          "The friend, it's quicker",
          "The passenger directly",
          "The parent only"
        ]
      },
      {
        "q": "Before helping a passenger out of the car you should:",
        "options": [
          "Wait for a parent",
          "Just help, it's polite",
          "Ask if they'd like a hand and wait for a yes"
        ]
      },
      {
        "q": "A passenger books with a guide dog. You can:",
        "options": [
          "Charge a cleaning fee",
          "Not refuse, but may ask to see the handler's ID card",
          "Refuse if you have a classic car"
        ]
      },
      {
        "q": "Can you ask the guide dog to ride in the boot?",
        "options": [
          "Yes",
          "No",
          "Only on long trips"
        ]
      },
      {
        "q": "Your car can't fit a passenger's wheelchair. When should you say so?",
        "options": [
          "Never",
          "On the night",
          "As soon as the booking arrives, to Fleet Formal"
        ]
      },
      {
        "q": "Before revving the engine for photos you should:",
        "options": [
          "Ask the passengers if they're OK with it",
          "Warn the neighbours",
          "Just do it, everyone loves it"
        ]
      },
      {
        "q": "Which law protects assistance dog handlers in Queensland?",
        "options": [
          "Guide, Hearing and Assistance Dogs Act 2009",
          "Road Rules Act",
          "Pet Ownership Act"
        ]
      }
    ]
  },
  {
    "slug": "respect-privacy",
    "num": 3,
    "version": 1,
    "title": "Respect & privacy on every ride",
    "minutes": 15,
    "required": "Fleet Formal",
    "summary": "The rideshare no-go list: no personal questions, no comments on looks or gender, no flirting or touching, no contact after the trip, plus LGBTQ+ inclusion.",
    "lessons": [
      {
        "title": "Why it matters",
        "body": [
          "Formal night is a huge night for every student, and for LGBTQ+ students it can also be a brave one. Some are going with a same-sex date, some are wearing the outfit that fits who they are, and some aren't out to everyone yet.",
          "Our rules follow the same standard as Uber's Australian Community Guidelines, which every rideshare driver agrees to. Breaking them can mean losing access to Fleet Formal."
        ]
      },
      {
        "title": "The no-go list",
        "body": [
          "It's fine to chat. \"Big night!\" and \"You all look fantastic\" are perfect. Keep conversation on the night, the car and the music."
        ],
        "list_title": "Don't",
        "list": [
          "Ask about sexuality, relationships, or who is dating who",
          "Comment on bodies or appearance, even as a \"compliment\"",
          "Comment on someone's perceived gender identity or sexual orientation",
          "Flirt, wink, whistle or stand too close",
          "Touch anyone unless they've asked for help",
          "Raise religion or politics",
          "Use slurs or tell jokes about any group"
        ]
      },
      {
        "title": "Names, pronouns and dates",
        "body": [
          "Use the name on the booking, or ask: \"What name should I use tonight?\" Use the pronouns the passenger uses. If you're unsure, use their name or \"they\".",
          "Assume nothing about who is whose date. Compliment every outfit the same way, whether it's a suit, a gown or something in between.",
          "If you get a name or pronoun wrong, say \"Sorry, Jordan\" and move on. Don't over-apologise or make it about you."
        ]
      },
      {
        "title": "Keeping things private",
        "body": [
          "What happens in the car stays in the car. Never mention a student's date, outfit or name to parents, school staff or anyone else: you could out them.",
          "Don't take photos of passengers on your own phone, and never post them. If asked, use the family's phone.",
          "Contact ends when the trip ends. No calls, texts, follows or friend requests. The only exception is returning lost property, through Fleet Formal. If you use a dashcam, never share or post the footage."
        ]
      },
      {
        "title": "If something goes wrong",
        "body": [
          "If passengers make a homophobic or transphobic comment to each other, calmly say \"Let's keep it respectful in the car tonight.\"",
          "If a passenger is upset, unsafe or being targeted, stop somewhere safe and call Fleet Formal. In an emergency, call 000 first.",
          "Report any complaint, incident or comment you weren't comfortable with within 24 hours."
        ]
      }
    ],
    "quiz": [
      {
        "q": "Two passengers arrive holding hands. What do you say?",
        "options": [
          "Nothing until they explain who they are",
          "\"Aww, are you two a couple?\"",
          "\"Welcome! You both look fantastic. Ready for a great night?\""
        ]
      },
      {
        "q": "The booking says \"Jordan\" but you heard a parent say \"Jessica\". What do you call the passenger?",
        "options": [
          "Jordan, or ask what name to use tonight",
          "Mate",
          "Jessica"
        ]
      },
      {
        "q": "You're not sure which pronoun a passenger uses. You:",
        "options": [
          "Guess from their outfit",
          "Use their name or \"they\", or ask politely",
          "Avoid talking to them"
        ]
      },
      {
        "q": "A dad at pick-up asks who his son's date is. You say:",
        "options": [
          "Show him a photo",
          "Tell him what you saw",
          "\"You'd best ask them!\" and keep it private"
        ]
      },
      {
        "q": "When can you message a passenger after the trip?",
        "options": [
          "Only to return lost property, through Fleet Formal",
          "If they followed you first",
          "To say thanks"
        ]
      },
      {
        "q": "A student asks you to post a group photo on your Instagram. You:",
        "options": [
          "Post it, they asked",
          "Politely say no, and offer to take it on their phone",
          "Post it without faces"
        ]
      },
      {
        "q": "You misgender a passenger. What's the best response?",
        "options": [
          "Ignore it",
          "\"Sorry, [name]\" and move on",
          "A long apology"
        ]
      },
      {
        "q": "Which topic is fine to chat about?",
        "options": [
          "The car and the night ahead",
          "Their religion",
          "Their relationship status"
        ]
      }
    ]
  },
  {
    "slug": "child-safety",
    "num": 4,
    "version": 1,
    "title": "Child safety on formal night",
    "minutes": 10,
    "required": "Fleet Formal",
    "summary": "Under-18 passengers, your blue card duties, alcohol and vapes, pick-ups and drop-offs, photos and reporting.",
    "lessons": [
      {
        "title": "Your passengers are young",
        "body": [
          "Most Fleet Formal passengers are under 18. That's why we require every driver to hold a blue card, and why Queensland's Child Safe Standards apply to transport providers like us.",
          "Your job is to get them there and home safely, on time, and having had a great night."
        ]
      },
      {
        "title": "On the night",
        "body": [],
        "list_title": "Every booking",
        "list": [
          "A parent or guardian has confirmed the booking before you arrive",
          "Pick up and drop off only at the confirmed addresses, with no unplanned stops",
          "Everyone wears a seatbelt, and you never carry more people than seats",
          "No alcohol, vapes or drugs in the car, ever. If it happens, end the trip safely and call Fleet Formal",
          "Never ask a passenger to sit in the front if they'd rather not",
          "Message Fleet Formal when you pick up and drop off, so parents know where their kids are"
        ]
      },
      {
        "title": "Photos and contact",
        "body": [
          "Never photograph passengers on your own phone. Use the family's phone if asked, and never post anything.",
          "All contact with students goes through Fleet Formal. Don't swap numbers, follow students on social media or contact them after the night."
        ]
      },
      {
        "title": "Spotting and reporting harm",
        "body": [
          "Watch for a passenger who is very distressed, intoxicated, injured, or being pressured by others. If someone tells you they're being harmed, listen calmly, don't promise to keep it secret, and tell Fleet Formal straight away.",
          "If anyone is in immediate danger, call 000. For non-urgent police matters, call Policelink on 131 444."
        ]
      }
    ],
    "quiz": [
      {
        "q": "Why does Fleet Formal require every driver to hold a blue card?",
        "options": [
          "It's cheaper insurance",
          "Most passengers are under 18",
          "It replaces a driver licence"
        ]
      },
      {
        "q": "Where can you drop off passengers?",
        "options": [
          "At the nearest servo",
          "Wherever they ask",
          "Only at the confirmed address"
        ]
      },
      {
        "q": "A passenger opens a can of alcohol in your car. You:",
        "options": [
          "End the trip safely and call Fleet Formal",
          "Join the celebration",
          "Ignore it if they're quiet"
        ]
      },
      {
        "q": "Five students turn up for your four-seat car. You:",
        "options": [
          "Squeeze them in",
          "Only carry as many people as seats, and call Fleet Formal",
          "Put one in the boot"
        ]
      },
      {
        "q": "A student asks for your mobile number to stay in touch. You:",
        "options": [
          "Follow them on Instagram instead",
          "Give it to them",
          "Politely say all contact goes through Fleet Formal"
        ]
      },
      {
        "q": "A student tells you someone at the party hurt them. You:",
        "options": [
          "Listen calmly, don't promise secrecy, and tell Fleet Formal",
          "Tell them to talk to their parents later",
          "Promise to keep it secret"
        ]
      },
      {
        "q": "Someone is in immediate danger. Who do you call first?",
        "options": [
          "Fleet Formal",
          "000",
          "The school"
        ]
      },
      {
        "q": "When should you message Fleet Formal on the night?",
        "options": [
          "Never",
          "Only if something goes wrong",
          "At pick-up and at drop-off"
        ]
      }
    ]
  }
];

export const moduleBySlug = (slug: string | null) => MODULES.find((m) => m.slug === slug) ?? null;
