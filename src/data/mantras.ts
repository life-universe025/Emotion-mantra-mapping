import { Mantra } from '../types'

export const mantras: Omit<Mantra, 'id'>[] = [
  {
    slug: 'mahamrityunjaya',
    sanskrit: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
    devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
    transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
    meaning: 'Healing, protection; removes fear and grants longevity',
    suggested_rounds: 108,
    emotions: ['ANXIETY']
  },
  {
    slug: 'gayatri',
    sanskrit: 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yonaḥ Prachodayāt',
    devanagari: 'ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    transliteration: 'Om Bhur Bhuvah Svah Tat-savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yonah Prachodayat',
    meaning: 'Awakens inner light and clarity; dispels mental fog',
    suggested_rounds: 108,
    emotions: ['STRESS']
  },
  {
    slug: 'om-namah-shivaya',
    sanskrit: 'Om Namah Shivaya',
    devanagari: 'ॐ नमः शिवाय',
    transliteration: 'Om Namah Shivaya',
    meaning: 'Surrendering ego; calming the fire within',
    suggested_rounds: 108,
    emotions: ['ANGER']
  },
  {
    slug: 'so-ham',
    sanskrit: 'So Ham',
    devanagari: 'सो ऽहम्',
    transliteration: 'So Ham',
    meaning: 'Breath-anchoring "I am That"; grounding and centering',
    suggested_rounds: 108,
    emotions: ['GROUNDING']
  },
  {
    slug: 'om-mani-padme-hum',
    sanskrit: 'Om Mani Padme Hum',
    devanagari: 'ॐ मणि पद्मे हूँ',
    transliteration: 'Om Mani Padme Hum',
    meaning: 'Compassion and ease of sorrow; Tibetan Buddhist mantra',
    suggested_rounds: 108,
    emotions: ['SADNESS']
  },
  {
    slug: 'ganesh-mantra',
    sanskrit: 'Om Gam Ganapataye Namaha',
    devanagari: 'ॐ गं गणपतये नमः',
    transliteration: 'Om Gam Ganapataye Namaha',
    meaning: 'Remover of obstacles; new beginnings and confidence',
    suggested_rounds: 108,
    emotions: ['CONFIDENCE']
  },
  {
    slug: 'om-shanti',
    sanskrit: 'Om Shanti Shanti Shanti',
    devanagari: 'ॐ शान्तिः शान्तिः शान्तिः',
    transliteration: 'Om Shanti Shanti Shanti',
    meaning: 'Invokes peace in body, mind, and spirit',
    suggested_rounds: 108,
    emotions: ['PEACE']
  },
  {
    slug: 'lokah-samastah',
    sanskrit: 'Lokah Samastah Sukhino Bhavantu',
    devanagari: 'लोकाः समस्ताः सुखिनो भवन्तु',
    transliteration: 'Lokah Samastah Sukhino Bhavantu',
    meaning: 'May all beings everywhere be happy and free',
    suggested_rounds: 108,
    emotions: ['GRATITUDE']
  },
  {
    slug: 'saraswati-mantra',
    sanskrit: 'Om Aim Saraswatyai Namah',
    devanagari: 'ॐ ऐं सरस्वत्यै नमः',
    transliteration: 'Om Aim Saraswatyai Namah',
    meaning: 'Clarity and learning; goddess of wisdom',
    suggested_rounds: 108,
    emotions: ['FOCUS']
  },
  {
    slug: 'aham-brahmasmi',
    sanskrit: 'Aham Brahmasmi',
    devanagari: 'अहं ब्रह्मास्मि',
    transliteration: 'Aham Brahmasmi',
    meaning: 'Non-dual realization; release identification with ego',
    suggested_rounds: 108,
    emotions: ['LETTING_GO']
  },
  {
    slug: 'om-namah-shivaya-loneliness',
    sanskrit: 'Om Namah Shivaya',
    devanagari: 'ॐ नमः शिवाय',
    transliteration: 'Om Namah Shivaya',
    meaning: 'Connection to the divine within; overcoming isolation',
    suggested_rounds: 108,
    emotions: ['LONELINESS']
  },
  {
    slug: 'om-shanti-restlessness',
    sanskrit: 'Om Shanti Shanti Shanti',
    devanagari: 'ॐ शान्तिः शान्तिः शान्तिः',
    transliteration: 'Om Shanti Shanti Shanti',
    meaning: 'Peace in body, mind, and spirit; calming restlessness',
    suggested_rounds: 108,
    emotions: ['RESTLESSNESS']
  },
  {
    slug: 'om-surya-namaha',
    sanskrit: 'Om Surya Namaha',
    devanagari: 'ॐ सूर्य नमः',
    transliteration: 'Om Surya Namaha',
    meaning: 'Invoking solar energy and vitality',
    suggested_rounds: 108,
    emotions: ['ENERGY']
  },
  {
    slug: 'om-saraswati-namaha',
    sanskrit: 'Om Saraswati Namaha',
    devanagari: 'ॐ सरस्वती नमः',
    transliteration: 'Om Saraswati Namaha',
    meaning: 'Goddess of creativity, arts, and inspiration',
    suggested_rounds: 108,
    emotions: ['CREATIVITY']
  },
  {
    slug: 'om-aim-hrim-klim-chamundaye-viche',
    sanskrit: 'Om Aim Hrim Klim Chamundaye Viche',
    devanagari: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
    transliteration: 'Om Aim Hrim Klim Chamundaye Viche',
    meaning: 'Goddess of clarity and removing obstacles to wisdom',
    suggested_rounds: 108,
    emotions: ['CLARITY']
  },
  {
    slug: 'om-hanuman-namaha',
    sanskrit: 'Om Hanuman Namaha',
    devanagari: 'ॐ हनुमान् नमः',
    transliteration: 'Om Hanuman Namaha',
    meaning: 'Divine protection and strength',
    suggested_rounds: 108,
    emotions: ['PROTECTION']
  },
  {
    slug: 'om-gam-ganapataye-namaha',
    sanskrit: 'Om Gam Ganapataye Namaha',
    devanagari: 'ॐ गं गणपतये नमः',
    transliteration: 'Om Gam Ganapataye Namaha',
    meaning: 'Remover of obstacles; motivation and new beginnings',
    suggested_rounds: 108,
    emotions: ['MOTIVATION']
  },
  {
    slug: 'om-kali-namaha',
    sanskrit: 'Om Kali Namaha',
    devanagari: 'ॐ काली नमः',
    transliteration: 'Om Kali Namaha',
    meaning: 'Goddess of time and transformation; patience with process',
    suggested_rounds: 108,
    emotions: ['PATIENCE']
  },
  {
    slug: 'om-ram-ramaya-namaha',
    sanskrit: 'Om Ram Ramaya Namaha',
    devanagari: 'ॐ राम रामाय नमः',
    transliteration: 'Om Ram Ramaya Namaha',
    meaning: 'Divine renewal and fresh beginnings',
    suggested_rounds: 108,
    emotions: ['RENEWAL']
  },
  {
    slug: 'om-kamala-namaha',
    sanskrit: 'Om Kamala Namaha',
    devanagari: 'ॐ कमला नमः',
    transliteration: 'Om Kamala Namaha',
    meaning: 'Goddess of self-love and inner beauty',
    suggested_rounds: 108,
    emotions: ['SELF_LOVE']
  },
  {
    slug: 'om-gayatri-wisdom',
    sanskrit: 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yonaḥ Prachodayāt',
    devanagari: 'ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    transliteration: 'Om Bhur Bhuvah Svah Tat-savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yonah Prachodayat',
    meaning: 'Awakening inner wisdom and divine knowledge',
    suggested_rounds: 108,
    emotions: ['WISDOM']
  },
  {
    slug: 'om-dhanvantre-namaha',
    sanskrit: 'Om Dhanvantre Namaha',
    devanagari: 'ॐ धन्वन्तरे नमः',
    transliteration: 'Om Dhanvantre Namaha',
    meaning: 'Divine physician; healing and recovery',
    suggested_rounds: 108,
    emotions: ['HEALING']
  }
]
