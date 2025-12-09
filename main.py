from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, conint
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Marksheet Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory=".", html=True), name="static")

class MarksModel(BaseModel):
    maths: conint(ge=0, le=100)
    science: conint(ge=0, le=100)
    english: conint(ge=0, le=100)
    social: conint(ge=0, le=100)
    hindi: conint(ge=0, le=100)
    computer: conint(ge=0, le=100)

class StudentModel(BaseModel):
    name: str
    rollNo: str
    class_: str = Field(..., alias="class")
    school: str
    marks: MarksModel

def calculate_results(marks):
    subjects = list(marks.values())
    total = sum(subjects)
    max_marks = len(subjects) * 100
    percentage = round((total / max_marks) * 100, 2)

    if percentage >= 95:
        grade, remarks, status = "A+", "Outstanding!", "PASS"
    elif percentage >= 90:
        grade, remarks, status = "A+", "Excellent!", "PASS"
    elif percentage >= 80:
        grade, remarks, status = "A", "Very Good!", "PASS"
    elif percentage >= 70:
        grade, remarks, status = "B", "Good!", "PASS"
    elif percentage >= 60:
        grade, remarks, status = "C", "Average!", "PASS"
    elif percentage >= 50:
        grade, remarks, status = "D", "Below Average!", "PASS"
    else:
        grade, remarks, status = "F", "Needs Improvement!", "FAIL"

    return {
        "totalMarks": total,
        "maxMarks": max_marks,
        "percentage": percentage,
        "grade": grade,
        "remarks": remarks,
        "status": status,
    }

def get_subject_remarks(m):
    if m >= 90: return "Excellent"
    if m >= 80: return "Very Good"
    if m >= 70: return "Good"
    if m >= 60: return "Average"
    if m >= 50: return "Below Average"
    return "Needs Improvement"

def render_marksheet_html(student, results):
    m = student.marks
    generated_on = datetime.now().strftime("%Y-%m-%d")

    return f"""
    <div class='marksheet-header'>
        <h2>OFFICIAL MARKSHEET</h2>
        <p>Academic Year 2024-2025</p>
    </div>

    <div class='student-info'>
        <div><strong>Name:</strong> {student.name}</div>
        <div><strong>Roll No:</strong> {student.rollNo}</div>
        <div><strong>Section and Class:</strong> {student.class_}</div>
        <div><strong>School:</strong> {student.school}</div>
    </div>

    <table class='marks-table'>
        <thead>
            <tr><th>Subject</th><th>Marks</th><th>Max</th><th>Remarks</th></tr>
        </thead>
        <tbody>
            <tr><td>Mathematics</td><td>{m.maths}</td><td>100</td><td>{get_subject_remarks(m.maths)}</td></tr>
            <tr><td>Science</td><td>{m.science}</td><td>100</td><td>{get_subject_remarks(m.science)}</td></tr>
            <tr><td>English</td><td>{m.english}</td><td>100</td><td>{get_subject_remarks(m.english)}</td></tr>
            <tr><td>Social Studies</td><td>{m.social}</td><td>100</td><td>{get_subject_remarks(m.social)}</td></tr>
            <tr><td>Hindi</td><td>{m.hindi}</td><td>100</td><td>{get_subject_remarks(m.hindi)}</td></tr>
            <tr><td>Computer</td><td>{m.computer}</td><td>100</td><td>{get_subject_remarks(m.computer)}</td></tr>
        </tbody>
    </table>

    <div class='result-summary'>
        <h3>Result Summary</h3>
        <p><strong>Total Marks:</strong> {results['totalMarks']}/{results['maxMarks']}</p>
        <p><strong>Percentage:</strong> {results['percentage']}%</p>
        <p><strong>Grade:</strong> {results['grade']}</p>
        <p><strong>Remarks:</strong> {results['remarks']}</p>
        <p><strong>Status:</strong> {results['status']}</p>
    </div>

    <p style='text-align:center; margin-top:10px;'>Generated on: {generated_on}</p>
    """

@app.post("/api/marksheet")
async def create_marksheet(student: StudentModel):
    results = calculate_results(student.marks.dict())
    html = render_marksheet_html(student, results)
    return {"success": True, "results": results, "marksheet_html": html}

@app.get("/api/health")
async def health():
    return {"status": "ok"}
