"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Certification, EducationItem } from "@prisma/client";
import { SortableList } from "@/components/admin/SortableList";
import { buttonClass, Card, dangerButtonClass, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import { readGrades } from "@/lib/queries/site";
import type { CertificationInput, EducationInput } from "@/lib/validation/cv";
import {
  deleteCertification,
  deleteEducation,
  reorderCertifications,
  saveCertification,
  saveEducation,
} from "./actions";

const BLANK_EDU: EducationInput = {
  degree: "",
  institution: "",
  period: "",
  meta: "",
  note: "",
  iconKey: "🎓",
  grades: [],
};

const BLANK_CERT: CertificationInput = { name: "", issuer: "", date: "", credentialId: null };

export function EducationEditor({
  education,
  certifications,
}: {
  education: EducationItem[];
  certifications: Certification[];
}) {
  const router = useRouter();
  const [certRows, setCertRows] = useState(certifications);
  const [edu, setEdu] = useState<EducationInput | null>(null);
  const [cert, setCert] = useState<CertificationInput | null>(null);
  const [pending, startTransition] = useTransition();

  function run(work: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await work();
      if (!result.ok) {
        toast.error(result.error ?? "Something went wrong");
        return;
      }
      toast.success(success);
      setEdu(null);
      setCert(null);
      router.refresh();
    });
  }

  function reorderCerts(ids: string[]) {
    setCertRows((current) => ids.map((id) => current.find((r) => r.id === id)!).filter(Boolean));
    startTransition(async () => {
      const result = await reorderCertifications(ids);
      if (!result.ok) {
        toast.error(result.error);
        setCertRows(certifications);
        return;
      }
      toast.success("Order saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Education and certifications</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Grades render as the readout list on the public card.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Education</h2>
          <button type="button" className={`${buttonClass} ml-auto`} onClick={() => setEdu({ ...BLANK_EDU })}>
            Add
          </button>
        </div>

        {edu && (
          <Card title={edu.id ? "Edit qualification" : "New qualification"}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
                <Field label="Icon" htmlFor="eduIcon" required>
                  <input
                    id="eduIcon"
                    type="text"
                    value={edu.iconKey}
                    onChange={(e) => setEdu({ ...edu, iconKey: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Degree" htmlFor="degree" required>
                  <input
                    id="degree"
                    type="text"
                    value={edu.degree}
                    onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Institution" htmlFor="institution" required>
                  <input
                    id="institution"
                    type="text"
                    value={edu.institution}
                    onChange={(e) => setEdu({ ...edu, institution: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Period" htmlFor="eduPeriod" required>
                  <input
                    id="eduPeriod"
                    type="text"
                    value={edu.period}
                    onChange={(e) => setEdu({ ...edu, period: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Summary line" htmlFor="meta" hint="Shown under the institution">
                <textarea
                  id="meta"
                  rows={3}
                  value={edu.meta}
                  onChange={(e) => setEdu({ ...edu, meta: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="Grades">
                <div className="space-y-2">
                  {edu.grades.map((grade, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={grade.course}
                        placeholder="Web Infrastructure"
                        aria-label={`Course ${index + 1}`}
                        onChange={(e) =>
                          setEdu({
                            ...edu,
                            grades: edu.grades.map((g, i) => (i === index ? { ...g, course: e.target.value } : g)),
                          })
                        }
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={grade.score}
                        placeholder="98.80"
                        aria-label={`Score ${index + 1}`}
                        onChange={(e) =>
                          setEdu({
                            ...edu,
                            grades: edu.grades.map((g, i) => (i === index ? { ...g, score: e.target.value } : g)),
                          })
                        }
                        className={`${inputClass} sm:max-w-28`}
                      />
                      <button
                        type="button"
                        aria-label={`Remove grade ${index + 1}`}
                        className={buttonClass}
                        onClick={() => setEdu({ ...edu, grades: edu.grades.filter((_, i) => i !== index) })}
                      >
                        {"×"}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => setEdu({ ...edu, grades: [...edu.grades, { course: "", score: "" }] })}
                  >
                    Add a grade
                  </button>
                </div>
              </Field>

              <Field label="Closing note" htmlFor="note" hint="Wider coursework, shown in smaller text">
                <textarea
                  id="note"
                  rows={3}
                  value={edu.note}
                  onChange={(e) => setEdu({ ...edu, note: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <div className="flex gap-2">
                <button
                  type="button"
                  className={primaryButtonClass}
                  disabled={pending}
                  onClick={() => run(() => saveEducation(edu), "Saved")}
                >
                  {pending ? "Saving" : "Save"}
                </button>
                <button type="button" className={buttonClass} onClick={() => setEdu(null)} disabled={pending}>
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        )}

        <ul className="space-y-3">
          {education.map((item) => {
            const grades = readGrades(item.grades);
            return (
              <li
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-baseline gap-2">
                  <span aria-hidden="true">{item.iconKey}</span>
                  <p className="text-sm font-semibold">{item.degree}</p>
                  <p className="ml-auto text-xs text-slate-400">{item.period}</p>
                </div>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{item.institution}</p>
                <p className="mt-1 text-xs text-slate-400">{grades.length} grade rows</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() =>
                      setEdu({
                        id: item.id,
                        degree: item.degree,
                        institution: item.institution,
                        period: item.period,
                        meta: item.meta,
                        note: item.note,
                        iconKey: item.iconKey,
                        grades,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={dangerButtonClass}
                    onClick={() => {
                      if (window.confirm(`Delete "${item.degree}"?`)) run(() => deleteEducation(item.id), "Deleted");
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Certifications</h2>
          <button type="button" className={`${buttonClass} ml-auto`} onClick={() => setCert({ ...BLANK_CERT })}>
            Add
          </button>
        </div>

        {cert && (
          <Card title={cert.id ? "Edit certification" : "New certification"}>
            <div className="space-y-4">
              <Field label="Name" htmlFor="certName" required>
                <input
                  id="certName"
                  type="text"
                  value={cert.name}
                  onChange={(e) => setCert({ ...cert, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Issuer" htmlFor="issuer" required>
                  <input
                    id="issuer"
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => setCert({ ...cert, issuer: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Date" htmlFor="certDate" required hint="Free text, such as May 2026">
                  <input
                    id="certDate"
                    type="text"
                    value={cert.date}
                    onChange={(e) => setCert({ ...cert, date: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Credential ID" htmlFor="credentialId" hint="Optional">
                  <input
                    id="credentialId"
                    type="text"
                    value={cert.credentialId ?? ""}
                    onChange={(e) => setCert({ ...cert, credentialId: e.target.value || null })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={primaryButtonClass}
                  disabled={pending}
                  onClick={() => run(() => saveCertification(cert), "Saved")}
                >
                  {pending ? "Saving" : "Save"}
                </button>
                <button type="button" className={buttonClass} onClick={() => setCert(null)} disabled={pending}>
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        )}

        <SortableList items={certRows} onReorder={reorderCerts}>
          {(row) => (
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-medium">{row.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{row.issuer}</p>
                <p className="ml-auto text-xs text-slate-400">{row.date}</p>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() =>
                    setCert({
                      id: row.id,
                      name: row.name,
                      issuer: row.issuer,
                      date: row.date,
                      credentialId: row.credentialId,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerButtonClass}
                  onClick={() => {
                    if (window.confirm(`Delete "${row.name}"?`)) run(() => deleteCertification(row.id), "Deleted");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </SortableList>
      </section>
    </div>
  );
}
