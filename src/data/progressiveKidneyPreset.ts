import { ImageLessonScene } from "@/components/ImageLessonResults";

export const PRESET_PROGRESSIVE_KIDNEY_SCENES: ImageLessonScene[] = [
  {
    imageIndex: 0,
    stepNumber: 1,
    title: "1. أين تقع الكليتان؟ (الموقع والشكل العام)",
    imageUrl: "/scenes/progressive_kidney_1.jpg",
    imageName: "progressive_kidney_1.jpg",
    duration: "8 seconds",
    lessonExplanation: "أهلاً بكم يا أبطالي في رحلتنا العلمية الممتعة! بصوا معايا على الصورة دي: شايفين الكليتين الكيوت دول؟ هما مش موجودين في بطننا من قدام، دول محمين ورا في ظهرنا على جانبي العمود الفقري، وشبه حبة اللوبيا بالظبط، ومستعدين يبدأوا أعظم مهمة لتنظيف جسمنا!",
    motionPrompt: "Full-screen 16:9 3D Pixar animation. The camera slowly pushes in on the two adorable cute 3D kidneys standing happily on the glowing glass pedestal. Gentle ambient volumetric light beams shift softly across the futuristic laboratory. In the upper center background wall, a glowing 3D neon holographic sign clearly displays 'Sci.Rehab Elsibai' with steady illumination. The kidneys have subtle micro-expressions, cheerful blinking eyes, and rhythmic breathing motion. (The neon sign 'Sci.Rehab Elsibai' remains static. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    montageText: ["الموقع التشريحي للكليتين", "الناحية الظهرية للبطن", "شكل حبة اللوبيا"],
    continuityNote: "المشهد يمهد لوصول تيار الدم غير المصفى عبر الشريان الكلوي في المشهد التالي."
  },
  {
    imageIndex: 1,
    stepNumber: 2,
    title: "2. شريان الحياة (دخول الدم غير النقي عبر الشريان الكلوي)",
    imageUrl: "/scenes/progressive_kidney_2.jpg",
    imageName: "progressive_kidney_2.jpg",
    duration: "8 seconds",
    lessonExplanation: "بصوا على نفس الصورة.. شايفين إيه اللي زاد هنا؟ ده الشريان الكلوي الكبير اللي جاي من القلب! القلب بيضخ ربع دمه كله للكليتين في كل دقيقة! الدم هنا لونه أحمر محمل بالأكسجين، بس معاه فضلات ويوريا وأملاح لازم تدخل الكلية عشان تتصفى!",
    motionPrompt: "Full-screen 16:9 3D Pixar animation. Continuous fluid animation: bright red oxygenated blood actively rushes and pulses through the branching renal artery on the left side, with sparkling glowing golden waste particles actively streaming through the transparent vessel directly into both kidneys. In the upper center background wall, the glowing 3D neon sign 'Sci.Rehab Elsibai' remains steadily illuminated. The background lab and the cute kidney characters remain identical and steady with subtle joyful eye blinks. (The neon sign 'Sci.Rehab Elsibai' remains static. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    montageText: ["الشريان الكلوي", "دخول ربع دم القلب", "دم محمل باليوريا"],
    continuityNote: "الدم وصل داخل الكلية.. المشهد القادم يكشف عملية الغربلة الدقيقة بالداخل."
  },
  {
    imageIndex: 2,
    stepNumber: 3,
    title: "3. مصنع الغربلة والتصفية (ملايين النيفرونات داخل قشرة الكلية)",
    imageUrl: "/scenes/progressive_kidney_3.jpg",
    imageName: "progressive_kidney_3.jpg",
    duration: "9 seconds",
    lessonExplanation: "تعالوا ندخل جوة الكلية اللي على الشمال! شايفين القشرة فتحت إزاي؟ جوة كل كلية في حوالي مليون فلتر مجهري اسمهم (النيفرونات).. الفلاتر دي عاملة زي المصفاة الذكية بالظبط، بتحجز خلايا الدم الحمراء والبروتينات الكبيرة وترجعها للجسم، وتعدي بس اليوريا والسموم والمية الزيادة!",
    motionPrompt: "Full-screen 16:9 3D Pixar animation. Macro cinematic focus: inside the open cutaway section of the left kidney, microscopic nephron filtering units actively vibrate and glow. Golden waste droplets and tiny particles rapidly filter through the glowing sieve mesh, while healthy large red blood cells bounce and continue flowing smoothly through the circulatory channels. Highly fluid dynamic filtration motion. (The glowing neon sign 'Sci.Rehab Elsibai' in the upper background wall remains static and steady. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    montageText: ["محفظة بومان", "الفلترة المجهرية", "مليون نيفرون في كل كلية"],
    continuityNote: "بعد عزل الفضلات، المشهد التالي يوضح كيف تتجمع وتنزل في الحالب."
  },
  {
    imageIndex: 3,
    stepNumber: 4,
    title: "4. تجميع البول ونزوله للمثانة (الحالبان والمثانة البولية)",
    imageUrl: "/scenes/progressive_kidney_4.jpg",
    imageName: "progressive_kidney_4.jpg",
    duration: "8 seconds",
    lessonExplanation: "بصوا على التكملة اللي تحت في نفس الصورة! الفضلات السامة واليوريا اتجمعت في صورة قطرات بول صفراء، وبتنزل نقطة بنقطة عبر الأنبوبين الرفيعين دول اللي هما (الحالبان).. نازلين يملوا الكيس العضلي الكيوت ده اللي هو (المثانة البولية) عشان يخزن البول لحد ما يطرد برة الجسم خالص!",
    motionPrompt: "Full-screen 16:9 3D Pixar animation. Continuous downwards fluid dynamics: sparkling golden liquid droplets continuously travel downwards through the two flexible ureter tubes into the cute smiling bladder character in the foreground. The bladder gently stretches and pulses happily with a rosy-cheeked expression as it collects the golden fluid. The kidneys above maintain their identical visual anchor with the glowing neon sign 'Sci.Rehab Elsibai' in the background. (The neon sign 'Sci.Rehab Elsibai' remains static. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    montageText: ["الحالبان", "المثانة البولية", "تجميع سائل البول"],
    continuityNote: "المشهد الختامي يكشف الدورة المزدوجة الكاملة: دم نقي يرجع للقلب وبول يُطرد."
  },
  {
    imageIndex: 4,
    stepNumber: 5,
    title: "5. المسار المزدوج المكتمل (دم نقي للقلب وبول للمثانة)",
    imageUrl: "/scenes/progressive_kidney_5.jpg",
    imageName: "progressive_kidney_5.jpg",
    duration: "9 seconds",
    lessonExplanation: "وبكدا اكتملت المعجزة كلها في نفس الصورة قدامنا! شايفين المسارين؟ المسار الأزرق اللي فوق: ده الوريد الكلوي طالع بدم نقي 100% يرجع للقلب وكل عضلاتنا.. والمسار الأصفر اللي تحت: ده البول نزل للمثانة عشان يطرد برة خالص.. سبحان الخالق العظيم على هذه النعمة في أجسامنا!",
    motionPrompt: "Full-screen 16:9 3D Pixar animation. Complete dual-flow kinetic symphony: deep blue glowing renal vein carries 100% purified sparkling blood flowing rapidly upwards towards the heart, while golden urine droplets continue descending down into the smiling bladder. Both cute kidneys sparkle with celebratory glowing stars and warm ambient light. In the upper center background wall, the glowing neon sign 'Sci.Rehab Elsibai' shines brightly. Smooth slow cinematic camera pull-back showing the entire harmonious cycle. (The neon sign 'Sci.Rehab Elsibai' remains static. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    montageText: ["الوريد الكلوي", "أنقى دم في الجسم", "المسار المزدوج الكامل"],
    continuityNote: "نهاية دورة تنقية الدم بنجاح وبأعلى درجات الترابط البصري."
  }
];
