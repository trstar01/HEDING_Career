/* ===========================================
   HEDING - script.js
   Google Forms 자동채움 완전판 (fetch 없음)
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
            topics: "entry.1504440615",    // append 복수
            availability: "entry.478213786", // append 복수
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

    Object.entries(single || {}).forEach(([k, v]) => {
        const s = String(v ?? "").trim();
        if (s) params.set(k, s);
    });

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
// 컨설팅 폼 열기 (Google Forms URL 생성)
// ============================================================
function openConsulting(state) {
    const e = FORMS.consulting.entry;
    const single = {};
    single[e.name] = state.name;
    single[e.email] = state.email || "";
    single[e.phone] = state.phone || "";
    single[e.package] = state.package || "";
    single[e.hunterPref] = state.hunterPref || "지정하지 않음";
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
// 헌터 지정 입력 토글 (있음/없음 → 지정하지 않음/이름을 알고 있어요)
// ============================================================
function toggleHunterInput(form) {
    if (form === 'consulting') {
        const yn = (document.querySelector("input[name='c-hunter-yn']:checked") || {}).value || '';
        const wrap = document.getElementById('c-hunter-input-wrap');
        if (wrap) wrap.style.display = (yn === '이름을 알고 있어요') ? '' : 'none';
    }
    updateConsultingSummary();
}

// ============================================================
// 모달 열기/닫기
// ============================================================
function openConsultingModal(preService = null, prePackage = null) {
    const modal = document.getElementById("modal-consulting");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    if (preService) {
        document.querySelectorAll("input[name='c-services']").forEach(cb => {
            cb.checked = cb.value === preService;
        });
    }
    if (prePackage) {
        document.querySelectorAll("input[name='c-package']").forEach(r => {
            r.checked = r.value === prePackage;
        });
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

// ESC 닫기
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal("modal-consulting");
        closeModal("modal-coaching");
    }
});

// 오버레이 클릭 닫기
document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

// ============================================================
// 컨설팅 상태 수집
// ============================================================
function getConsultingState() {
    const industryMain = (document.getElementById('c-industry-main') || {}).value || '';
    const industrySub = ((document.getElementById('c-industry-sub') || {}).value || '').trim();
    const industryLabel = industryMain
        ? (industrySub ? `${industryMain} > ${industrySub}` : industryMain)
        : '';

    const hunterYn = (document.querySelector("input[name='c-hunter-yn']:checked") || {}).value || '지정하지 않음';
    const hunterName = ((document.getElementById('c-hunter-name') || {}).value || '').trim();
    const hunterPref = (hunterYn === '이름을 알고 있어요' && hunterName) ? hunterName : '지정하지 않음';

    return {
        name: (document.getElementById('c-name') || {}).value?.trim() || '',
        email: (document.getElementById('c-email') || {}).value?.trim() || '',
        phone: (document.getElementById('c-phone') || {}).value?.trim() || '',
        services: Array.from(document.querySelectorAll("input[name='c-services']:checked")).map(c => c.value),
        package: (document.querySelector("input[name='c-package']:checked") || {}).value || '',
        industryMain,
        industrySub,
        industryLabel,
        hunterYn,
        hunterName,
        hunterPref,
        consent: (document.getElementById('c-consent') || {}).checked || false
    };
}

// ============================================================
// 컨설팅 검증
// ============================================================
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
    if (!state.industryMain) {
        showError('err-c-industry', '컨설팅 신청은 전문분야(산업군) 선택이 필수입니다.');
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
// 코칭 상태 수집 & 검증
// ============================================================
function getCoachingIndustryLabel() {
    const main = (document.getElementById('p-industry-main') || {}).value || '';
    const sub = ((document.getElementById('p-industry-sub') || {}).value || '').trim();
    return main ? (sub ? `${main} > ${sub}` : main) : '';
}

function getCoachingState() {
    const industryLabel = getCoachingIndustryLabel();
    const hiddenInd = document.getElementById('p-industry');
    if (hiddenInd) hiddenInd.value = industryLabel;

    return {
        name: (document.getElementById('p-name') || {}).value?.trim() || '',
        email: (document.getElementById('p-email') || {}).value?.trim() || '',
        phone: (document.getElementById('p-phone') || {}).value?.trim() || '',
        role: (document.getElementById('p-role') || {}).value?.trim() || '',
        industry: industryLabel,
        years: (document.getElementById('p-years') || {}).value?.trim() || '',
        topics: Array.from(document.querySelectorAll("input[name='p-topics']:checked")).map(c => c.value),
        availability: Array.from(document.querySelectorAll("input[name='p-availability']:checked")).map(c => c.value),
        type: (document.querySelector("input[name='p-type']:checked") || {}).value || ''
    };
}

function validateCoaching(state) {
    let ok = true;
    clearErrors('modal-coaching');

    if (!state.name) { showError('err-p-name', '이름을 입력해주세요.'); ok = false; }
    if (!state.email) { showError('err-p-email', '이메일을 입력해주세요.'); ok = false; }
    if (!state.role) { showError('err-p-role', '직무/분야를 입력해주세요.'); ok = false; }
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
// 요약 텍스트
// ============================================================
function updateConsultingSummary() {
    const state = getConsultingState();
    const lines = [];
    if (state.name) lines.push(`이름: ${state.name}`);
    if (state.email) lines.push(`이메일: ${state.email}`);
    if (state.phone) lines.push(`휴대폰: ${state.phone}`);
    if (state.services.length) lines.push(`서비스: ${state.services.join(', ')}`);
    if (state.package) lines.push(`패키지: ${state.package}`);
    lines.push(`선택 전문분야(산업군): ${state.industryLabel || '미선택'}`);
    lines.push(`소속 헤드헌터 지정: ${state.hunterPref}`);
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
    lines.push(`선택 전문분야(산업군): ${state.industry || '미선택'}`);
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
    const modal = document.getElementById(modalId);
    if (modal) modal.querySelectorAll(".form-error").forEach(el => el.textContent = "");
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
            header.classList.toggle("active", !isOpen);
            content.classList.toggle("active", !isOpen);
        });
    });
}

// ============================================================
// 실시간 요약 업데이트
// ============================================================
function initLiveUpdates() {
    const cm = document.getElementById("modal-consulting");
    const pm = document.getElementById("modal-coaching");
    if (cm) {
        cm.addEventListener("change", updateConsultingSummary);
        cm.addEventListener("input", updateConsultingSummary);
    }
    if (pm) {
        pm.addEventListener("change", updateCoachingSummary);
        pm.addEventListener("input", updateCoachingSummary);
    }
}

// ============================================================
// Section 6 ↔ 컨설팅 모달 동기화
// ============================================================
// 섹션에서 산업군을 선택하면 모달 필드에도 자동 반영
function syncSpecialty() {
    const sMain = (document.getElementById('s-industry-main') || {}).value || '';
    const sSub = ((document.getElementById('s-industry-sub') || {}).value || '').trim();
    const sName = ((document.getElementById('s-hunter-name') || {}).value || '').trim();

    // 모달 산업군 동기화
    const cMain = document.getElementById('c-industry-main');
    const cSub = document.getElementById('c-industry-sub');
    if (cMain && sMain) cMain.value = sMain;
    if (cSub) cSub.value = sSub;

    // 모달 헌터 이름 동기화
    const cName = document.getElementById('c-hunter-name');
    if (cName && sName) cName.value = sName;
}

// 섹션 헌터 있음/없음 토글
function syncHunterYn() {
    const yn = (document.querySelector("input[name='s-hunter-yn']:checked") || {}).value || '';
    const wrap = document.getElementById('s-hunter-input-wrap');
    if (wrap) wrap.style.display = (yn === '이름을 알고 있어요') ? '' : 'none';

    // 모달 라디오도 동기화
    const cRadio = document.querySelector(`input[name='c-hunter-yn'][value='${yn}']`);
    if (cRadio) cRadio.checked = true;

    const cWrap = document.getElementById('c-hunter-input-wrap');
    if (cWrap) cWrap.style.display = (yn === '이름을 알고 있어요') ? '' : 'none';
}


// ============================================================
// 앵커 스무스 스크롤
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
// DOMContentLoaded (fetch 없음)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    initAccordions();
    initLiveUpdates();
    initSmoothScroll();
});
