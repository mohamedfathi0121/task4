export interface Prayer {
  id: string;
  title: string;
  category: 'daily' | 'special' | 'supplication';
  shortDescription: string;
  content: string;
  arabic?: string;
  transliteration?: string;
  reference?: string;
  times?: string[];
}

export const prayers: Prayer[] = [
  {
    id: '1',
    title: 'Fajr Prayer',
    category: 'daily',
    shortDescription: "The dawn prayer consisting of 2 rak'ahs", // Fixed apostrophe
    content: `
      The Fajr prayer consists of 2 rak'ahs (units) of prayer.\n\n
      1. Begin with Takbir (Allahu Akbar)\n
      2. Recite Surah Al-Fatihah\n
      3. Recite another Surah (typically shorter ones like Al-Ikhlas)\n
      4. Perform Ruku (bowing)\n
      5. Stand up straight (Qiyam)\n
      6. Perform Sujud (prostration)\n
      7. Repeat for second rak'ah\n
      8. End with Tashahhud and Salam\n\n
      Recommended to recite longer portions of Quran during Fajr.
    `,
    arabic: 'صلاة الفجر',
    transliteration: 'Salat al-Fajr',
    reference: 'Quran 17:78',
    times: ['Before sunrise']
  },
  {
    id: '2',
    title: 'Dua After Prayer',
    category: 'supplication',
    shortDescription: 'Supplications to recite after completing prayers',
    content: `
      Recommended supplications after prayer:\n\n
      1. Astaghfirullah (3 times)\n
      2. Allahumma antas-salam... (O Allah, You are Peace...)\n
      3. Subhanallah (33 times)\n
      4. Alhamdulillah (33 times)\n
      5. Allahu Akbar (33 times)\n
      6. La ilaha illallah (once)\n\n
      These dhikr help maintain spiritual connection after prayer.
    `,
    arabic: 'أذكار بعد الصلاة',
    reference: 'Various hadith'
  },
  {
    id: '3',
    title: 'Tahajjud Prayer',
    category: 'special',
    shortDescription: 'Voluntary night prayer',
    content: `
      The Tahajjud prayer is a special night prayer:\n\n
      1. Perform after Isha and before Fajr\n
      2. Preferably in the last third of the night\n
      3. Minimum 2 rak'ahs, can be more\n
      4. Recite longer portions of Quran\n
      5. Make sincere dua afterwards\n\n
      "The best prayer after the obligatory prayers is the night prayer." (Muslim)
    `,
    arabic: 'صلاة التهجد',
    reference: 'Sahih Muslim 1163'
  },
];