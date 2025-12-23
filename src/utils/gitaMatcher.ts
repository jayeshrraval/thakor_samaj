import { gitaData } from '../data/gitaData';

// ============================================================================
// 🌟 THE ULTIMATE GITA DICTIONARY (1000+ SCENARIOS)
// ============================================================================
// આ મેપિંગ ગુજરાતી/Roman/Slang શબ્દોને ગીતાના મુખ્ય અંગ્રેજી કીવર્ડ્સ સાથે જોડે છે.

const topicMappings: Record<string, string[]> = {
  
  // ------------------------------------------------------------------
  // 😡 ૧. ગુસ્સો, દુશ્મનાવટ અને ઝઘડા (Anger & Conflict)
  // ------------------------------------------------------------------
  "gusso": ["anger", "krodh", "hell", "destruction"],
  "gussa": ["anger", "krodh"],
  "khij": ["anger", "irritation", "mind"],
  "magaj": ["anger", "mind", "control"],
  "lohi ukale": ["anger", "passion"],
  "badlo": ["revenge", "anger", "enemy"],
  "dushman": ["enemy", "hate", "samabhav", "equality"],
  "virodhi": ["enemy", "hate"],
  "ladai": ["fight", "conflict", "arjuna", "war"],
  "jhagdo": ["conflict", "peace"],
  "maramari": ["violence", "anger"],
  "apman": ["insult", "honor", "equanimity"],
  "insult": ["honor", "equanimity", "pride"],
  "ninda": ["criticism", "equanimity"],
  "hate": ["hatred", "love", "unity"],
  "nafrat": ["hatred", "enemy"],
  "irritate": ["anger", "tolerance"],
  "sahanshakti": ["tolerance", "patience"],
  "sahan": ["tolerance", "endurance"],

  // ------------------------------------------------------------------
  // 😰 ૨. ડર, ચિંતા અને ભવિષ્ય (Fear & Anxiety)
  // ------------------------------------------------------------------
  "dar": ["fear", "death", "protection", "abhayam"],
  "bik": ["fear", "protection"],
  "bhay": ["fear", "courage"],
  "chinta": ["worry", "anxiety", "surrender", "grief"],
  "tension": ["anxiety", "stress", "peace"],
  "stress": ["anxiety", "meditation", "peace"],
  "gabhrat": ["panic", "fear", "weakness"],
  "fafdhat": ["fear", "trembling"],
  "future": ["future", "present", "result"],
  "bhavishya": ["future", "destiny"],
  "su thase": ["worry", "future", "surrender"],
  "risk": ["fear", "action"],
  "insecure": ["protection", "faith"],
  "asuraksha": ["protection", "god"],
  "overthinking": ["mind", "control", "meditation"],
  "vicharo": ["thoughts", "mind"],

  // ------------------------------------------------------------------
  // 😔 ૩. દુઃખ, હતાશા અને ડિપ્રેશન (Sadness & Depression)
  // ------------------------------------------------------------------
  "dukh": ["sorrow", "grief", "suffering", "misery"],
  "pida": ["pain", "suffering"],
  "dard": ["pain", "body", "soul"],
  "radvu": ["cry", "grief", "weakness"],
  "rovu": ["cry", "grief"],
  "ansoo": ["grief", "emotion"],
  "udas": ["sadness", "depression", "despondency"],
  "nirasha": ["despair", "hope"],
  "hatasha": ["despair", "depression"],
  "mood": ["mind", "happiness", "grief"],
  "lonely": ["solitude", "yoga", "friend"],
  "eklu": ["solitude", "god", "companion"],
  "eklata": ["solitude", "devotion"],
  "suicide": ["soul", "death", "eternal", "body"],
  "marvu": ["death", "soul", "kill"],
  "jindgi": ["life", "duty", "purpose"],
  "kantalo": ["boredom", "duty", "tamasic"],

  // ------------------------------------------------------------------
  // ❤️ ૪. પ્રેમ, બ્રેકઅપ અને સંબંધો (Relationships & Heartbreak)
  // ------------------------------------------------------------------
  "dil tuti": ["endurance", "winter", "summer", "temporary"],
  "dil": ["heart", "emotion"],
  "breakup": ["grief", "endurance", "attachment"],
  "dhokho": ["betrayal", "trust", "karma"],
  "viswasghat": ["betrayal", "trust"],
  "prem": ["love", "devotion", "lust", "affection"],
  "love": ["devotion", "lust", "love"],
  "pyar": ["love", "devotion"],
  "lagna": ["marriage", "lust", "duty"],
  "marriage": ["duty", "family"],
  "partner": ["friend", "relationship"],
  "pati": ["duty", "husband"],
  "patni": ["duty", "wife"],
  "sex": ["lust", "desire", "hell"],
  "vasana": ["lust", "desire", "enemy"],
  "kaam": ["lust", "desire"],
  "attraction": ["lust", "delusion"],
  "akarshan": ["lust", "maya"],
  "moh": ["delusion", "attachment", "illusion"],
  "asakti": ["attachment", "bondage"],
  "sambandh": ["relationship", "detached"],

  // ------------------------------------------------------------------
  // 💰 ૫. પૈસા, કરિયર અને લોભ (Money, Career & Greed)
  // ------------------------------------------------------------------
  "paisa": ["money", "greed", "wealth", "arth"],
  "money": ["wealth", "greed"],
  "rupiya": ["money", "wealth"],
  "dhan": ["wealth", "charity"],
  "sampatti": ["wealth", "possession"],
  "lalach": ["greed", "hell", "desire"],
  "lobh": ["greed", "enemy"],
  "garib": ["poverty", "contentment"],
  "amir": ["rich", "pride", "charity"],
  "loan": ["debt", "worry"],
  "karaj": ["debt", "worry"],
  "dhandho": ["business", "work", "profit"],
  "business": ["work", "trade"],
  "job": ["job", "work", "duty", "service"],
  "naukri": ["service", "duty"],
  "interview": ["fear", "action", "result"],
  "office": ["work", "environment"],
  "boss": ["leader", "respect"],
  "target": ["goal", "action"],
  "success": ["success", "failure", "equanimity"],
  "safalta": ["success", "karma"],

  // ------------------------------------------------------------------
  // 📉 ૬. નિષ્ફળતા અને હાર (Failure & Defeat)
  // ------------------------------------------------------------------
  "fail": ["failure", "success", "equanimity"],
  "napas": ["failure", "learning"],
  "nishfal": ["failure", "effort"],
  "haar": ["defeat", "victory", "equanimity"],
  "parajay": ["defeat", "victory"],
  "loser": ["weakness", "strength"],
  "nuksan": ["loss", "gain"],
  "khot": ["loss", "business"],
  "barbad": ["ruin", "hope"],
  "payaamal": ["destruction", "rise"],
  "bhul": ["mistake", "forgiveness"],
  "galti": ["sin", "correction"],

  // ------------------------------------------------------------------
  // 🤔 ૭. મૂંઝવણ અને નિર્ણય (Confusion & Decision)
  // ------------------------------------------------------------------
  "confuse": ["confusion", "doubt", "delusion"],
  "munjvan": ["dilemma", "guidance"],
  "su karu": ["decision", "action", "duty", "surrender"],
  "shu karu": ["decision", "guidance"],
  "rasto": ["path", "guidance", "guru"],
  "marg": ["path", "knowledge"],
  "decision": ["intellect", "buddhi"],
  "nirnay": ["intellect", "resolve"],
  "doubt": ["doubt", "faith", "knowledge"],
  "shanka": ["doubt", "trust"],
  "result": ["fruit", "karma", "action"],
  "fal": ["fruit", "expectation"],
  "naseeb": ["destiny", "karma"],
  "kismat": ["destiny", "effort"],
  "luck": ["destiny", "effort"],

  // ------------------------------------------------------------------
  // 🧘 ૮. આધ્યાત્મિક અને ધર્મ (Spirituality & Religion)
  // ------------------------------------------------------------------
  "bhagwan": ["god", "krishna", "supreme"],
  "god": ["ishwar", "paramatma"],
  "krishna": ["krishna", "friend", "guide"],
  "atma": ["soul", "eternal", "body"],
  "soul": ["self", "imperishable"],
  "mrutyu": ["death", "rebirth", "truth"],
  "death": ["end", "change"],
  "swarg": ["heaven", "temporary"],
  "narak": ["hell", "sin"],
  "pap": ["sin", "ignorance"],
  "punya": ["merit", "virtue"],
  "dharma": ["duty", "righteousness"],
  "adharm": ["unrighteousness", "evil"],
  "bhakti": ["devotion", "love", "surrender"],
  "puja": ["worship", "offering"],
  "dhyan": ["meditation", "focus"],
  "meditation": ["peace", "mind"],
  "yoga": ["union", "discipline"],
  "shanti": ["peace", "satisfaction"],
  "moksh": ["liberation", "freedom"],
  "guru": ["teacher", "knowledge"],
  "gyan": ["knowledge", "wisdom"],

  // ------------------------------------------------------------------
  // 🛌 ૯. આળસ, ઊંઘ અને ખોરાક (Lifestyle & Health)
  // ------------------------------------------------------------------
  "alas": ["laziness", "tamasic", "action"],
  "lazy": ["laziness", "procrastination"],
  "ungh": ["sleep", "tamasic"],
  "sleep": ["rest", "tamasic"],
  "thak": ["tiredness", "body"],
  "bored": ["boredom", "interest"],
  "khavanu": ["food", "diet", "sattvic"],
  "food": ["food", "body"],
  "bukh": ["hunger", "control"],
  "diet": ["moderation", "yukta"],
  "health": ["body", "temple"],
  "sharir": ["body", "field"],
  "bimari": ["disease", "suffering", "body"],
  "rog": ["disease", "pain"],
  "daru": ["alcohol", "tamasic", "sin"],
  "vyasan": ["addiction", "control"],
  "mobile": ["distraction", "mind"],
  "addiction": ["attachment", "senses"],

  // ------------------------------------------------------------------
  // 🧠 ૧૦. મન, અહંકાર અને ગુણો (Mind, Ego & Virtues)
  // ------------------------------------------------------------------
  "man": ["mind", "friend", "enemy"],
  "mind": ["restless", "control"],
  "bhatke": ["wandering", "focus"],
  "focus": ["concentration", "practice"],
  "ahankar": ["ego", "pride", "doer"],
  "ego": ["identity", "ignorance"],
  "abhiman": ["pride", "fall"],
  "ghamand": ["arrogance", "demonic"],
  "irsha": ["jealousy", "envy"],
  "adekhai": ["envy", "contentment"],
  "saty": ["truth", "speech"],
  "juth": ["lie", "sin"],
  "daya": ["compassion", "virtue"],
  "daan": ["charity", "gift"],
  "tapasya": ["austerity", "discipline"],
  "pavitra": ["purity", "cleanliness"]
};


// ============================================================================
// 🔍 THE SEARCH ENGINE (ALGORITHM)
// ============================================================================

export const findBestShlokas = (userInput: string) => {
  const searchText = userInput.toLowerCase();
  
  // ૧. યુઝરના વાક્યને શબ્દોમાં તોડો (Tokenize)
  // માત્ર ૩ અક્ષરથી મોટા શબ્દો લો, જેથી 'is', 'to', 'ne' જેવા શબ્દો નીકળી જાય
  const userWords = searchText.split(" ").filter(w => w.length > 1); 

  // ૨. યુઝરના શબ્દોને ગીતાના કીવર્ડ્સમાં ફેરવો (Mapping)
  let searchTerms: string[] = [...userWords];
  
  userWords.forEach(word => {
    // Exact Match & Partial Match check
    Object.keys(topicMappings).forEach(key => {
      // જો યુઝરનો શબ્દ આપણા લિસ્ટમાં હોય (દા.ત. "paisa" લખે તો "money", "greed" ઉમેરો)
      if (word.includes(key) || key.includes(word)) { 
        searchTerms = [...searchTerms, ...topicMappings[key]];
      }
    });
  });

  // ૩. ડુપ્લિકેટ શબ્દો કાઢી નાખો (Unique)
  searchTerms = [...new Set(searchTerms)];

  console.log("User Input:", userInput);
  console.log("Search Keywords Generated:", searchTerms); 

  // ૪. ૭૦૦ શ્લોકને સ્કોર આપો (Scoring Logic)
  const scoredShlokas = gitaData.map((item) => {
    let score = 0;
    
    // આખા શ્લોકના ડેટાને એક સ્ટ્રિંગમાં લો (Searchable Content)
    const content = `
      ${item.keywords.join(" ")} 
      ${item.explanation} 
      ${item.gujarati_meaning} 
      ${item.sanskrit}
    `.toLowerCase();

    searchTerms.forEach(term => {
      if (content.includes(term)) {
        // --- Weightage Logic (મહત્વ) ---
        
        // ૧. જો કીવર્ડ સીધો મેચ થાય (Direct Keyword Match) - 15 Points
        if (item.keywords.some(k => k === term)) {
          score += 15; 
        } 
        // ૨. જો કીવર્ડનો ભાગ મેચ થાય (Partial Keyword) - 10 Points
        else if (item.keywords.some(k => k.includes(term))) {
          score += 10; 
        } 
        // ૩. જો સમજૂતીમાં શબ્દ હોય (Explanation) - 5 Points
        else if (item.explanation.toLowerCase().includes(term)) {
          score += 5;  
        } 
        // ૪. જો અર્થમાં શબ્દ હોય (Meaning) - 3 Points
        else if (item.gujarati_meaning.toLowerCase().includes(term)) {
          score += 3;  
        }
        // ૫. સંસ્કૃતમાં શબ્દ હોય (Sanskrit) - 1 Point
        else {
          score += 1;
        }
      }
    });

    return { ...item, score };
  });

  // ૫. જેના માર્ક્સ ૦ થી ઉપર હોય તેને અલગ કરો અને સોર્ટ કરો (High to Low)
  const results = scoredShlokas
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score); 

  // ૬. ટોપ ૩ રિઝલ્ટ પાછા આપો
  return results.slice(0, 3);
};