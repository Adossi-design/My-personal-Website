"use client";

import { useState } from "react";
import type { Domain } from "@prisma/client";
import { Markdown } from "./Markdown";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  body1: string;
  body2: string;
  body3: string;
  readMoreLabel: string;
  domainsEyebrow: string;
  domains: Domain[];
};

// Client-side only for the Read more toggle; the copy still arrives from the database.
export function AboutSection(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="eyebrow">{props.eyebrow}</p>
      <h2 className="section-title">{props.title}</h2>
      <p className="section-sub">{props.subtitle}</p>

      <Markdown className="copy">{props.body1}</Markdown>

      <div className={open ? "collapse open" : "collapse"} id="aboutMore">
        <div style={{ marginTop: 16 }}>
          <Markdown className="copy">{props.body2}</Markdown>
        </div>
        <div style={{ marginTop: 16 }}>
          <Markdown className="copy">{props.body3}</Markdown>
        </div>
      </div>

      <button className="link-more" type="button" aria-expanded={open} aria-controls="aboutMore" onClick={() => setOpen((v) => !v)}>
        {open ? "Read less" : props.readMoreLabel}
      </button>

      <p className="eyebrow" style={{ marginTop: 44 }}>
        {props.domainsEyebrow}
      </p>
      <div className="grid cols-4">
        {props.domains.map((domain, index) => (
          <div className="card focus-card" key={domain.id}>
            <span className="card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h4>{domain.title}</h4>
            <p>{domain.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
