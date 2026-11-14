import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLE_METADATA,
  validateClassLogin,
  purchaseStoreItem,
  calculateQuizReward,
  OWNER_TEACHER_45_FEATURES,
  canAccessOwnerTeacherPanel,
  generateVerificationCode,
} from './class8b-logic';

test('Owner and Teacher (Bu Aida) have identical full access to the 45-feature panel', () => {
  assert.equal(OWNER_TEACHER_45_FEATURES.length, 45);
  assert.equal(canAccessOwnerTeacherPanel('owner'), true);
  assert.equal(canAccessOwnerTeacherPanel('teacher'), true);
  assert.equal(canAccessOwnerTeacherPanel('ketua_kelas'), false);
  assert.equal(canAccessOwnerTeacherPanel('siswa'), false);
  assert.equal(ROLE_METADATA.owner.canAccess45Panel, true);
  assert.equal(ROLE_METADATA.teacher.canAccess45Panel, true);
});

test('All 9 specific class roles have accurate permissions', () => {
  assert.equal(ROLE_METADATA.ketua_kelas.canManageAnnouncements, true);
  assert.equal(ROLE_METADATA.wakil_ketua.canManageAttendance, true);
  assert.equal(ROLE_METADATA.bendahara_1.canManageTreasury, true);
  assert.equal(ROLE_METADATA.bendahara_2.canManageTreasury, true);
  assert.equal(ROLE_METADATA.sekretaris_1.canManageAttendance, true);
  assert.equal(ROLE_METADATA.sekretaris_2.canManageAssignments, true);
  assert.equal(ROLE_METADATA.siswa.canManageAttendance, false);
});

test('Strict role-isolated login: student OTP cannot log into Owner, Teacher (Bu Aida), or Officer roles', () => {
  // 1. Valid Student login with student password & student OTP
  const validStudent = validateClassLogin({
    username: 'rizky8b',
    password: 'kelas8b18',
    verificationCode: 'BUAIDA-8B-2026',
    role: 'siswa',
  });
  assert.equal(validStudent.valid, true);
  assert.equal(validStudent.issuer, 'Bu Aida (Wali Kelas 8B)');

  // 2. Student trying to log in as Owner with student code MUST BE REJECTED
  const spoofedOwnerAttempt = validateClassLogin({
    username: 'owner8b',
    password: 'kelas8b18',
    verificationCode: 'BUAIDA-8B-2026',
    role: 'owner',
  });
  assert.equal(spoofedOwnerAttempt.valid, false);

  // 3. Owner login without 6-digit PIN MUST BE REJECTED
  const ownerMissingPin = validateClassLogin({
    username: 'owner8b',
    password: 'owner18bogor',
    verificationCode: 'OWNER-MASTER-8B',
    role: 'owner',
    rolePin: '000000',
  });
  assert.equal(ownerMissingPin.valid, false);

  // 4. Valid Owner login with Master Password + Owner Master Code + 6-digit PIN
  const validOwner = validateClassLogin({
    username: 'owner8b',
    password: 'owner18bogor',
    verificationCode: 'OWNER-MASTER-8B',
    role: 'owner',
    rolePin: '180826',
  });
  assert.equal(validOwner.valid, true);

  // 5. Valid Teacher (Bu Aida) login with Teacher Password + Teacher Code + 6-digit PIN
  const validTeacher = validateClassLogin({
    username: 'buaida',
    password: 'buaida18bogor',
    verificationCode: 'GURU-BUAIDA-8B',
    role: 'teacher',
    rolePin: '180826',
  });
  assert.equal(validTeacher.valid, true);

  // 6. Officer login with wrong role mandate code (e.g. Sekretaris trying to use Ketua code) MUST BE REJECTED
  const crossOfficerAttempt = validateClassLogin({
    username: 'putri8b',
    password: 'pengurus8b18',
    verificationCode: 'KETUA-8B-18',
    role: 'sekretaris_1',
    rolePin: '8818',
  });
  assert.equal(crossOfficerAttempt.valid, false);

  // 7. Valid Officer login with matching Sekretaris mandate code + 4-digit PIN
  const validOfficer = validateClassLogin({
    username: 'putri8b',
    password: 'pengurus8b18',
    verificationCode: 'SEKRETARIS-8B-18',
    role: 'sekretaris_1',
    rolePin: '8818',
  });
  assert.equal(validOfficer.valid, true);

  // 8. Custom generated student OTP code works only for student role
  const customGenerated = generateVerificationCode('BUAIDA', 8899);
  assert.equal(customGenerated, 'BUAIDA-8B-8899');
  const validDynamicStudent = validateClassLogin({
    username: 'dika8b',
    password: 'kelas8b18',
    verificationCode: customGenerated,
    role: 'siswa',
    customCodes: [customGenerated],
  });
  assert.equal(validDynamicStudent.valid, true);
});

test('Quiz coin reward calculation includes streak bonus and double coin event multiplier', () => {
  assert.equal(calculateQuizReward(30, 0, false), 30);
  assert.equal(calculateQuizReward(30, 2, false), 40);
  assert.equal(calculateQuizReward(30, 2, true), 80);
});

test('Class Store purchase deducts coins accurately and prevents duplicate or underfunded purchases', () => {
  const initialUnlocked = ['banner_default', 'title_default'];
  const successRes = purchaseStoreItem({
    currentCoins: 200,
    unlockedItems: initialUnlocked,
    itemId: 'banner_royal_archon', // costs 150
  });
  assert.equal(successRes.success, true);
  assert.equal(successRes.newCoins, 50);
  assert.equal(successRes.newUnlocked.includes('banner_royal_archon'), true);

  const duplicateRes = purchaseStoreItem({
    currentCoins: 200,
    unlockedItems: successRes.newUnlocked,
    itemId: 'banner_royal_archon',
  });
  assert.equal(duplicateRes.success, false);

  const insufficientRes = purchaseStoreItem({
    currentCoins: 40,
    unlockedItems: initialUnlocked,
    itemId: 'banner_bogor_emerald', // costs 180
  });
  assert.equal(insufficientRes.success, false);
  assert.equal(insufficientRes.newCoins, 40);
});

import {
  calculatePomodoroCoinReward,
  formatCountdownTimer,
  generateSuratIzinText,
  validateReviewInput,
  buildCsvContent,
  JADWAL_PELAJARAN_8B,
  SCHOOLBAG_ITEMS_BY_DAY,
  calculateScienceMathFormula,
  searchSundaDictionary,
  generateVisitorPassCard,
  generateBalancedStudyGroups,
  calculateTargetRaporScore,
  DAILY_CLASS_QUESTS_8B,
} from './class8b-logic';

test('Pomodoro timer reward calculation & countdown formatting work accurately', () => {
  assert.equal(calculatePomodoroCoinReward(25, false), 25);
  assert.equal(calculatePomodoroCoinReward(25, true), 50);
  assert.equal(calculatePomodoroCoinReward(15, false), 15);
  assert.equal(calculatePomodoroCoinReward(5, false), 10);
  assert.equal(formatCountdownTimer(1500), '25:00');
  assert.equal(formatCountdownTimer(65), '01:05');
});

test('Surat Izin Digital formats official SMPN 18 Kelas 8B letter to Bu Aida', () => {
  const letter = generateSuratIzinText({
    studentName: 'Naufal Pratama',
    dateLabel: '14 Nov 2026',
    reasonType: 'Sakit',
    detailReason: 'Demam tinggi sesuai surat dokter',
    parentName: 'Ibu Sari',
  });
  assert.equal(letter.includes('Ibu Aida, S.Pd.'), true);
  assert.equal(letter.includes('Naufal Pratama'), true);
  assert.equal(letter.includes('VIII-B (8B)'), true);
  assert.equal(letter.includes('SMP Negeri 18 Kota Bogor'), true);
});

test('Visitor review moderation filter & CSV export helper behave strictly', () => {
  const cleanRes = validateReviewInput({
    visitorName: 'Ibu Rina',
    message: 'Portal Kelas 8B sangat bermanfaat!',
    filterEnabled: true,
  });
  assert.equal(cleanRes.valid, true);

  const blockedRes = validateReviewInput({
    visitorName: 'Tamu',
    message: 'Ini komentar anjing tidak sopan',
    filterEnabled: true,
  });
  assert.equal(blockedRes.valid, false);

  const csv = buildCsvContent(['Nama', 'Status'], [['Dika 8B', 'hadir']]);
  assert.equal(csv, '"Nama","Status"\n"Dika 8B","hadir"');
});

test('Official Senin-Jumat schedule matches Kelas 8B SMPN 18 subjects exactly', () => {
  const senin = JADWAL_PELAJARAN_8B.find((d) => d.day === 'Senin')!;
  assert.equal(senin.slots.length, 4);
  assert.equal(senin.slots[0].subject.startsWith('PKN'), true);
  assert.equal(senin.slots[1].subject.startsWith('MTK'), true);
  assert.equal(senin.slots[2].subject.startsWith('IPA'), true);
  assert.equal(senin.slots[3].subject.startsWith('Sunda'), true);

  const selasa = JADWAL_PELAJARAN_8B.find((d) => d.day === 'Selasa')!;
  assert.equal(selasa.slots.length, 4);
  assert.equal(selasa.slots[0].subject.startsWith('MTK'), true);
  assert.equal(selasa.slots[1].subject.startsWith('IPA'), true);
  assert.equal(selasa.slots[2].subject.startsWith('BK'), true);
  assert.equal(selasa.slots[3].subject.startsWith('PAI'), true);

  const rabu = JADWAL_PELAJARAN_8B.find((d) => d.day === 'Rabu')!;
  assert.equal(rabu.slots.length, 3);
  assert.equal(rabu.slots[0].subject.startsWith('PJOK'), true);
  assert.equal(rabu.slots[1].subject.startsWith('SBK'), true);
  assert.equal(rabu.slots[2].subject.startsWith('B. Inggris'), true);

  const kamis = JADWAL_PELAJARAN_8B.find((d) => d.day === 'Kamis')!;
  assert.equal(kamis.slots.length, 2);
  assert.equal(kamis.slots[0].subject.startsWith('B. Indo'), true);
  assert.equal(kamis.slots[1].subject.startsWith('IPS'), true);

  const jumat = JADWAL_PELAJARAN_8B.find((d) => d.day === 'Jumat')!;
  assert.equal(jumat.slots.length, 2);
  assert.equal(jumat.slots[0].subject.startsWith('Informatika'), true);
  assert.equal(jumat.slots[1].subject.startsWith('B. Indo'), true);
});

test('6 Visitor features & 3 Classmate 8B features pure helpers work accurately', () => {
  // Schoolbag checklist
  assert.equal(SCHOOLBAG_ITEMS_BY_DAY.Senin.length >= 4, true);

  // Formula calculator (Pythagoras 6, 8 -> 10 cm)
  const pyth = calculateScienceMathFormula({ mode: 'pythagoras', a: 6, b: 8 });
  assert.equal(pyth.resultText, '10 cm');

  // Sunda dictionary search
  const sundaHits = searchSundaDictionary('wilujeng');
  assert.equal(sundaHits.length, 1);
  assert.equal(sundaHits[0].indonesia, 'Selamat pagi');

  // Visitor Pass Card
  const pass = generateVisitorPassCard({
    visitorName: 'Bapak Ahmad',
    visitorRole: 'Orang Tua Siswa',
    purpose: 'Melihat Jadwal & Karya 8B',
  });
  assert.equal(pass.passCode.startsWith('VST-8B-'), true);

  // Study Group Generator
  const groups = generateBalancedStudyGroups({
    namesInput: ['Rizky', 'Siti', 'Naufal', 'Alya', 'Dika', 'Putri'],
    groupCount: 2,
    subjectLabel: 'IPA Terpadu',
  });
  assert.equal(groups.length, 2);
  assert.equal(groups[0].members.length, 3);
  assert.equal(groups[1].members.length, 3);

  // Target Rapor Calculator
  const rapor = calculateTargetRaporScore({
    tugasAvg: 92,
    uhAvg: 90,
    ptsScore: 88,
    pasTarget: 92,
  });
  assert.equal(rapor.predicate, 'A (Sangat Baik)');
  assert.equal(DAILY_CLASS_QUESTS_8B.length, 5);
});

import {
  KAGE_8B_TYPOGRAPHY,
  KAGE_8B_PATHWAYS,
  KAGE_8B_FOREGROUND_LAYERS,
  getKagePathwayById,
  computeKageLayerParallaxOffset,
} from './class8b-logic';

test('Kage 8B Secret Pathways configuration matches Onest typography, #e0231c primary color, 4 realms, and 10 foreground layers', () => {
  assert.equal(KAGE_8B_TYPOGRAPHY.headingFont, 'Onest');
  assert.equal(KAGE_8B_TYPOGRAPHY.bodyFont, 'Onest');
  assert.equal(KAGE_8B_TYPOGRAPHY.headingWeight, '400');
  assert.equal(KAGE_8B_TYPOGRAPHY.bodyWeight, '300');
  assert.equal(KAGE_8B_TYPOGRAPHY.primaryColor, '#e0231c');
  assert.equal(KAGE_8B_TYPOGRAPHY.headingSize, 46);
  assert.equal(KAGE_8B_TYPOGRAPHY.bodySize, 17);
  assert.equal(KAGE_8B_TYPOGRAPHY.headingLetterSpacing, -0.012);

  assert.equal(KAGE_8B_PATHWAYS.length, 4);
  assert.equal(KAGE_8B_FOREGROUND_LAYERS.length, 10);

  const lanternRealm = getKagePathwayById('lantern-court');
  assert.equal(lanternRealm.chapterCode, '03');
  assert.equal(lanternRealm.linkedDay, 'Rabu');

  const fallbackRealm = getKagePathwayById('non-existent');
  assert.equal(fallbackRealm.id, 'sanmon');

  const offsetNear = computeKageLayerParallaxOffset({
    pointerX: 0.5,
    pointerY: -0.5,
    scrollProgress: 0.25,
    depthFactor: 1.0,
  });
  const offsetFar = computeKageLayerParallaxOffset({
    pointerX: 0.5,
    pointerY: -0.5,
    scrollProgress: 0.25,
    depthFactor: 0.15,
  });
  assert.equal(Math.abs(offsetNear.x) > Math.abs(offsetFar.x), true);
  assert.equal(offsetNear.scale > offsetFar.scale, true);
});

import {
  EDU_SUBJECT_MODULES,
  getEduSubjectById,
  calculateEduChatReward,
  buildEduSystemInstruction,
  buildEduTutorFallbackAnswer,
  buildEduSearchSources,
  buildEduFollowUpSuggestions,
} from './class8b-logic';

test('AI Chatbot Edukasi Kelas 8B covers all 12 individual curriculum subjects, search grounding sources, and fast tutor helpers', () => {
  const requiredSubjects = [
    'pkn',
    'mtk',
    'ipa',
    'sunda',
    'pai',
    'bk',
    'pjok',
    'sbk',
    'binggris',
    'bindo',
    'ips',
    'informatika',
  ] as const;

  for (const subj of requiredSubjects) {
    const found = EDU_SUBJECT_MODULES.find((m) => m.id === subj);
    assert.equal(Boolean(found), true, `Missing subject module: ${subj}`);
    assert.equal((found?.referenceSources.length ?? 0) >= 1, true);
  }

  const mtkMod = getEduSubjectById('mtk');
  assert.equal(mtkMod.scheduleDays, 'Senin & Selasa');

  const rewardNormal = calculateEduChatReward({
    questionLength: 25,
    studyMode: 'rumus_langkah',
    doubleCoinActive: false,
  });
  assert.equal(rewardNormal, 15);

  const rewardDouble = calculateEduChatReward({
    questionLength: 25,
    studyMode: 'latihan_soal',
    doubleCoinActive: true,
  });
  assert.equal(rewardDouble, 40);

  const sysPrompt = buildEduSystemInstruction({
    subjectId: 'ipa',
    studyMode: 'konsep',
    studentName: 'Rizky 8B',
    studentRoleLabel: 'Anggota Kelas 8B',
  });
  assert.equal(sysPrompt.includes('SMP Negeri 18 Kota Bogor'), true);
  assert.equal(sysPrompt.includes('IPA Terpadu'), true);

  const pythagorasReply = buildEduTutorFallbackAnswer({
    question: 'Bagaimana rumus teorema pythagoras mencari sisi miring?',
    subjectId: 'mtk',
    studyMode: 'rumus_langkah',
    studentName: 'Rizky 8B',
  });
  assert.equal(pythagorasReply.includes('Teorema Pythagoras'), true);
  assert.equal(pythagorasReply.includes('c² = a² + b²'), true);

  const searchMeta = buildEduSearchSources({
    subjectId: 'pai',
    question: 'Hukum bacaan Qalqalah Sugra dan Kubra',
  });
  assert.equal(searchMeta.sources.length >= 1, true);
  assert.equal(searchMeta.searchQueries.length, 2);

  const followUps = buildEduFollowUpSuggestions('informatika');
  assert.equal(followUps.length, 3);
});





