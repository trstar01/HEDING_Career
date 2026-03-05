/* ===========================================
   HEDING - script.js
   Google Forms 자동채움 완전판
   =========================================== */

// ============================================================
// 상수: Google Forms entry 매핑
// ============================================================
const FORMS = {
    consulting: {
        base: "https://docs.google.com/forms/d/e/1FAIpQLSf9VmfNZYUPLCfpEouPJSrYeEC0tUFt9MIgZsifzG91V-PNNQ/viewform",
        entry: {
            name: "entry.557460685",
            email: "entry.1639629100",
            phone: "entry.448397914",
            services: "entry.1771650009",  // append 복수
            package: "entry.1607120638",
            hunterPref: "entry.1363268145",
            consent: "entry.681351882"
        }
    },
    coaching: {
        base: "https://docs.google.com/forms/d/e/1FAIpQLSc4GzEGUwmRIeGGV6ge6sZuLuimJUPJMkAgXquQNNX2olkNKg/viewform",
        entry: {
            name: "entry.555508049",
            email: "entry.1338187755",
            phone: "entry.1191583357",
            role: "entry.1274577325",
            industry: "entry.1360035338",
            years: "entry.320562509",
            topics: "entry.1504440615",  // append 복수
            availability: "entry.478213786",   // append 복수
            type: "entry.1947487813"
        }
    }
};

// ============================================================
// URL 생성
// ============================================================
function buildUrl(base, single, multi) {
    const params = new URLSearchParams();
    params.set("usp", "pp_url");

    // 단일 값
    Object.entries(single || {}).forEach(([k, v]) => {
        const s = String(v ?? "").trim();
        if (s) params.set(k, s);
    });

    // 복수(체크박스) - append
    Object.entries(multi || {}).forEach(([k, arr]) => {
        if (!Array.isArray(arr)) return;
        arr.forEach(v => {
            const s = String(v ?? "").trim();
            if (s) params.append(k, s);
        });
    });

    return `${base}?${params.toString()}`;
}

// ============================================================
// 헤드헌터 선호 텍스트 생성
// ============================================================
function hunterPrefText() {
    if (hunterState.none) return "무관";
    const n = h => h ? hunterState.names[h] || h : "없음";
    const p1 = `1지망:${n(hunterState.rank1)}`;
    const p2 = `2지망:${n(hunterState.rank2)}`;
    const p3 = `3지망:${n(hunterState.rank3)}`;
    return `${p1} / ${p2} / ${p3}`;
}

// ============================================================
// 컨설팅 폼 열기
// ============================================================
function openConsulting(state) {
    const e = FORMS.consulting.entry;
    const single = {};
    single[e.name] = state.name;
    single[e.email] = state.email || "";
    single[e.phone] = state.phone || "";
    single[e.package] = state.package || "";
    single[e.hunterPref] = hunterPrefText();
    single[e.consent] = state.consent ? "동의합니다" : "";

    const multi = {};
    multi[e.services] = state.services || [];

    const url = buildUrl(FORMS.consulting.base, single, multi);
    window.open(url, "_blank", "noopener,noreferrer");
}

// ============================================================
// 코칭 폼 열기
// ============================================================
function openCoaching(state) {
    const e = FORMS.coaching.entry;
    const single = {};
    single[e.name] = state.name;
    single[e.email] = state.email;
    single[e.phone] = state.phone || "";
    single[e.role] = state.role;
    single[e.industry] = state.industry;
    single[e.years] = state.years;
    single[e.type] = state.type;

    const multi = {};
    multi[e.topics] = state.topics || [];
    multi[e.availability] = state.availability || [];

    const url = buildUrl(FORMS.coaching.base, single, multi);
    window.open(url, "_blank", "noopener,noreferrer");
}

// ============================================================
// Google Sheets CSV URL (헤드헌터 데이터)
// ============================================================
const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/16QHDmZCrwEmeDLB8Nfuw5aUwlyfOAasTix_WIgh3me8/export?format=csv&gid=1700676662";

// ============================================================
// parseKeywords (고정 함수 - 변경 금지)
// ============================================================
function parseKeywords(raw) {
    if (!raw) return [];
    let s = String(raw);

    s = s
        .replace(/\s+and\s+/ig, ",")
        .replace(/및/g, ",")
        .replace(/[\/·\|&]/g, ",")
        .replace(/;/g, ",")
        .replace(/\s*,\s*/g, ",");

    const parts = s.split(",")
        .map(x => x.trim())
        .filter(Boolean);

    const normalized = parts.map(k => {
        const low = k.toLowerCase();
        if (low === "it") return "IT";
        if (low === "cosmetic" || low === "cosmetics" || k === "코스매틱") return "화장품";
        return k;
    });

    return [...new Set(normalized)];
}

// ============================================================
// stableHash: 같은 입력에 항상 같은 정수를 반환 (id 생성용)
// ============================================================
function stableHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h);
}

// ============================================================
// CSV 파싱 (RFC 4180 간소화 버전)
// ============================================================
function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    if (!lines.length) return [];

    const parseRow = (line) => {
        const cols = [];
        let cur = "";
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inQ) {
                if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
                else if (ch === '"') { inQ = false; }
                else { cur += ch; }
            } else {
                if (ch === '"') { inQ = true; }
                else if (ch === ',') { cols.push(cur); cur = ""; }
                else { cur += ch; }
            }
        }
        cols.push(cur);
        return cols;
    };

    const headers = parseRow(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = parseRow(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => { obj[h.trim()] = (cols[idx] || "").trim(); });
        rows.push(obj);
    }
    return rows;
}

// ============================================================
// 헤드헌터 전역 상태
// ============================================================
const hunterState = {
    none: false,
    rank1: null, rank2: null, rank3: null,
    names: {},          // id -> name
    all: [],            // 전체 헤드헌터 배열
    activeFilter: "전체",
    expanded: false,    // 더보기 상태
    searchQuery: ""     // 검색어
};

// ============================================================
// 셔플 (Fisher-Yates)
// ============================================================
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============================================================
// 이름 기준 정렬
// ============================================================
function sortByName(arr) {
    return [...arr].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

// ============================================================
// Google Sheets CSV 로딩 & 헤드헌터 초기화
// ============================================================
async function loadHeadhunters() {
    const container = document.getElementById("headhunter-list");
    try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const rows = parseCSV(text);

        // 컬럼 매핑 + keywords 파싱
        const hunters = rows
            .map(r => {
                const name = r["성명"] || "";
                const title = r["직급"] || "";
                const keywordsRaw = r["주요산업군"] || "";
                if (!name) return null;
                return {
                    id: stableHash(name + "|" + title + "|" + keywordsRaw),
                    name,
                    title,
                    keywords: parseKeywords(keywordsRaw)
                };
            })
            .filter(Boolean);

        hunters.forEach(hh => {
            hunterState.names[hh.id] = hh.name;
        });
        hunterState.all = hunters;

        // 필터 칩 렌더링 (실제 keywords에서 빌드)
        renderFilterChips();
        // 카드 렌더링
        renderHunterCards();

    } catch (err) {
        container.innerHTML = `<div class="hunter-loading">헤드헌터 정보를 불러올 수 없습니다. (${err.message})</div>`;
    }
}

// ============================================================
// 필터 칩 렌더링 (실제 keywords 기반)
// ============================================================
function renderFilterChips() {
    const wrap = document.getElementById("hunter-filter-chips");
    if (!wrap) return;

    // 전체 헤드헌터에서 unique 키워드 수집 -> 가나다 정렬
    const allKw = [...new Set(hunterState.all.flatMap(hh => hh.keywords))].sort((a, b) =>
        a.localeCompare(b, "ko")
    );

    const chips = ["전체", ...allKw];
    wrap.innerHTML = chips.map(label => {
        const active = label === hunterState.activeFilter ? "active" : "";
        // 싱글쿼트 이스케이프
        const safeLabel = label.replace(/'/g, "\\'");
        return `<button class="filter-chip ${active}" onclick="applyFilter('${safeLabel}')">${label}</button>`;
    }).join("");
}

// ============================================================
// 필터 적용 (expanded 리셋)
// ============================================================
function applyFilter(label) {
    hunterState.activeFilter = label;
    hunterState.expanded = false;
    renderFilterChips();
    renderHunterCards();
}

// ============================================================
// 카드 렌더링 (랜덤9 + 더보기/접기)
// ============================================================
function getBaseList() {
    const { all, activeFilter, searchQuery } = hunterState;

    let base = activeFilter === "전체"
        ? all
        : all.filter(hh => hh.keywords.includes(activeFilter));

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        base = base.filter(hh =>
            hh.name.toLowerCase().includes(q) ||
            hh.title.toLowerCase().includes(q) ||
            hh.keywords.some(k => k.toLowerCase().includes(q))
        );
    }
    return base;
}

function renderHunterCards() {
    const container = document.getElementById("headhunter-list");
    const moreBtn = document.getElementById("hunter-more-btn");

    const base = getBaseList();
    const isDefault = hunterState.activeFilter === "전체" && !hunterState.searchQuery;

    // 표시할 목록 결정
    let display;
    if (hunterState.expanded) {
        display = isDefault ? shuffle(base) : sortByName(base);
        if (moreBtn) { moreBtn.textContent = "접기"; moreBtn.style.display = ""; }
    } else {
        display = isDefault
            ? shuffle(base).slice(0, 9)
            : sortByName(base).slice(0, 9);
        if (moreBtn) { moreBtn.textContent = "더보기"; moreBtn.style.display = base.length > 9 ? "" : "none"; }
    }

    // 더보기 버튼 가시성
    if (moreBtn) {
        moreBtn.style.display = base.length > 9 ? "" : "none";
    }

    if (!display.length) {
        container.innerHTML = `<div class="hunter-loading">해당 조건의 헤드헌터를 준비 중입니다.</div>`;
        return;
    }

    container.innerHTML = "";
    display.forEach(hh => container.appendChild(createHunterCard(hh)));
    refreshHunterUI();
}

// ============================================================
// 더보기/접기 토글
// ============================================================
function toggleExpand() {
    hunterState.expanded = !hunterState.expanded;
    renderHunterCards();
}

// ============================================================
// 헤드헌터 카드 생성 (이름/직급 + 키워드 칩만 표시)
// ============================================================
function createHunterCard(hh) {
    const card = document.createElement("div");
    card.className = "hunter-card";
    card.dataset.id = hh.id;

    // 키워드 칩: 최대 6개, 초과분은 +N 표시
    const MAX_KW = 6;
    const kws = hh.keywords || [];
    const visible = kws.slice(0, MAX_KW);
    const overflow = kws.length - MAX_KW;

    const kwHtml = visible.map(k =>
        `<span class="hunter-kw-badge">${k}</span>`
    ).join("") + (overflow > 0 ? `<span class="hunter-kw-more">+${overflow}</span>` : "");

    card.innerHTML = `
    <div class="hunter-identity">
      <span class="hunter-name">${hh.name}</span>
      <span class="hunter-title">${hh.title}</span>
    </div>
    <div class="hunter-kw-badges">${kwHtml || '<span class="hunter-kw-badge">-</span>'}</div>
    <div class="hunter-btn-wrap">
      <button class="btn-hunter" data-id="${hh.id}" onclick="handleHunterClick(${hh.id}, this)">
        선택하기
      </button>
    </div>
  `;
    return card;
}



function handleHunterClick(id, btn) {
    // 무관 상태면 초기화 후 진행
    if (hunterState.none) {
        hunterState.none = false;
        document.getElementById("btn-no-preference").classList.remove("active");
    }

    // 이미 선택된 지망인지 확인 → 취소
    if (hunterState.rank1 === id) {
        hunterState.rank1 = null;
    } else if (hunterState.rank2 === id) {
        hunterState.rank2 = null;
    } else if (hunterState.rank3 === id) {
        hunterState.rank3 = null;
    } else {
        // 빈 슬롯에 배정
        if (!hunterState.rank1) hunterState.rank1 = id;
        else if (!hunterState.rank2) hunterState.rank2 = id;
        else if (!hunterState.rank3) hunterState.rank3 = id;
        else {
            // 3지망까지 꽉 참 → 알림
            alert("이미 1~3지망이 모두 선택되었습니다.\n기존 선택을 취소하려면 해당 버튼을 다시 클릭하세요.");
            return;
        }
    }

    refreshHunterUI();
}

function toggleNoPreference() {
    hunterState.none = !hunterState.none;
    if (hunterState.none) {
        hunterState.rank1 = null;
        hunterState.rank2 = null;
        hunterState.rank3 = null;
    }
    refreshHunterUI();
}

function refreshHunterUI() {
    const noBtn = document.getElementById("btn-no-preference");
    noBtn.classList.toggle("active", hunterState.none);
    noBtn.textContent = hunterState.none ? "✓ 무관 선택됨" : "헤드헌터 무관";

    // 모든 카드 업데이트
    document.querySelectorAll(".hunter-card").forEach(card => {
        const id = parseInt(card.dataset.id);
        const btn = card.querySelector(".btn-hunter");
        card.classList.remove("selected-1", "selected-2", "selected-3");
        btn.classList.remove("rank-1", "rank-2", "rank-3");

        if (hunterState.none) {
            btn.disabled = true;
            btn.textContent = "선택하기";
            return;
        }
        btn.disabled = false;

        if (hunterState.rank1 === id) {
            card.classList.add("selected-1");
            btn.classList.add("rank-1");
            btn.textContent = "1지망 ✓";
        } else if (hunterState.rank2 === id) {
            card.classList.add("selected-2");
            btn.classList.add("rank-2");
            btn.textContent = "2지망 ✓";
        } else if (hunterState.rank3 === id) {
            card.classList.add("selected-3");
            btn.classList.add("rank-3");
            btn.textContent = "3지망 ✓";
        } else {
            btn.textContent = "선택하기";
        }
    });

    // 요약 표시
    const summary = document.getElementById("hunter-summary");
    const summaryText = document.getElementById("hunter-summary-text");
    const hasSelection = hunterState.none || hunterState.rank1 || hunterState.rank2 || hunterState.rank3;

    if (hasSelection) {
        summary.classList.remove("hidden");
        summaryText.textContent = hunterPrefText();
    } else {
        summary.classList.add("hidden");
    }

    // 모달 내 헤드헌터 표시 업데이트
    const display = document.getElementById("c-hunter-display");
    if (display) display.value = hunterPrefText();
}

// ============================================================
// 모달 열기/닫기
// ============================================================
function openConsultingModal(preService = null, prePackage = null) {
    const modal = document.getElementById("modal-consulting");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // 헤드헌터 선호 자동 반영
    const hunterDisplay = document.getElementById("c-hunter-display");
    if (hunterDisplay) hunterDisplay.value = hunterPrefText();

    // 서비스 미리 선택
    if (preService) {
        document.querySelectorAll("input[name='c-services']").forEach(cb => {
            cb.checked = cb.value === preService;
        });
    }

    // 패키지 미리 선택
    if (prePackage) {
        document.querySelectorAll("input[name='c-package']").forEach(r => {
            r.checked = r.value === prePackage;
        });
        // 서비스 체크 해제
        document.querySelectorAll("input[name='c-services']").forEach(cb => cb.checked = false);
    }

    updateConsultingSummary();
}

function openCoachingModal() {
    const modal = document.getElementById("modal-coaching");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    updateCoachingSummary();
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
    document.body.style.overflow = "";
    clearErrors(id);
}

// ESC 키로 닫기
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal("modal-consulting");
        closeModal("modal-coaching");
    }
});

// 오버레이 클릭 닫기
document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            closeModal(overlay.id);
        }
    });
});

// ============================================================
// 헌터 있음/없음 토글
// ============================================================
function toggleHunterInput(form) {
    if (form === 'consulting') {
        const yn = (document.querySelector("input[name='c-hunter-yn']:checked") || {}).value;
        const wrap = document.getElementById('c-hunter-input-wrap');
        if (wrap) wrap.style.display = (yn === '있음') ? '' : 'none';
    }
    updateConsultingSummary();
}

// ============================================================
// 컨설팅 검증 & 제출
// ============================================================
function getConsultingState() {
    const industryMain = (document.getElementById('c-industry-main') || {}).value || '';
    const industrySub = (document.getElementById('c-industry-sub') || {}).value.trim() || '';
    const industryLabel = industryMain
        ? (industrySub ? `${industryMain} > ${industrySub}` : industryMain)
        : '';

    const hunterYn = (document.querySelector("input[name='c-hunter-yn']:checked") || {}).value || '없음';
    const hunterName = (document.getElementById('c-hunter-name') || {}).value.trim() || '';
    const hunterPref = hunterYn === '있음' && hunterName ? hunterName : '없음';

    return {
        name: document.getElementById('c-name').value.trim(),
        email: document.getElementById('c-email').value.trim(),
        phone: document.getElementById('c-phone').value.trim(),
        services: Array.from(document.querySelectorAll("input[name='c-services']:checked")).map(c => c.value),
        package: (document.querySelector("input[name='c-package']:checked") || {}).value || '',
        industryMain,
        industrySub,
        industryLabel,
        hunterYn,
        hunterName,
        hunterPref,
        consent: document.getElementById('c-consent').checked
    };
}

function validateConsulting(state) {
    let ok = true;
    clearErrors('modal-consulting');

    if (!state.name) {
        showError('err-c-name', '이름을 입력해주세요.');
        ok = false;
    }
    if (!state.email && !state.phone) {
        showError('err-c-contact', '이메일 또는 휴대폰 중 하나를 입력해주세요.');
        ok = false;
    }
    if (state.services.length === 0 && !state.package) {
        showError('err-c-services', '서비스 또는 패키지를 최소 1개 선택해주세요.');
        ok = false;
    }
    // 산업군 필수
    if (!state.industryMain) {
        showError('err-c-industry', '콘설팅 신청은 산업군 선택이 필수입니다.');
        ok = false;
    }
    if (!state.consent) {
        showError('err-c-consent', '개인정보 수집 및 이용에 동의해주세요.');
        ok = false;
    }
    return ok;
}

function submitConsulting() {
    const state = getConsultingState();
    if (!validateConsulting(state)) return;
    openConsulting(state);
}

// ============================================================
// 코칭 검증 & 제출
// ============================================================
function getCoachingState() {
    const industryLabel = getCoachingIndustryLabel();
    // Google Forms entry 호환용 hidden input 동기화
    const hiddenInd = document.getElementById('p-industry');
    if (hiddenInd) hiddenInd.value = industryLabel;

    return {
        name: document.getElementById('p-name').value.trim(),
        email: document.getElementById('p-email').value.trim(),
        phone: document.getElementById('p-phone').value.trim(),
        role: document.getElementById('p-role').value.trim(),
        industry: industryLabel,
        years: document.getElementById('p-years').value.trim(),
        topics: Array.from(document.querySelectorAll("input[name='p-topics']:checked")).map(c => c.value),
        availability: Array.from(document.querySelectorAll("input[name='p-availability']:checked")).map(c => c.value),
        type: (document.querySelector("input[name='p-type']:checked") || {}).value || ''
    };
}

function getCoachingIndustryLabel() {
    const main = (document.getElementById('p-industry-main') || {}).value || '';
    const sub = ((document.getElementById('p-industry-sub') || {}).value || '').trim();
    return main ? (sub ? `${main} > ${sub}` : main) : '';
}

function validateCoaching(state) {
    let ok = true;
    clearErrors('modal-coaching');

    if (!state.name) { showError('err-p-name', '이름을 입력해주세요.'); ok = false; }
    if (!state.email) { showError('err-p-email', '이메일을 입력해주세요.'); ok = false; }
    if (!state.role) { showError('err-p-role', '직무/분야를 입력해주세요.'); ok = false; }
    // 산업군 선택 → 검증 없음 (optional)
    if (!state.years) { showError('err-p-years', '경력 연차를 입력해주세요.'); ok = false; }
    if (state.topics.length === 0) { showError('err-p-topics', '코칭 주제를 최소 1개 선택해주세요.'); ok = false; }
    if (state.availability.length === 0) { showError('err-p-availability', '가능 시간대를 최소 1개 선택해주세요.'); ok = false; }
    if (!state.type) { showError('err-p-type', '코칭 형태를 선택해주세요.'); ok = false; }
    return ok;
}


function submitCoaching() {
    const state = getCoachingState();
    if (!validateCoaching(state)) return;
    openCoaching(state);
}

// ============================================================
// 요약 텍스트 업데이트
// ============================================================
function updateConsultingSummary() {
    const state = getConsultingState();
    const lines = [];
    if (state.name) lines.push(`이름: ${state.name}`);
    if (state.email) lines.push(`이메일: ${state.email}`);
    if (state.phone) lines.push(`휴대폰: ${state.phone}`);
    if (state.services.length) lines.push(`서비스: ${state.services.join(', ')}`);
    if (state.package) lines.push(`패키지: ${state.package}`);
    lines.push(`선택 산업군: ${state.industryLabel || '미선택'}`);
    lines.push(`희망 헤드헌터: ${state.hunterPref}`);
    lines.push(`개인정보동의: ${state.consent ? '동의' : '미동의'}`);
    const el = document.getElementById('c-summary');
    if (el) el.value = lines.join('\n');
}

function updateCoachingSummary() {
    const state = getCoachingState();
    const lines = [];
    if (state.name) lines.push(`이름: ${state.name}`);
    if (state.email) lines.push(`이메일: ${state.email}`);
    if (state.phone) lines.push(`휴대폰: ${state.phone}`);
    if (state.role) lines.push(`직무: ${state.role}`);
    lines.push(`선택 산업군: ${state.industry || '미선택'}`);
    if (state.years) lines.push(`연차: ${state.years}`);
    if (state.topics.length) lines.push(`코칭주제: ${state.topics.join(', ')}`);
    if (state.availability.length) lines.push(`가능시간: ${state.availability.join(', ')}`);
    if (state.type) lines.push(`코칭형태: ${state.type}`);
    const el = document.getElementById('p-summary');
    if (el) el.value = lines.join('\n');
}

// ============================================================
// 요약 복사
// ============================================================
async function copySummary(textareaId) {
    const ta = document.getElementById(textareaId);
    if (!ta || !ta.value) return;
    try {
        await navigator.clipboard.writeText(ta.value);
        showCopyFeedback(ta);
    } catch {
        ta.select();
        ta.setSelectionRange(0, 99999);
        try { document.execCommand("copy"); showCopyFeedback(ta); }
        catch { alert("자동 복사에 실패했습니다. 텍스트를 직접 선택하여 복사해주세요."); }
    }
}

function showCopyFeedback(ta) {
    const btn = ta.closest(".summary-box").querySelector(".btn-secondary");
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = "✓ 복사됨";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2000);
}

// ============================================================
// 에러 표시/초기화
// ============================================================
function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}

function clearErrors(modalId) {
    document.getElementById(modalId).querySelectorAll(".form-error").forEach(el => el.textContent = "");
}

// ============================================================
// 아코디언
// ============================================================
function initAccordions() {
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const item = header.closest(".accordion-item");
            const content = item.querySelector(".accordion-content");
            const isOpen = header.classList.contains("active");

            // 같은 아코디언 내 다른 항목 닫기 (옵션: 주석 해제 시 동작)
            // item.closest(".accordion").querySelectorAll(".accordion-item").forEach(i => {
            //   i.querySelector(".accordion-header").classList.remove("active");
            //   i.querySelector(".accordion-content").classList.remove("active");
            // });

            header.classList.toggle("active", !isOpen);
            content.classList.toggle("active", !isOpen);
        });
    });
}

// ============================================================
// 실시간 요약 업데이트 (모달 내 입력 변경 시)
// ============================================================
function initLiveUpdates() {
    const consultingModal = document.getElementById("modal-consulting");
    const coachingModal = document.getElementById("modal-coaching");

    if (consultingModal) {
        consultingModal.addEventListener("change", () => {
            updateConsultingSummary();
            // 헤드헌터 선호도 갱신
            const display = document.getElementById("c-hunter-display");
            if (display) display.value = hunterPrefText();
        });
        consultingModal.addEventListener("input", updateConsultingSummary);
    }
    if (coachingModal) {
        coachingModal.addEventListener("change", updateCoachingSummary);
        coachingModal.addEventListener("input", updateCoachingSummary);
    }
}

// ============================================================
// 앵커 스무스 스크롤 (헤더 높이 보정)
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

// ============================================================
// DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    loadHeadhunters();
    initAccordions();
    initLiveUpdates();
    initSmoothScroll();
});
