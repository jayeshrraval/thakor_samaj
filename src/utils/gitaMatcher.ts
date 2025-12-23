import { gitaData } from '../data/gitaData'; // તારી 700 શ્લોક વાળી ફાઈલ ઈમ્પોર્ટ કર

// આ મેપિંગ એટલા માટે કે યુઝર Roman માં લખે તો પણ આપણે સમજી શકીએ
const topicMappings: Record<string, string[]> = {
  // Anger & Negativity
  "gusso": ["anger", "krodh", "rage"],
  "gussa": ["anger", "krodh"],
  "magaj": ["mind", "anger", "control"],
  "lohi": ["anger", "blood"],
  "khij": ["anger", "irritation"],
  "dushman": ["enemy", "hate"],
  
  // Depression & Sadness
  "mood": ["mind", "happiness", "depression"],
  "radvu": ["grief", "cry", "sadness"],
  "dukh": ["sorrow", "grief", "pain"],
  "udas": ["sadness", "depression"],
  "tension": ["anxiety", "fear", "worry"],
  "chinta": ["worry", "anxiety"],
  "dar": ["fear", "death"],
  "bik": ["fear"],
  "suicide": ["death", "depression", "soul"],
  "marvu": ["death", "soul"],

  // Confusion & Career
  "job": ["work", "karma", "duty"],
  "dhandho": ["business", "work", "money"],
  "paisa": ["money", "greed", "wealth"],
  "money": ["wealth", "greed"],
  "su karu": ["confusion", "decision", "karma"],
  "confusion": ["doubt", "delusion"],
  "result": ["fruit", "karma", "success"],
  "fail": ["failure", "success"],
  
  // Relationships
  "prem": ["love", "devotion"],
  "love": ["devotion", "lust", "love"],
  "lagna": ["marriage", "lust", "attachment"],
  "sex": ["lust", "desire"],
  "sambandh": ["attachment", "relationship"],
  "family": ["attachment", "duty"],

  // Lifestyle
  "ungh": ["sleep", "lazy"],
  "khavanu": ["food", "diet"],
  "food": ["diet", "sattvic"],
  "health": ["body", "yoga"],
  "alas": ["laziness", "tamasic"]
};

// --- મેઈન સર્ચ ફંક્શન ---
export const findBestShlokas = (userInput: string) => {
  const searchText = userInput.toLowerCase();
  
  // ૧. યુઝરના વાક્યને શબ્દોમાં તોડો (Tokenize)
  const userWords = searchText.split(" ").filter(w => w.length > 2); // નાના શબ્દો કાઢી નાખો (is, the, to)

  // ૨. Roman Gujarati ને English Keywords માં ફેરવો
  let searchTerms: string[] = [...userWords];
  
  userWords.forEach(word => {
    // જો યુઝર 'gusso' લખે, તો આપણે 'anger', 'krodh' પણ સર્ચ લિસ્ટમાં ઉમેરીએ
    Object.keys(topicMappings).forEach(key => {
      if (word.includes(key)) {
        searchTerms = [...searchTerms, ...topicMappings[key]];
      }
    });
  });

  // ડુપ્લિકેટ શબ્દો કાઢી નાખો
  searchTerms = [...new Set(searchTerms)];

  console.log("Searching for:", searchTerms); // ટેસ્ટિંગ માટે

  // ૩. ૭૦૦ શ્લોકને સ્કોર આપો (Scoring Algorithm)
  const scoredShlokas = gitaData.map((item) => {
    let score = 0;
    const content = `
      ${item.keywords.join(" ")} 
      ${item.explanation} 
      ${item.gujarati_meaning} 
      ${item.sanskrit}
    `.toLowerCase();

    searchTerms.forEach(term => {
      if (content.includes(term)) {
        // સ્કોરિંગ લોજિક
        if (item.keywords.some(k => k.includes(term))) {
          score += 10; // કીવર્ડ મેચ થાય તો ૧૦ માર્ક્સ (સૌથી મહત્વનું)
        } else if (item.explanation.toLowerCase().includes(term)) {
          score += 5;  // સમજૂતીમાં હોય તો ૫ માર્ક્સ
        } else if (item.gujarati_meaning.toLowerCase().includes(term)) {
          score += 3;  // અર્થમાં હોય તો ૩ માર્ક્સ
        } else {
          score += 1;  // બીજે ક્યાંક હોય તો ૧ માર્ક
        }
      }
    });

    return { ...item, score };
  });

  // ૪. જેના માર્ક્સ ૦ થી ઉપર હોય તેને અલગ કરો અને સોર્ટ કરો
  const results = scoredShlokas
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score); // જેના માર્ક્સ વધારે તે પહેલા

  // ૫. ટોપ ૩ રિઝલ્ટ પાછા આપો
  return results.slice(0, 3);
};