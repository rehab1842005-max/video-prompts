import { NextRequest, NextResponse } from "next/server";
import pptxgen from "pptxgenjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { presentation } = body;

    if (!presentation || !presentation.steps || presentation.steps.length === 0) {
      return NextResponse.json({ error: "Invalid presentation data" }, { status: 400 });
    }

    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_16x9";
    pptx.author = "Sci.Rehab Elsibai";
    pptx.company = "Sci.Rehab Educational Studio";
    pptx.title = presentation.title;

    // Dark sleek theme colors
    const BG_COLOR = "0B132B"; // deep slate navy
    const CARD_BG = "1C2541";
    const ACCENT_TEAL = "00F5D4";
    const ACCENT_BLUE = "3A86FF";
    const TEXT_WHITE = "FFFFFF";
    const TEXT_MUTED = "94A3B8";
    const ACCENT_YELLOW = "FACC15";

    // 1. Cover / Title Slide
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: BG_COLOR };

    coverSlide.addText(presentation.title, {
      x: 1.0,
      y: 2.2,
      w: 11.3,
      h: 1.5,
      fontSize: 36,
      bold: true,
      color: ACCENT_TEAL,
      align: "center",
    });

    coverSlide.addText("عرض تقديمي تفاعلي خطوة بخطوة (كليك لكل حركة)", {
      x: 1.0,
      y: 3.7,
      w: 11.3,
      h: 0.8,
      fontSize: 20,
      color: TEXT_WHITE,
      align: "center",
    });

    coverSlide.addText("إعداد وتقديم: Sci.Rehab Elsibai", {
      x: 1.0,
      y: 4.8,
      w: 11.3,
      h: 0.6,
      fontSize: 16,
      bold: true,
      color: ACCENT_BLUE,
      align: "center",
    });

    coverSlide.addNotes(
      "أهلاً بكم يا أبطال في هذا الدرس التفاعلي! اليوم هنعيش رحلة استكشافية حية ومبهرة، وكل كليك هيكشف لنا سر جديد من أسرار جسمنا!"
    );

    // 2. Master Diagram Overview Slide (الرسمة موجودة في البداية)
    const overviewSlide = pptx.addSlide();
    overviewSlide.background = { color: BG_COLOR };

    overviewSlide.addText("نظرة عامة على الرسمة والتركيب الأساسي", {
      x: 0.8,
      y: 0.4,
      w: 11.7,
      h: 0.8,
      fontSize: 26,
      bold: true,
      color: ACCENT_TEAL,
      align: "right",
    });

    // Diagram Box Placeholder / Representation
    overviewSlide.addShape("roundRect", {
      x: 0.8,
      y: 1.4,
      w: 7.2,
      h: 5.4,
      fill: { color: "111C38" },
      line: { color: ACCENT_BLUE, width: 2 },
    });

    overviewSlide.addText("🫘 الرسمة التشريحية الأساسية", {
      x: 1.2,
      y: 2.2,
      w: 6.4,
      h: 0.8,
      fontSize: 22,
      bold: true,
      color: TEXT_WHITE,
      align: "center",
    });

    overviewSlide.addText("الكليتان - الشريان الكلوي - الوريد الكلوي - الحالبان - المثانة", {
      x: 1.2,
      y: 3.2,
      w: 6.4,
      h: 0.8,
      fontSize: 15,
      color: ACCENT_YELLOW,
      align: "center",
    });

    overviewSlide.addText("(الرسمة تظهر كاملة هنا، ومع كل كليك سيكتشف الطلاب جزءاً جديداً بالتفصيل)", {
      x: 1.2,
      y: 4.2,
      w: 6.4,
      h: 0.8,
      fontSize: 13,
      color: TEXT_MUTED,
      align: "center",
    });

    // Side Card
    overviewSlide.addShape("roundRect", {
      x: 8.3,
      y: 1.4,
      w: 4.2,
      h: 5.4,
      fill: { color: CARD_BG },
      line: { color: "334155", width: 1 },
    });

    overviewSlide.addText("مقدمة الشرح:", {
      x: 8.6,
      y: 1.7,
      w: 3.6,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: ACCENT_TEAL,
      align: "right",
    });

    overviewSlide.addText(
      "• نبدأ بالتعرف على الشكل العام للعضو في جسم الإنسان.\n• كل جزء سيضاء تدريجياً بكليك مستقل مع الأسهم التوضيحية.\n• سنتتبع مسار الدم من لحظة دخوله وحتى تنقيته بالكامل.",
      {
        x: 8.6,
        y: 2.4,
        w: 3.6,
        h: 4.0,
        fontSize: 14,
        color: TEXT_WHITE,
        align: "right",
        lineSpacing: 26,
      }
    );

    overviewSlide.addNotes(
      "نبدأ يا أبطالي بالنظر إلى هذا الرسم الكامل. ده العضو اللي هندرسه النهاردة، وخليكم مركزين معايا لأننا مع كل ضغطة هنكتشف حكاية وسر جديد جوة الرسمة!"
    );

    // 3. Progressive Detail Slides (كل كليك يظهر تفاصيل الرسمة)
    presentation.steps.forEach((step: any) => {
      const slide = pptx.addSlide();
      slide.background = { color: BG_COLOR };

      // Slide Title
      slide.addText(`الخطوة ${step.stepNumber}: ${step.title}`, {
        x: 0.8,
        y: 0.35,
        w: 11.7,
        h: 0.7,
        fontSize: 24,
        bold: true,
        color: ACCENT_TEAL,
        align: "right",
      });

      // Left: Visual Diagram Box with Active Element Highlighted
      slide.addShape("roundRect", {
        x: 0.8,
        y: 1.25,
        w: 7.2,
        h: 5.6,
        fill: { color: "111C38" },
        line: { color: ACCENT_TEAL, width: 2 },
      });

      // Highlight Badge on Diagram
      slide.addShape("roundRect", {
        x: 1.2,
        y: 1.55,
        w: 6.4,
        h: 0.6,
        fill: { color: "1E293B" },
        line: { color: ACCENT_YELLOW, width: 1.5 },
      });

      slide.addText(`🔍 الجزء النشط في هذا الكليك: ${step.category}`, {
        x: 1.3,
        y: 1.6,
        w: 6.2,
        h: 0.5,
        fontSize: 13,
        bold: true,
        color: ACCENT_YELLOW,
        align: "center",
      });

      // Visual Action Description
      slide.addText(step.visualAction, {
        x: 1.2,
        y: 2.4,
        w: 6.4,
        h: 1.2,
        fontSize: 14,
        color: TEXT_WHITE,
        align: "center",
      });

      // Labels on this click
      if (step.labels && step.labels.length > 0) {
        let labelY = 3.8;
        step.labels.forEach((lbl: any) => {
          slide.addShape("roundRect", {
            x: 1.8,
            y: labelY,
            w: 5.2,
            h: 0.55,
            fill: { color: "0F172A" },
            line: { color: lbl.color ? lbl.color.replace("#", "") : ACCENT_TEAL, width: 2 },
          });

          slide.addText(`📍 ${lbl.text}`, {
            x: 1.9,
            y: labelY + 0.05,
            w: 5.0,
            h: 0.45,
            fontSize: 12,
            bold: true,
            color: lbl.color ? lbl.color.replace("#", "") : TEXT_WHITE,
            align: "center",
          });

          labelY += 0.7;
        });
      }

      // Right: Written Key Points Card (الكلام المهم المكتوب)
      slide.addShape("roundRect", {
        x: 8.3,
        y: 1.25,
        w: 4.2,
        h: 5.6,
        fill: { color: CARD_BG },
        line: { color: "334155", width: 1 },
      });

      slide.addText("📝 نقاط الشرح المكتوبة:", {
        x: 8.6,
        y: 1.45,
        w: 3.6,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: ACCENT_TEAL,
        align: "right",
      });

      // Key points text
      const points = step.keyPoints && step.keyPoints.length > 0 
        ? step.keyPoints.map((p: string) => `• ${p}`).join("\n\n")
        : `• ${step.visualAction}`;

      slide.addText(points, {
        x: 8.6,
        y: 2.0,
        w: 3.6,
        h: 3.0,
        fontSize: 12.5,
        color: TEXT_WHITE,
        align: "right",
        lineSpacing: 20,
      });

      // Scientific Fact Card at bottom of card
      if (step.scientificFact) {
        slide.addShape("roundRect", {
          x: 8.5,
          y: 5.15,
          w: 3.8,
          h: 1.45,
          fill: { color: "422006" }, // dark amber
          line: { color: ACCENT_YELLOW, width: 1.5 },
        });

        slide.addText("💡 معلومة ذهبية:", {
          x: 8.6,
          y: 5.25,
          w: 3.6,
          h: 0.35,
          fontSize: 11,
          bold: true,
          color: ACCENT_YELLOW,
          align: "right",
        });

        slide.addText(step.scientificFact, {
          x: 8.6,
          y: 5.65,
          w: 3.6,
          h: 0.85,
          fontSize: 10.5,
          color: "FEF3C7",
          align: "right",
          lineSpacing: 14,
        });
      }

      // NATIVE SPEAKER NOTES (ملاحظات المحاضر داخل الباوربوينت)
      slide.addNotes(
        `[ملاحظات المعلمة رحاب أثناء عرض الشريحة]:\n\n"${step.teacherScript}"\n\n(هذا النص مخصص لإلقاء المعلمة الصوتي، ولا يظهر للطلاب في شاشة العرض الرئيسية).`
      );
    });

    const buffer = await pptx.write({ outputType: "nodebuffer" });

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="presentation_${encodeURIComponent(presentation.title.replace(/\s+/g, "_"))}.pptx"`,
      },
    });
  } catch (error: any) {
    console.error("PPTX Export Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate PPTX" }, { status: 500 });
  }
}
