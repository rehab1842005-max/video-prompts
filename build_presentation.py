import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Paths
base_dir = r"C:\Users\rehab\Videos\PDF → Video Prompts"
app_dir = os.path.join(base_dir, "app")
public_scenes_dir = os.path.join(app_dir, "public", "scenes")
os.makedirs(public_scenes_dir, exist_ok=True)

brain_dir = r"C:\Users\rehab\.gemini\antigravity\brain\ed6305e4-6412-4de0-a798-f7fe2f5927e0"

image_files = [
    os.path.join(brain_dir, "scene1_overview_1792165922480.jpg"),
    os.path.join(brain_dir, "scene2_artery_1792165954442.jpg"),
    os.path.join(brain_dir, "scene3_nephron_1792165978611.jpg"),
    os.path.join(brain_dir, "scene4_ureter_1792166005003.jpg"),
]

# Copy images to public/scenes
dest_images = []
for i, img_path in enumerate(image_files, 1):
    dest_path = os.path.join(public_scenes_dir, f"scene_{i}.jpg")
    if os.path.exists(img_path):
        shutil.copy2(img_path, dest_path)
        dest_images.append(dest_path)
    else:
        dest_images.append(None)

# 1. إنشاء العرض وضبط أبعاد الشاشة العريضة (16:9)
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

DARK_BLUE = RGBColor(24, 43, 73)
ACCENT_RED = RGBColor(220, 53, 69)
BG_LIGHT = RGBColor(245, 248, 255)
WHITE = RGBColor(255, 255, 255)
BORDER_GRAY = RGBColor(203, 213, 225)

slides_data = [
    {
        "title": "رحلة داخل مصنع النظافة في جسم الإنسان",
        "badge": "المشهد الأول: الافتتاح",
        "points": [
            "🔴 كيف يحافظ جسم الإنسان على صحته ونشاطه المستمر؟",
            "🔴 الدم هو الناقل الأساسي: يحمل الغذاء والأكسجين لكل خلية.",
            "🔴 عندما تبذل العضلات جهداً، تتكون فضلات يجب التخلص منها فوراً."
        ],
        "script": "أهلاً بكم في رحلة جديدة ومثيرة داخل جسم الإنسان.. هل فكرتم يوماً كيف يظل جسمنا نظيفاً وقوياً طوال الوقت؟ في كل ثانية، يضخ القلب الدم ليوزع الغذاء والطاقة.. لكن أثناء هذه الحركة، تتجمع فضلات ومواد زائدة عن حاجة الجسم، وهنا تبدأ مهمة أهم أجهزة التنقية الحيوية.",
        "image": dest_images[0] if len(dest_images) > 0 else None,
        "placeholder_text": "فيديو 3D: جسم إنسان شفاف يظهر مسارات الدم بنمط بيكسار كرتوني"
    },
    {
        "title": "الدم المحمل بالفضلات: بداية محطة الخطر",
        "badge": "المشهد الثاني: الشريان الكلوي",
        "points": [
            "⚠️ الدم غير النقي: دم يحمل فضلات نيتروجينية ناتجة عن احتراق الغذاء.",
            "⚠️ أهم هذه الفضلات: مادة اليوريا وحمض البوليك.",
            "➡️ يتجه هذا الدم مباشرة إلى الكليتين عبر الشريان الكلوي."
        ],
        "script": "[كليك 1]: هذا هو الدم غير النقي.. يبدو لونه داكناً ومحملاً بفضلات احتراق الطعام، وتحديداً اليوريا وحمض البوليك. [كليك 2]: بقاء هذه الفضلات يشكل خطراً، لذا يتحرك هذا المسار الدموي مباشرة نحو محطة الفرز الكبرى: الكليتان.",
        "image": dest_images[1] if len(dest_images) > 1 else None,
        "placeholder_text": "فيديو 3D: تيار دم داكن تسبح فيه بلورات اليوريا متجهاً نحو الكلية"
    },
    {
        "title": "الكليتان: عبقرية الترشيح والفرز المجهري",
        "badge": "المشهد الثالث: النفرونات",
        "points": [
            "🔬 تحتوي كل كلية على حوالي مليون مصفاة مجهرية تسمى (النفرونات).",
            "⚡ تقوم النفرونات بفصل تام بين المواد المفيدة والفضلات الضارة.",
            "🔄 لا تسمح بمرور خلايا الدم أو البروتينات الكبيرة إلى الفضلات."
        ],
        "script": "[كليك 1]: بمجرد وصول الدم، يدخل في شبكة مجهرية عبقرية تسمى النفرونات.. كل كلية تمتلك حوالي مليون وحدة ترشيح. [كليك 2]: هنا يحدث السحر البيولوجي، يتم احتجاز الفضلات والماء الزائد بدقة متناهية، مع الحفاظ على كل العناصر الثمينة للجسم.",
        "image": dest_images[2] if len(dest_images) > 2 else None,
        "placeholder_text": "فيديو 3D: تكبير ثلاثي الأبعاد لشبكة أنابيب النفرون وهي تفصل السائل النقي عن الفضلات"
    },
    {
        "title": "المسار المزدوج: النقي يعود والفضلات تنحدر",
        "badge": "المشهد الرابع: الحالب والمثانة",
        "points": [
            "✨ الدم النقي: يعود نظيفاً بالكامل إلى الدورة الدموية عبر الوريد الكلوي.",
            "💧 البول (الفضلات والماء الزائد): ينحدر عبر أنبوبين دقيقين يسميان (الحالبين).",
            "🎈 المثانة البولية: كيس عضلي مرن يتجمع فيه البول لحين التخلص منه خارج الجسم."
        ],
        "script": "[كليك 1]: النتيجة هي انفصال فوري إلى طريقين: الدم النقي يعود فوراً عبر الوريد الكلوي للجسم ليمدنا بالصحة. [كليك 2]: أما المواد الضارة فتتحول إلى سائل البول وتنزلق عبر الحالبين لتستقر في المثانة البولية حتى يحين موعد إخراجها.",
        "image": dest_images[3] if len(dest_images) > 3 else None,
        "placeholder_text": "فيديو 3D: مسار أحمر ناصع يصعد لأعلى، وسائل ذهبي ينزلق عبر الحالب إلى بالون المثانة"
    }
]

for data in slides_data:
    slide = prs.slides.add_slide(blank_layout)

    # 1. شريط العنوان والوسم العلوي
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.3))
    tf = title_box.text_frame
    tf.word_wrap = True

    p_badge = tf.paragraphs[0]
    p_badge.text = data["badge"]
    p_badge.font.size = Pt(14)
    p_badge.font.bold = True
    p_badge.font.color.rgb = ACCENT_RED

    p_title = tf.add_paragraph()
    p_title.text = data["title"]
    p_title.font.size = Pt(24)
    p_title.font.bold = True
    p_title.font.color.rgb = DARK_BLUE

    # 2. إطار الوسائط ثلاثية الأبعاد (على الجانب الأيسر)
    img_path = data.get("image")
    if img_path and os.path.exists(img_path):
        # إضافة الصورة الحقيقية ثلاثية الأبعاد المولدة بأسلوب بيكسار
        slide.shapes.add_picture(
            img_path, Inches(0.8), Inches(1.9), Inches(6.5), Inches(4.9)
        )
    else:
        media_box = slide.shapes.add_shape(
            1, Inches(0.8), Inches(1.9), Inches(6.5), Inches(4.9)
        )
        media_box.fill.solid()
        media_box.fill.fore_color.rgb = BG_LIGHT
        media_box.line.color.rgb = ACCENT_RED
        media_box.line.width = Pt(1.5)

        m_tf = media_box.text_frame
        m_tf.word_wrap = True
        mp = m_tf.paragraphs[0]
        mp.text = "🎬 [منطقة وسائط ثلاثية الأبعاد 3D]\n\n" + data["placeholder_text"]
        mp.alignment = PP_ALIGN.CENTER
        mp.font.size = Pt(15)
        mp.font.color.rgb = DARK_BLUE

    # 3. إطار النقاط التعليمية (على الجانب الأيمن)
    # Background card for readability
    card_shape = slide.shapes.add_shape(
        1, Inches(7.6), Inches(1.9), Inches(4.9), Inches(4.9)
    )
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = BG_LIGHT
    card_shape.line.color.rgb = BORDER_GRAY
    card_shape.line.width = Pt(1)

    content_box = slide.shapes.add_textbox(Inches(7.8), Inches(2.1), Inches(4.5), Inches(4.5))
    c_tf = content_box.text_frame
    c_tf.word_wrap = True

    header_p = c_tf.paragraphs[0]
    header_p.text = "📝 أهم النقاط التعليمية:"
    header_p.font.size = Pt(16)
    header_p.font.bold = True
    header_p.font.color.rgb = ACCENT_RED

    for pt_text in data["points"]:
        p = c_tf.add_paragraph()
        p.text = "\n" + pt_text
        p.font.size = Pt(14)
        p.font.color.rgb = DARK_BLUE
        p.font.bold = False

    # 4. إدراج سكريبت التسجيل في خانة الملاحظات (Speaker Notes)
    notes_slide = slide.notes_slide
    text_frame = notes_slide.notes_text_frame
    text_frame.text = "سيناريو التسجيل الصوتي لمس رحاب (يظهر لك فقط أثناء التسجيل):\n\n" + data["script"]

# حفظ الملف في مجلد المشروع وفي مجلد public للتحميل المباشر
out_root = os.path.join(base_dir, "urinary_system_presentation.pptx")
out_public = os.path.join(app_dir, "public", "urinary_system_presentation.pptx")

prs.save(out_root)
prs.save(out_public)

print("SUCCESS: Saved presentation to urinary_system_presentation.pptx in root and public!")
