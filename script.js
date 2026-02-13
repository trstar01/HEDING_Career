// =============================================
// HEDING 커리어 컨설팅 랜딩페이지 - JavaScript
// =============================================

// =============================================
// Headhunter Data (더미 데이터)
// =============================================
const headhunters = [
    {
        id: 1,
        name: "김민준",
        photo: "https://i.pravatar.cc/150?img=12",
        tags: ["IT/Tech", "스타트업", "Growth"],
        bio: "네이버, 카카오 등 IT 대기업과 유니콘 스타트업에서 10년간 개발자·PM 채용을 담당했습니다. 테크 인재의 커리어 성장 전략에 특화되어 있습니다."
    },
    {
        id: 2,
        name: "이서연",
        photo: "https://i.pravatar.cc/150?img=5",
        tags: ["금융", "컨설팅", "전략"],
        bio: "골드만삭스, 맥킨지 등 글로벌 금융·컨설팅 업계 경력자 전문 헤드헌터입니다. MBA 출신 대상 커리어 전환 코칭 경험이 풍부합니다."
    },
    {
        id: 3,
        name: "박준호",
        photo: "https://i.pravatar.cc/150?img=33",
        tags: ["제조", "엔지니어링", "R&D"],
        bio: "삼성전자, LG, 현대차 등 제조업 R&D 조직 채용 전문가입니다. 엔지니어 출신으로 기술 인재의 커리어 고민을 깊이 이해합니다."
    },
    {
        id: 4,
        name: "최지우",
        photo: "https://i.pravatar.cc/150?img=9",
        tags: ["마케팅", "브랜딩", "커머스"],
        bio: "쿠팡, 무신사, 29CM 등 이커머스 업계에서 마케팅·브랜딩 직군 채용 8년 경력. 디지털 마케터의 커리어 전략 수립을 돕습니다."
    },
    {
        id: 5,
        name: "정태영",
        photo: "https://i.pravatar.cc/150?img=52",
        tags: ["세일즈", "비즈니스개발", "B2B"],
        bio: "세일즈포스, 오라클 등 글로벌 SaaS 기업에서 B2B 세일즈 조직을 구축한 경험이 있습니다. 영업 직군의 연봉 협상 전문가입니다."
    },
    {
        id: 6,
        name: "한소희",
        photo: "https://i.pravatar.cc/150?img=25",
        tags: ["디자인", "UX/UI", "크리에이티브"],
        bio: "당근마켓, 토스 등 프로덕트 중심 조직에서 디자이너 채용을 담당했습니다. 포트폴리오 리뷰와 디자인 커리어 성장 조언이 강점입니다."
    },
    {
        id: 7,
        name: "오성민",
        photo: "https://i.pravatar.cc/150?img=68",
        tags: ["HR", "조직문화", "People"],
        bio: "배달의민족, 직방 등에서 People 팀을 이끌었습니다. HR 직군으로의 전환과 조직문화 전문가 양성에 관심이 많습니다."
    }
];

// =============================================
// Global State
// =============================================
const state = {
    selectedHeadhunters: {
        first: null,
        second: null,
        third: null
    },
    noPreference: false
};

// =============================================
// Initialize App
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    renderHeadhunters();
    initHeadhunterSelection();
    initCustomerForm();
    initCoachForm();
});

// =============================================
// Accordion Functionality
// =============================================
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isActive = header.classList.contains('active');
            const content = header.nextElementSibling;

            // Toggle active state
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
}

// =============================================
// Headhunter Rendering
// =============================================
function renderHeadhunters() {
    const container = document.getElementById('headhunter-list');

    headhunters.forEach(hh => {
        const card = document.createElement('div');
        card.className = 'card headhunter-card';
        card.dataset.id = hh.id;

        card.innerHTML = `
      <img src="${hh.photo}" alt="${hh.name}" class="headhunter-photo">
      <h4 class="headhunter-name">${hh.name}</h4>
      <div class="headhunter-tags">
        ${hh.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="headhunter-bio">${hh.bio}</p>
      <button class="btn btn-select" data-hh-id="${hh.id}">1지망 선택</button>
    `;

        container.appendChild(card);
    });
}

// =============================================
// Headhunter Selection Logic
// =============================================
function initHeadhunterSelection() {
    const container = document.getElementById('headhunter-list');
    const noPreferenceBtn = document.getElementById('btn-no-preference');
    const summaryDiv = document.getElementById('selection-summary');
    const summaryText = document.getElementById('summary-text');

    // Handle headhunter selection
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-select')) {
            const hhId = parseInt(e.target.dataset.hhId);
            handleHeadhunterClick(hhId);
            updateUI();
            updateSummary();
        }
    });

    // Handle "no preference" button
    noPreferenceBtn.addEventListener('click', () => {
        state.noPreference = !state.noPreference;

        if (state.noPreference) {
            // Clear all selections
            state.selectedHeadhunters.first = null;
            state.selectedHeadhunters.second = null;
            state.selectedHeadhunters.third = null;
            noPreferenceBtn.classList.add('btn-primary');
            noPreferenceBtn.classList.remove('btn-secondary');
            noPreferenceBtn.textContent = '무관 선택됨 (취소하려면 클릭)';
        } else {
            noPreferenceBtn.classList.remove('btn-primary');
            noPreferenceBtn.classList.add('btn-secondary');
            noPreferenceBtn.textContent = '헤드헌터 무관';
        }

        updateUI();
        updateSummary();
    });

    function handleHeadhunterClick(hhId) {
        // If no preference is selected, clear it first
        if (state.noPreference) {
            state.noPreference = false;
            noPreferenceBtn.classList.remove('btn-primary');
            noPreferenceBtn.classList.add('btn-secondary');
            noPreferenceBtn.textContent = '헤드헌터 무관';
        }

        // Check if already selected
        if (state.selectedHeadhunters.first === hhId) {
            state.selectedHeadhunters.first = null;
        } else if (state.selectedHeadhunters.second === hhId) {
            state.selectedHeadhunters.second = null;
        } else if (state.selectedHeadhunters.third === hhId) {
            state.selectedHeadhunters.third = null;
        } else {
            // Add to next available slot
            if (state.selectedHeadhunters.first === null) {
                state.selectedHeadhunters.first = hhId;
            } else if (state.selectedHeadhunters.second === null) {
                state.selectedHeadhunters.second = hhId;
            } else if (state.selectedHeadhunters.third === null) {
                state.selectedHeadhunters.third = hhId;
            } else {
                // All slots filled, replace third
                state.selectedHeadhunters.third = hhId;
            }
        }
    }

    function updateUI() {
        const buttons = container.querySelectorAll('.btn-select');

        buttons.forEach(btn => {
            const hhId = parseInt(btn.dataset.hhId);

            // Reset classes
            btn.classList.remove('selected-1', 'selected-2', 'selected-3');

            if (state.noPreference) {
                btn.disabled = true;
                btn.textContent = '1지망 선택';
            } else {
                btn.disabled = false;

                if (state.selectedHeadhunters.first === hhId) {
                    btn.classList.add('selected-1');
                    btn.textContent = '1지망 선택됨';
                } else if (state.selectedHeadhunters.second === hhId) {
                    btn.classList.add('selected-2');
                    btn.textContent = '2지망 선택됨';
                } else if (state.selectedHeadhunters.third === hhId) {
                    btn.classList.add('selected-3');
                    btn.textContent = '3지망 선택됨';
                } else {
                    btn.textContent = '선택하기';

                    // Disable if all slots are filled
                    const allFilled = state.selectedHeadhunters.first !== null &&
                        state.selectedHeadhunters.second !== null &&
                        state.selectedHeadhunters.third !== null;
                    btn.disabled = allFilled;
                }
            }
        });
    }

    function updateSummary() {
        const hasSelection = state.noPreference ||
            state.selectedHeadhunters.first !== null ||
            state.selectedHeadhunters.second !== null ||
            state.selectedHeadhunters.third !== null;

        if (!hasSelection) {
            summaryDiv.style.display = 'none';
            return;
        }

        summaryDiv.style.display = 'block';

        if (state.noPreference) {
            summaryText.innerHTML = '<strong>헤드헌터 무관</strong> - 가장 적합한 헤드헌터를 자동으로 매칭해드립니다.';
            return;
        }

        const lines = [];

        if (state.selectedHeadhunters.first !== null) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.first);
            lines.push(`<strong>1지망:</strong> ${hh.name}`);
        }

        if (state.selectedHeadhunters.second !== null) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.second);
            lines.push(`<strong>2지망:</strong> ${hh.name}`);
        }

        if (state.selectedHeadhunters.third !== null) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.third);
            lines.push(`<strong>3지망:</strong> ${hh.name}`);
        }

        summaryText.innerHTML = lines.join('<br>');
    }
}

// =============================================
// Customer Form Validation & Submission
// =============================================
function initCustomerForm() {
    const form = document.getElementById('customer-form');
    const resultDiv = document.getElementById('customer-form-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Validate form
        const isValid = validateCustomerForm();

        if (!isValid) {
            return;
        }

        // Collect form data
        const formData = collectCustomerFormData();

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '제출 중...';

        try {
            // Submit to backend (Google Sheets Apps Script)
            // Replace with your actual Apps Script URL
            const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

            // For demo purposes, simulate a successful submission
            await simulateSubmission(formData);

            // Show success message
            showResult(resultDiv, 'success', `
        <h3>신청이 완료되었습니다! 🎉</h3>
        <p>24~48시간 내에 헤드헌터 매칭 결과를 이메일 또는 휴대폰으로 안내드립니다.</p>
        <p>매칭 확정 후 계좌번호와 입금 금액을 별도로 안내해드립니다.</p>
        <p><strong>문의:</strong> contact@heding.co.kr</p>
      `);

            // Reset form
            form.reset();
            state.selectedHeadhunters.first = null;
            state.selectedHeadhunters.second = null;
            state.selectedHeadhunters.third = null;
            state.noPreference = false;

            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            showResult(resultDiv, 'error', `
        <h3>제출 실패</h3>
        <p>죄송합니다. 일시적인 오류가 발생했습니다.</p>
        <p>잠시 후 다시 시도해주시거나 contact@heding.co.kr로 문의해주세요.</p>
      `);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function validateCustomerForm() {
    let isValid = true;

    // Name
    const name = document.getElementById('name').value.trim();
    if (!name) {
        showError('name', '이름을 입력해주세요.');
        isValid = false;
    }

    // Email or Phone (at least one)
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!email && !phone) {
        showError('email', '이메일 또는 휴대폰 중 하나는 필수입니다.');
        showError('phone', '이메일 또는 휴대폰 중 하나는 필수입니다.');
        isValid = false;
    }

    // Services or Package
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked'));
    const packageSelected = document.querySelector('input[name="package"]:checked');
    if (services.length === 0 && !packageSelected) {
        showError('services', '서비스 또는 패키지를 선택해주세요.');
        isValid = false;
    }

    // Current role
    const currentRole = document.getElementById('current-role').value.trim();
    if (!currentRole) {
        showError('current-role', '현재 직무 및 연차를 입력해주세요.');
        isValid = false;
    }

    // Goals
    const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'));
    if (goals.length === 0) {
        showError('goals', '최소 1개 이상의 목표를 선택해주세요.');
        isValid = false;
    }

    // Headhunter preference (required)
    const hasHeadhunterSelection = state.noPreference ||
        state.selectedHeadhunters.first !== null ||
        state.selectedHeadhunters.second !== null ||
        state.selectedHeadhunters.third !== null;

    if (!hasHeadhunterSelection) {
        alert('헤드헌터 선택 섹션에서 1~3지망을 선택하시거나 "무관" 버튼을 클릭해주세요.');
        isValid = false;
    }

    // Privacy agreement
    const privacyAgree = document.getElementById('privacy-agree').checked;
    if (!privacyAgree) {
        showError('privacy', '개인정보 수집 및 이용에 동의해주세요.');
        isValid = false;
    }

    return isValid;
}

function collectCustomerFormData() {
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(cb => cb.value);
    const packageSelected = document.querySelector('input[name="package"]:checked');
    const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
        .map(cb => cb.value);

    // Get headhunter preferences
    let headhunterPreference = '';
    if (state.noPreference) {
        headhunterPreference = '무관';
    } else {
        const prefs = [];
        if (state.selectedHeadhunters.first) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.first);
            prefs.push(`1지망: ${hh.name}`);
        }
        if (state.selectedHeadhunters.second) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.second);
            prefs.push(`2지망: ${hh.name}`);
        }
        if (state.selectedHeadhunters.third) {
            const hh = headhunters.find(h => h.id === state.selectedHeadhunters.third);
            prefs.push(`3지망: ${hh.name}`);
        }
        headhunterPreference = prefs.join(', ');
    }

    return {
        type: 'customer',
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        services: services.join(', '),
        package: packageSelected ? packageSelected.value : '',
        currentRole: document.getElementById('current-role').value.trim(),
        goals: goals.join(', '),
        headhunterPreference: headhunterPreference,
        resumeLink: document.getElementById('resume-link').value.trim(),
        preferredTime: document.getElementById('preferred-time').value,
        memo: document.getElementById('memo').value.trim(),
        timestamp: new Date().toISOString(),
        // UTM parameters (if available)
        utm: collectUTMParams()
    };
}

// =============================================
// Coach Form Validation & Submission
// =============================================
function initCoachForm() {
    const form = document.getElementById('coach-form');
    const resultDiv = document.getElementById('coach-form-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearCoachErrors();

        // Validate form
        const isValid = validateCoachForm();

        if (!isValid) {
            return;
        }

        // Collect form data
        const formData = collectCoachFormData();

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '제출 중...';

        try {
            // Submit to backend
            await simulateSubmission(formData);

            // Show success message
            showResult(resultDiv, 'success', `
        <h3>지원이 완료되었습니다! 🎉</h3>
        <p>제출하신 정보를 검토한 후 영업일 기준 3일 이내에 연락드리겠습니다.</p>
        <p>HEDING 코치로 함께해주셔서 감사합니다!</p>
        <p><strong>문의:</strong> contact@heding.co.kr</p>
      `);

            // Reset form
            form.reset();

            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            showResult(resultDiv, 'error', `
        <h3>제출 실패</h3>
        <p>죄송합니다. 일시적인 오류가 발생했습니다.</p>
        <p>잠시 후 다시 시도해주시거나 contact@heding.co.kr로 문의해주세요.</p>
      `);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function validateCoachForm() {
    let isValid = true;

    // Name
    const name = document.getElementById('coach-name').value.trim();
    if (!name) {
        showCoachError('coach-name', '이름을 입력해주세요.');
        isValid = false;
    }

    // Contact
    const contact = document.getElementById('coach-contact').value.trim();
    if (!contact) {
        showCoachError('coach-contact', '연락처를 입력해주세요.');
        isValid = false;
    }

    // Role
    const role = document.getElementById('coach-role').value.trim();
    if (!role) {
        showCoachError('coach-role', '현직 직무 및 산업을 입력해주세요.');
        isValid = false;
    }

    // Experience
    const experience = document.getElementById('coach-experience').value;
    if (!experience) {
        showCoachError('coach-experience', '경력 연차를 선택해주세요.');
        isValid = false;
    }

    // Expertise
    const expertise = Array.from(document.querySelectorAll('input[name="expertise"]:checked'));
    if (expertise.length === 0) {
        showCoachError('expertise', '최소 1개 이상의 전문 분야를 선택해주세요.');
        isValid = false;
    }

    // Availability
    const availability = document.getElementById('coach-availability').value.trim();
    if (!availability) {
        showCoachError('coach-availability', '가능한 요일 및 시간대를 입력해주세요.');
        isValid = false;
    }

    // Coaching type
    const coachingType = document.querySelector('input[name="coaching-type"]:checked');
    if (!coachingType) {
        showCoachError('coaching-type', '코칭 형태를 선택해주세요.');
        isValid = false;
    }

    // Privacy agreement
    const privacyAgree = document.getElementById('coach-privacy-agree').checked;
    if (!privacyAgree) {
        showCoachError('coach-privacy', '개인정보 수집 및 이용에 동의해주세요.');
        isValid = false;
    }

    return isValid;
}

function collectCoachFormData() {
    const expertise = Array.from(document.querySelectorAll('input[name="expertise"]:checked'))
        .map(cb => cb.value);
    const coachingType = document.querySelector('input[name="coaching-type"]:checked');

    return {
        type: 'coach',
        name: document.getElementById('coach-name').value.trim(),
        contact: document.getElementById('coach-contact').value.trim(),
        role: document.getElementById('coach-role').value.trim(),
        experience: document.getElementById('coach-experience').value,
        expertise: expertise.join(', '),
        availability: document.getElementById('coach-availability').value.trim(),
        coachingType: coachingType ? coachingType.value : '',
        portfolio: document.getElementById('coach-portfolio').value.trim(),
        rate: document.getElementById('coach-rate').value.trim(),
        pastExperience: document.getElementById('coach-past-experience').value.trim(),
        timestamp: new Date().toISOString()
    };
}

// =============================================
// Utility Functions
// =============================================
function showError(fieldName, message) {
    const errorEl = document.getElementById(`error-${fieldName}`);
    const inputEl = document.getElementById(fieldName);

    if (errorEl) {
        errorEl.textContent = message;
    }

    if (inputEl) {
        inputEl.classList.add('error');
    }
}

function showCoachError(fieldName, message) {
    const errorEl = document.getElementById(`error-${fieldName}`);
    const inputEl = document.getElementById(fieldName);

    if (errorEl) {
        errorEl.textContent = message;
    }

    if (inputEl) {
        inputEl.classList.add('error');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('#customer-form .form-error');
    errorElements.forEach(el => el.textContent = '');

    const inputElements = document.querySelectorAll('#customer-form .error');
    inputElements.forEach(el => el.classList.remove('error'));
}

function clearCoachErrors() {
    const errorElements = document.querySelectorAll('#coach-form .form-error');
    errorElements.forEach(el => el.textContent = '');

    const inputElements = document.querySelectorAll('#coach-form .error');
    inputElements.forEach(el => el.classList.remove('error'));
}

function showResult(container, type, message) {
    container.style.display = 'block';
    container.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    container.innerHTML = message;
}

function collectUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || ''
    };
}

async function simulateSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Log data to console for demo
    console.log('Form submitted:', data);

    // In production, you would send this to Google Apps Script:
    /*
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Submission failed');
    }
    */

    return { success: true };
}

// =============================================
// Smooth Scrolling for Anchor Links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
