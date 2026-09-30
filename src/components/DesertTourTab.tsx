"use client";

// 10/6 판랑 사막투어 예약 브리핑 — 결론 → 우리 조건 → 업체 비교 → 1순위 예약 방법 → 확인할 것 → 당일 동선 → 준비물.
// 업체 비교는 src/data/desertTour.json, 1순위 예약 단계·신청 문구는 투어·쇼핑 탭의 판랑 사막투어 카드와 같은 자료를 쓴다.

import { useState } from "react";
import data from "@/data/desertTour.json";
import { GUIDE } from "@/data/guide";
import { toggleChecklistItem } from "@/lib/trip";
import type { TripState } from "@/lib/types";
import { AddOnList, HowToBox } from "./HowToBox";
import { activityPhoto, desertPhoto, Photo } from "./Photo";
import { btn, card } from "./ui";

interface LinkItem {
  label: string;
  url: string;
}

interface Vendor {
  id: string;
  rank: number;
  name: string;
  platform: string;
  url: string;
  total: string;
  vehicle: string;
  luggage: string;
  radissonDrop: string;
  startTime: string;
  cancel: string;
  payment: string;
  rating: string;
  includes: string;
  excludes?: string;
  kid?: string;
  childSeat?: string;
  /** 최근 후기 요약 */
  reviews?: string;
  /** 9/27 조사 대비 달라진 점 */
  changed?: string;
  howTo?: string[];
  /** 실제 사진이 많은 페이지 (사진은 저작권 때문에 복사하지 않고 링크만) */
  photoLinks?: LinkItem[];
  pros: string[];
  cons: string[];
  note?: string;
}

interface Briefing {
  updatedAt: string;
  status: string;
  deadlines: { date: string; text: string }[];
  conditions: { label: string; value: string }[];
  verdict: { title: string; why: string[]; backup: string };
  vendors: Vendor[];
  others: string;
  ask: string[];
  packing: string[];
  sources: string;
  /** 자유 라이선스 사진 (images.json desert 묶음) + 설명 */
  gallery?: { id: string; title: string; text: string }[];
  /** 아이 동반 오전 투어 모습이 잘 보이는 후기 */
  sceneLinks?: LinkItem[];
  route?: LinkItem;
}

const B = data as Briefing;
const DESERT = GUIDE.activities.find((a) => a.id === "phan-rang-desert");
const CHECK_ID = "bk-desert-tour";

export default function DesertTourTab({
  state,
  update,
}: {
  state: TripState;
  update: (fn: (s: TripState) => TripState) => void;
}) {
  const day = state.days.find((d) => d.date === "2026-10-06");
  const check = state.checklist.find((c) => c.id === CHECK_ID);
  const photo = activityPhoto("phan-rang-desert");

  return (
    <div className="space-y-4">
      {/* 결론 */}
      <section className={`${card} overflow-hidden`}>
        {photo && <Photo photo={photo} alt="판랑 남끄엉 사막" className="aspect-[21/9]" />}
        <div className="p-5 md:p-6">
          <p className="text-[15px] font-bold text-primary-ink">🏜️ 10/6(화) 판랑 사막투어 · 예약 브리핑</p>
          <h2 className="mt-1 text-[22px] leading-snug font-bold tracking-tight">{B.verdict.title}</h2>
          <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-ink">
            {B.verdict.why.map((w) => (
              <li key={w}>✔️ {w}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-2xl bg-surface-2 p-3 text-[14px] leading-relaxed text-ink-2">🔁 {B.verdict.backup}</p>

          {check && (
            <label className="press mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl bg-primary-soft px-4">
              <input
                type="checkbox"
                checked={check.checked}
                onChange={() => update((s) => toggleChecklistItem(s, CHECK_ID))}
                aria-label="사막투어 예약 완료"
              />
              <span className="text-[15px] font-bold text-primary-ink">
                {check.checked ? "예약 완료 ✓" : "예약하면 체크 (준비물 탭 예약 목록과 같이 바뀌어요)"}
              </span>
            </label>
          )}
          <p className="mt-2 text-[12px] text-ink-3">{B.status}</p>
        </div>
      </section>

      {/* 마감 */}
      <section className={`${card} p-5`}>
        <h3 className="text-[17px] font-bold">⏰ 마감 날짜</h3>
        <ol className="mt-2 space-y-2">
          {B.deadlines.map((d) => (
            <li key={d.date + d.text} className="flex gap-3 text-[14px] leading-snug">
              <span className="w-16 shrink-0 font-bold text-accent tabular-nums">{d.date}</span>
              <span className="text-ink">{d.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 우리 조건 */}
      <section className={`${card} p-5`}>
        <h3 className="text-[17px] font-bold">📌 우리 조건 (업체에 그대로 말할 것)</h3>
        <dl className="mt-2 divide-y divide-line">
          {B.conditions.map((c) => (
            <div key={c.label} className="flex gap-3 py-2 text-[14px] leading-snug">
              <dt className="w-20 shrink-0 font-semibold text-ink-3">{c.label}</dt>
              <dd className="min-w-0 text-ink">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 이렇게 생겼어요 — 자유 라이선스 사진 + 실제 후기 사진 링크 */}
      {B.gallery && B.gallery.length > 0 && (
        <section className={`${card} p-5`}>
          <h3 className="text-[17px] font-bold">📸 이렇게 생겼어요</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {B.gallery.map((g) => (
              <figure key={g.id}>
                <Photo photo={desertPhoto(g.id)} alt={g.title} className="aspect-[4/3]" />
                <figcaption className="mt-1.5">
                  <p className="text-[15px] font-bold text-ink">{g.title}</p>
                  <p className="text-[13px] leading-relaxed text-ink-2">{g.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            위 사진은 자유 라이선스 예시 사진이라 판랑 남끄엉과 다른 사구도 섞여 있어요. 실제 판랑 모습은 아래 후기에서 보세요.
          </p>
          {B.sceneLinks && B.sceneLinks.length > 0 && <LinkList title="📷 아이랑 다녀온 실제 후기 사진" links={B.sceneLinks} />}
        </section>
      )}

      {/* 업체 비교 */}
      <section className="space-y-3">
        <h3 className="px-1 text-[19px] font-bold tracking-tight">🔍 업체 비교 ({B.vendors.length}곳)</h3>
        {B.vendors.map((v) => (
          <VendorCard key={v.id} v={v} />
        ))}
        {B.others && <p className="px-1 text-[13px] leading-relaxed text-ink-3">{B.others}</p>}
      </section>

      {/* 1순위 예약 방법 */}
      {DESERT?.howTo && (
        <section className={`${card} p-5`}>
          <h3 className="text-[17px] font-bold">🥇 1순위 예약하기 — {B.vendors[0]?.name}</h3>
          <HowToBox title="📱 예약 방법" steps={DESERT.howTo} texts={DESERT.messages ?? []} />
        </section>
      )}

      {/* 예약 전·후 확인할 것 */}
      <section className={`${card} p-5`}>
        <h3 className="text-[17px] font-bold">💬 카톡으로 꼭 받아 둘 답</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink">
          {B.ask.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
      </section>

      {/* 당일 동선 (일정 탭과 같은 데이터) */}
      {day && (
        <section className={`${card} p-5`}>
          <h3 className="text-[17px] font-bold">🕖 당일 동선 · {day.title}</h3>
          {B.route && (
            <a className={`${btn.soft} mt-3 w-full`} href={B.route.url} target="_blank" rel="noopener noreferrer">
              🗺️ {B.route.label}
            </a>
          )}
          <ol className="mt-3 space-y-1.5">
            {day.items
              .filter((i) => i.time < "13:30")
              .map((i) => (
                <li key={i.id} className="flex gap-3 text-[14px] leading-snug">
                  <span className="w-12 shrink-0 font-bold text-ink tabular-nums">{i.time}</span>
                  <span className="min-w-0 text-ink-2">{i.title}</span>
                </li>
              ))}
          </ol>
        </section>
      )}

      {/* 준비물 */}
      <section className={`${card} p-5`}>
        <h3 className="text-[17px] font-bold">🎒 4살 아이 준비물</h3>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 text-[14px] leading-snug text-ink sm:grid-cols-2">
          {B.packing.map((p) => (
            <li key={p}>• {p}</li>
          ))}
        </ul>
        {DESERT?.addOns && DESERT.addOns.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-[14px] font-bold text-ink-2">🧩 같이 묶이는 곳 (이번엔 빼요)</summary>
            <AddOnList addOns={DESERT.addOns} />
          </details>
        )}
      </section>

      <p className="px-1 text-[12px] leading-relaxed text-ink-4">
        {B.updatedAt} 기준 · {B.sources}
      </p>
    </div>
  );
}

/** 사진이 많은 후기·상품 페이지 링크 목록 */
function LinkList({ title, links }: { title: string; links: LinkItem[] }) {
  return (
    <div className="mt-3 rounded-2xl bg-surface-2 p-3">
      <p className="text-[14px] font-bold text-ink-2">{title}</p>
      <ul className="mt-1.5 space-y-1.5">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] leading-snug text-primary-ink underline underline-offset-2"
            >
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VendorCard({ v }: { v: Vendor }) {
  const [open, setOpen] = useState(v.rank === 1);
  const rows: [string, string | undefined][] = [
    ["차량", v.vehicle],
    ["짐", v.luggage],
    ["래디슨 드랍", v.radissonDrop],
    ["출발 시간", v.startTime],
    ["포함", v.includes],
    ["불포함", v.excludes],
    ["아이", v.kid],
    ["카시트", v.childSeat],
    ["취소", v.cancel],
    ["결제", v.payment],
    ["평점", v.rating],
    ["최근 후기", v.reviews],
  ];
  return (
    <article className={`${card} p-5 ${v.rank === 1 ? "ring-2 ring-accent" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">
        <span className={`rounded-lg px-2 py-0.5 ${v.rank === 1 ? "bg-accent text-white" : "bg-primary-soft text-primary-ink"}`}>
          {v.rank === 1 ? "1순위" : `${v.rank}순위`}
        </span>
        <span className="text-ink-3">{v.platform}</span>
      </div>
      <h4 className="mt-1.5 text-[19px] leading-snug font-bold tracking-tight">{v.name}</h4>
      <p className="mt-1 text-[17px] leading-snug font-bold text-primary-ink">{v.total}</p>
      {v.changed && (
        <p className="mt-1.5 text-[13px] leading-snug text-ink-2">
          <b className={v.changed.startsWith("변동 없") ? "text-ink-3" : "text-accent"}>🔄 9/27 대비</b> {v.changed}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="press mt-2 inline-flex min-h-9 items-center rounded-full bg-surface-2 px-3 text-[13px] font-semibold text-ink-2"
      >
        {open ? "접기 ▲" : "조건 자세히 ▼"}
      </button>
      {open && (
        <>
          <dl className="mt-3 divide-y divide-line rounded-2xl bg-surface-2 px-3">
            {rows
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex gap-3 py-2 text-[13px] leading-snug">
                  <dt className="w-16 shrink-0 font-semibold text-ink-3">{label}</dt>
                  <dd className="min-w-0 text-ink">{value}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-3 grid grid-cols-1 gap-2 text-[13px] leading-relaxed sm:grid-cols-2">
            <ul className="rounded-2xl bg-primary-soft p-3 text-ink">
              {v.pros.map((p) => (
                <li key={p}>👍 {p}</li>
              ))}
            </ul>
            <ul className="rounded-2xl bg-accent-soft p-3 text-ink">
              {v.cons.map((c) => (
                <li key={c}>⚠️ {c}</li>
              ))}
            </ul>
          </div>
          {v.note && <p className="mt-2 text-[13px] leading-relaxed text-ink-2">💡 {v.note}</p>}
          {/* 1순위는 아래 '1순위 예약하기'에 단계·문구가 있어서, 나머지 업체만 여기서 예약 방법을 보여 준다 */}
          {v.rank > 1 && v.howTo && v.howTo.length > 0 && (
            <div className="mt-3 rounded-2xl bg-accent-soft p-3">
              <p className="text-[14px] font-bold text-accent">📱 이 업체로 예약하는 법</p>
              <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-ink">
                {v.howTo.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </div>
          )}
          {v.photoLinks && v.photoLinks.length > 0 && <LinkList title="📷 실제 사진 보기 (차량·지프·썰매)" links={v.photoLinks} />}
        </>
      )}
      {v.url && (
        <a className={`${btn.soft} mt-3`} href={v.url} target="_blank" rel="noopener noreferrer">
          예약 페이지 열기 ↗
        </a>
      )}
    </article>
  );
}
