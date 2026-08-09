from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT = OUTPUT_DIR / "ryan-anselman-resume.pdf"
PUBLIC_COPY = ROOT / "public" / "resume.pdf"

INK = colors.HexColor("#19171C")
MUTED = colors.HexColor("#5F5A64")
PLUM = colors.HexColor("#5E3B6D")
AMBER = colors.HexColor("#A75524")
PALE = colors.HexColor("#F4EFF6")
RULE = colors.HexColor("#D9D1DC")
WHITE = colors.white

PAGE_WIDTH, PAGE_HEIGHT = LETTER
LEFT = 0.58 * inch
RIGHT = 0.58 * inch
TOP = 0.5 * inch
BOTTOM = 0.5 * inch
CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT

styles = getSampleStyleSheet()

NAME = ParagraphStyle(
    "Name",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=25,
    leading=27,
    textColor=INK,
    spaceAfter=2,
)

ROLE = ParagraphStyle(
    "Role",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.4,
    leading=12,
    tracking=1.2,
    textColor=PLUM,
    spaceAfter=5,
)

CONTACT = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.4,
    leading=11,
    textColor=MUTED,
)

SUMMARY = ParagraphStyle(
    "Summary",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9.35,
    leading=13.1,
    textColor=INK,
)

SECTION = ParagraphStyle(
    "Section",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.1,
    leading=11,
    tracking=1.5,
    textColor=PLUM,
    spaceBefore=0,
    spaceAfter=0,
)

JOB = ParagraphStyle(
    "Job",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.25,
    leading=11.5,
    textColor=INK,
)

COMPANY = ParagraphStyle(
    "Company",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.7,
    leading=11,
    textColor=PLUM,
)

DATE = ParagraphStyle(
    "Date",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.15,
    leading=10,
    textColor=MUTED,
    alignment=TA_RIGHT,
)

BODY = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.75,
    leading=11.6,
    textColor=INK,
)

SMALL = ParagraphStyle(
    "Small",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.15,
    leading=10.7,
    textColor=MUTED,
)

LABEL = ParagraphStyle(
    "Label",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=7.4,
    leading=9,
    tracking=0.7,
    textColor=AMBER,
)

PROJECT_TITLE = ParagraphStyle(
    "ProjectTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.25,
    leading=11,
    textColor=INK,
)

STACK = ParagraphStyle(
    "Stack",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.65,
    leading=9.5,
    textColor=PLUM,
)


def section(title):
    table = Table([[Paragraph(title.upper(), SECTION)]], colWidths=[CONTENT_WIDTH])
    table.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.7, PLUM),
    ]))
    return [Spacer(1, 9), table, Spacer(1, 6)]


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(item, BODY), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=11,
        bulletFontName="Helvetica",
        bulletFontSize=5,
        bulletColor=PLUM,
        spaceBefore=3,
        spaceAfter=0,
    )


def experience(role, company, dates, items):
    header = Table([
        [Paragraph(role, JOB), Paragraph(dates, DATE)],
        [Paragraph(company, COMPANY), ""],
    ], colWidths=[CONTENT_WIDTH - 112, 112])
    header.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("SPAN", (1, 0), (1, 1)),
    ]))
    return KeepTogether([header, bullets(items), Spacer(1, 6)])


def project(name, url, label, description, stack):
    title = f'<link href="{url}" color="#19171C">{name}</link>'
    block = Table([
        [Paragraph(label.upper(), LABEL), Paragraph(title, PROJECT_TITLE)],
        ["", Paragraph(description, BODY)],
        ["", Paragraph(stack, STACK)],
    ], colWidths=[103, CONTENT_WIDTH - 103])
    block.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 3),
        ("BOTTOMPADDING", (0, 2), (-1, 2), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return KeepTogether([block, Spacer(1, 8)])


def technical_range():
    data = [
        [Paragraph("LANGUAGES", LABEL), Paragraph("Python, TypeScript, JavaScript, Swift, C++, Bash", BODY)],
        [Paragraph("SYSTEMS", LABEL), Paragraph("Linux, firmware validation, hardware debugging, LAN/WAN, network security, fiber and copper plant, QA/QC", BODY)],
        [Paragraph("PLATFORMS", LABEL), Paragraph("FastAPI, React, Node.js, SwiftUI, PostgreSQL + pgvector, Playwright, Docker, AWS, Supabase", BODY)],
        [Paragraph("APPLIED AI", LABEL), Paragraph("Streaming voice, MCP tool servers, OCR/NLP, retrieval, evaluations, local-model workflows", BODY)],
    ]
    table = Table(data, colWidths=[82, CONTENT_WIDTH - 82])
    table.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table


def header_block():
    contact = (
        '<link href="mailto:hire@anselman.com" color="#5F5A64">hire@anselman.com</link>'
        '  |  <link href="https://anselman.com" color="#5F5A64">anselman.com</link>'
        '  |  <link href="https://linkedin.com/in/ryan-anselman" color="#5F5A64">linkedin.com/in/ryan-anselman</link>'
        '  |  <link href="https://github.com/blessdog" color="#5F5A64">github.com/blessdog</link>'
    )
    return [
        Paragraph("RYAN ANSELMAN", NAME),
        Paragraph("SOFTWARE &amp; SYSTEMS ENGINEER", ROLE),
        Paragraph("Denver, Colorado  |  " + contact, CONTACT),
        Spacer(1, 8),
        HRFlowable(width="100%", thickness=1.2, color=INK, spaceBefore=0, spaceAfter=7),
    ]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT, 0.36 * inch, PAGE_WIDTH - RIGHT, 0.36 * inch)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(LEFT, 0.22 * inch, "RYAN ANSELMAN  /  ANSELMAN.COM")
    page_text = str(doc.page)
    canvas.drawRightString(PAGE_WIDTH - RIGHT, 0.22 * inch, page_text)
    canvas.restoreState()


def build():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        leftMargin=LEFT,
        rightMargin=RIGHT,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="Ryan Anselman - Software & Systems Engineer",
        author="Ryan Anselman",
        subject="Resume",
    )

    story = []
    story.extend(header_block())
    story.append(Paragraph(
        "Software and systems engineer with hands-on experience spanning Python firmware validation, C++ component maintenance, data-center network deployments, Linux field operations, and full-stack product development. Builds native Swift apps, Python and TypeScript services, data pipelines, and applied AI systems. Promoted to lead on a Meta data-center buildout; strong customer-facing background from field engineering and quota-carrying sales. US citizen; no sponsorship required.",
        SUMMARY,
    ))
    story.extend(section("Technical range"))
    story.append(technical_range())
    story.extend(section("Experience"))
    story.append(experience(
        "Independent Software Engineer",
        "MatterMixers - Denver, Colorado",
        "Jan 2024 - present",
        [
            "Own architecture and implementation across native Swift apps, Python and TypeScript services, responsive web interfaces, browser automation, and PostgreSQL-backed data systems.",
            "Built production-oriented systems for streaming transcription, typed tool execution, document OCR/NLP, workflow automation, and retrieval; carried work from technical discovery through deployment.",
            "Translate customer and market requirements into scoped capabilities, demos, and working pilots without separating product judgment from implementation.",
        ],
    ))
    story.append(experience(
        "Network Infrastructure Engineer (Contract)",
        "Iron Systems Inc - Meta data-center facilities",
        "Oct 2023 - present",
        [
            "Perform intermittent contract deployments and support across LAN/WAN infrastructure, Linux administration, network security, and fiber and copper plant.",
            "Work inside controlled production facilities where change discipline, documentation, and physical-layer accuracy are operational requirements.",
        ],
    ))
    story.append(experience(
        "Network Infrastructure Lead",
        "Meta data centers - via Ericsson",
        "Jul 2023 - Dec 2023",
        [
            "Promoted from technician to project lead mid-engagement; completed the assigned data-center buildout on schedule and to specification.",
            "Coordinated facility-wide fiber and copper deployments, ran QA/QC, and bridged project management, engineering, and on-site crews.",
        ],
    ))
    story.append(experience(
        "Firmware Validation Engineer",
        "Micron Technology",
        "Jul 2021 - Jul 2022",
        [
            "Developed Python test automation for high-performance memory-controller and SSD firmware; performed bench testing and fault isolation that caught regressions before production.",
            "Maintained C++ firmware components alongside the validation suite in a distributed SCRUM and code-review workflow.",
        ],
    ))

    story.append(PageBreak())
    story.extend(section("Selected systems"))
    story.append(project(
        "Write-On",
        "https://write-on.app",
        "Realtime desktop",
        "Native macOS push-to-talk transcription in daily use. Built live Deepgram Nova-3 streaming, explicit pause/resume behavior, last-utterance preview, and a custom waveform visualizer.",
        "Swift  /  SwiftUI  /  AVFoundation  /  Deepgram SDK",
    ))
    story.append(project(
        "BlessDog Music System",
        "https://github.com/blessdog/blessdog",
        "Tool protocols",
        "Dual-MCP-server architecture exposing 40+ tools for Ableton Live. The five-stage system spans an OSC bridge, typed tool server, sample indexer, session-template builder, and reference-track analysis.",
        "Python  /  Node.js  /  MCP  /  OSC  /  Demucs  /  librosa",
    ))
    story.append(project(
        "TortWin",
        "https://github.com/blessdog/chronology_mvp",
        "Data pipeline",
        "End-to-end medical chronology system combining AWS Textract Medical OCR, BioClinicalBERT and scispaCy entity extraction, timeline assembly, duplicate consolidation, APIs, and vector retrieval.",
        "Python  /  FastAPI  /  React  /  PostgreSQL + pgvector  /  AWS  /  Docker",
    ))
    story.append(project(
        "JobCanon",
        "https://github.com/blessdog/jobhard",
        "Browser automation",
        "Multi-ATS automation for Workday, Greenhouse, and Lever. Uses stable selectors with adaptive fallbacks, local-model-assisted field resolution, and IMAP polling for verification workflows.",
        "Python  /  Playwright  /  TypeScript  /  Ollama  /  IMAP",
    ))
    story.append(project(
        "YapZapp",
        "https://yapzapp.com",
        "Voice product",
        "Voice capture with model-based intent routing. Shipped the web product and built native iOS work including Metal-shader waveform rendering and a system-wide keyboard extension.",
        "Swift  /  SwiftUI  /  Metal  /  Anthropic API",
    ))

    story.extend(section("Earlier experience"))
    story.append(experience(
        "Customer Engineer",
        "NCR Corporation",
        "Dec 2020 - Jun 2021",
        ["Maintained and repaired ATM and retail POS systems across Colorado's Front Range under SLA, including embedded software configuration and field diagnosis."],
    ))
    story.append(experience(
        "Network Technician",
        "Kenyatta Computer Services",
        "Jan 2019 - Dec 2020",
        ["Deployed network hardware, performed Ekahau wireless site surveys, and used Git-based change control for configuration work."],
    ))
    story.append(experience(
        "Residential Sales Consultant & Team Lead",
        "Blue Sky Solar",
        "Nov 2018 - Nov 2019",
        ["Promoted to team lead on closed-deal performance; trained a small crew while carrying a full-cycle B2C quota across the Denver metro."],
    ))

    story.extend(section("Education"))
    education = Table([
        [Paragraph("B.S. Computer Science &amp; Microbiology", JOB), Paragraph("2016 - 2018", DATE)],
        [Paragraph("The Evergreen State College", COMPANY), ""],
    ], colWidths=[CONTENT_WIDTH - 100, 100])
    education.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("SPAN", (1, 0), (1, 1)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(education)

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    copyfile(OUTPUT, PUBLIC_COPY)
    print(f"Generated {OUTPUT}")
    print(f"Updated {PUBLIC_COPY}")


if __name__ == "__main__":
    build()
