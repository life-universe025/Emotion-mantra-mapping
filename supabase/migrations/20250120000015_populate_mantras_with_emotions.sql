-- Populate mantras table with data from mantras.ts file
-- Map each mantra to its corresponding emotion using emotion_id

-- Insert all mantras with their emotion mappings
INSERT INTO mantras (slug, sanskrit, devanagari, transliteration, meaning, suggested_rounds, emotion_id, emotions) VALUES
('mahamrityunjaya', 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat', 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्', 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat', 'Healing, protection; removes fear and grants longevity', 108, 'ANXIETY', ARRAY['ANXIETY']),
('gayatri', 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yonaḥ Prachodayāt', 'ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', 'Om Bhur Bhuvah Svah Tat-savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yonah Prachodayat', 'Awakens inner light and clarity; dispels mental fog', 108, 'STRESS', ARRAY['STRESS']),
('om-namah-shivaya', 'Om Namah Shivaya', 'ॐ नमः शिवाय', 'Om Namah Shivaya', 'Surrendering ego; calming the fire within', 108, 'ANGER', ARRAY['ANGER']),
('so-ham', 'So Ham', 'सो ऽहम्', 'So Ham', 'Breath-anchoring "I am That"; grounding and centering', 108, 'GROUNDING', ARRAY['GROUNDING']),
('om-mani-padme-hum', 'Om Mani Padme Hum', 'ॐ मणि पद्मे हूँ', 'Om Mani Padme Hum', 'Compassion and ease of sorrow; Tibetan Buddhist mantra', 108, 'SADNESS', ARRAY['SADNESS']),
('ganesh-mantra', 'Om Gam Ganapataye Namaha', 'ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namaha', 'Remover of obstacles; new beginnings and confidence', 108, 'CONFIDENCE', ARRAY['CONFIDENCE']),
('om-shanti', 'Om Shanti Shanti Shanti', 'ॐ शान्तिः शान्तिः शान्तिः', 'Om Shanti Shanti Shanti', 'Invokes peace in body, mind, and spirit', 108, 'PEACE', ARRAY['PEACE']),
('lokah-samastah', 'Lokah Samastah Sukhino Bhavantu', 'लोकाः समस्ताः सुखिनो भवन्तु', 'Lokah Samastah Sukhino Bhavantu', 'May all beings everywhere be happy and free', 108, 'GRATITUDE', ARRAY['GRATITUDE']),
('saraswati-mantra', 'Om Aim Saraswatyai Namah', 'ॐ ऐं सरस्वत्यै नमः', 'Om Aim Saraswatyai Namah', 'Clarity and learning; goddess of wisdom', 108, 'FOCUS', ARRAY['FOCUS']),
('aham-brahmasmi', 'Aham Brahmasmi', 'अहं ब्रह्मास्मि', 'Aham Brahmasmi', 'Non-dual realization; release identification with ego', 108, 'LETTING_GO', ARRAY['LETTING_GO']),
('om-namah-shivaya-loneliness', 'Om Namah Shivaya', 'ॐ नमः शिवाय', 'Om Namah Shivaya', 'Connection to the divine within; overcoming isolation', 108, 'LONELINESS', ARRAY['LONELINESS']),
('om-shanti-restlessness', 'Om Shanti Shanti Shanti', 'ॐ शान्तिः शान्तिः शान्तिः', 'Om Shanti Shanti Shanti', 'Peace in body, mind, and spirit; calming restlessness', 108, 'RESTLESSNESS', ARRAY['RESTLESSNESS']),
('om-surya-namaha', 'Om Surya Namaha', 'ॐ सूर्य नमः', 'Om Surya Namaha', 'Invoking solar energy and vitality', 108, 'ENERGY', ARRAY['ENERGY']),
('om-saraswati-namaha', 'Om Saraswati Namaha', 'ॐ सरस्वती नमः', 'Om Saraswati Namaha', 'Goddess of creativity, arts, and inspiration', 108, 'CREATIVITY', ARRAY['CREATIVITY']),
('om-aim-hrim-klim-chamundaye-viche', 'Om Aim Hrim Klim Chamundaye Viche', 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे', 'Om Aim Hrim Klim Chamundaye Viche', 'Goddess of clarity and removing obstacles to wisdom', 108, 'CLARITY', ARRAY['CLARITY']),
('om-hanuman-namaha', 'Om Hanuman Namaha', 'ॐ हनुमान् नमः', 'Om Hanuman Namaha', 'Divine protection and strength', 108, 'PROTECTION', ARRAY['PROTECTION']),
('om-gam-ganapataye-namaha', 'Om Gam Ganapataye Namaha', 'ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namaha', 'Remover of obstacles; motivation and new beginnings', 108, 'MOTIVATION', ARRAY['MOTIVATION']),
('om-kali-namaha', 'Om Kali Namaha', 'ॐ काली नमः', 'Om Kali Namaha', 'Goddess of time and transformation; patience with process', 108, 'PATIENCE', ARRAY['PATIENCE']),
('om-ram-ramaya-namaha', 'Om Ram Ramaya Namaha', 'ॐ राम रामाय नमः', 'Om Ram Ramaya Namaha', 'Divine renewal and fresh beginnings', 108, 'RENEWAL', ARRAY['RENEWAL']),
('om-kamala-namaha', 'Om Kamala Namaha', 'ॐ कमला नमः', 'Om Kamala Namaha', 'Goddess of self-love and inner beauty', 108, 'SELF_LOVE', ARRAY['SELF_LOVE']),
('om-gayatri-wisdom', 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yonaḥ Prachodayāt', 'ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', 'Om Bhur Bhuvah Svah Tat-savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yonah Prachodayat', 'Awakening inner wisdom and divine knowledge', 108, 'WISDOM', ARRAY['WISDOM']),
('om-dhanvantre-namaha', 'Om Dhanvantre Namaha', 'ॐ धन्वन्तरे नमः', 'Om Dhanvantre Namaha', 'Divine physician; healing and recovery', 108, 'HEALING', ARRAY['HEALING'])
ON CONFLICT (slug) DO UPDATE SET
  sanskrit = EXCLUDED.sanskrit,
  devanagari = EXCLUDED.devanagari,
  transliteration = EXCLUDED.transliteration,
  meaning = EXCLUDED.meaning,
  suggested_rounds = EXCLUDED.suggested_rounds,
  emotion_id = EXCLUDED.emotion_id,
  emotions = EXCLUDED.emotions;

-- Verify the data was inserted correctly
SELECT COUNT(*) as total_mantras FROM mantras;
SELECT m.slug, m.emotion_id, e.name as emotion_name, e.icon as emotion_icon 
FROM mantras m 
LEFT JOIN emotions e ON m.emotion_id = e.id 
ORDER BY m.slug;
